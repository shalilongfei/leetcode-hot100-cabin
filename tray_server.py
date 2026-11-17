#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Hot 100 通关舱 —— 托盘常驻外壳（无控制台窗口）

用法：
    pythonw tray_server.py     # 开发调试
    Hot100.exe                 # 打包后双击

行为：
    · 启动即拉起 serve.py，全程没有黑框
    · 右下角托盘图标：左键 = 打开页面，右键 = 菜单
    · 只有从托盘“退出”才会停服务；服务已在运行时直接复用
    · 单实例：重复双击只会打开页面，不会起第二个服务
"""

import ctypes
import os
import shutil
import socket
import subprocess
import sys
import threading
import time
import webbrowser

import pystray
from PIL import Image


# ---------------------------------------------------------------- 兼容性修补
def _tolerate_pystray_filter():
    """让 pystray 容忍 ChangeWindowMessageFilterEx 失败。

    pystray 建好托盘窗口后会调这个 API 去「允许收到 WM_TASKBARCREATED」，
    这只在进程被提权时才有意义。但在部分 Windows 11 构建（如 25H2）上，
    这个调用会以 WinError 5（拒绝访问）失败，而 pystray 的 errcheck
    会直接抛异常，结果托盘图标根本起不来。

    这里把 ERROR_ACCESS_DENIED 容错掉：顶多收不到任务栏重建消息，
    托盘本身照常工作。
    """
    try:
        import ctypes
        import pystray._util.win32 as _w32
        orig = _w32.ChangeWindowMessageFilterEx.errcheck

        def tolerant(result, func, args):
            # 这个调用纯粹是可选优化，失败也不影响托盘图标本身。
            # 注意：errcheck 里 ctypes.get_last_error() 拿不到真实错误码
            #（ctypes 自己会动这个槽），所以这里不做错误码判断，直接放过。
            return result or 0

        _w32.ChangeWindowMessageFilterEx.errcheck = tolerant
    except Exception:
        pass


_tolerate_pystray_filter()

HOST = "127.0.0.1"
PORT = 8791
URL = "http://%s:%d/" % (HOST, PORT)
PAGE = URL + "index.html"
MUTEX_NAME = "Global\\Hot100TraySingleInstance"
SERVE = "serve.py"
ERROR_ALREADY_EXISTS = 183

# ---------------------------------------------------------------- Job Object
# 让 serve.py 随托盘进程一起死：托盘被强杀时也不留孤儿服务占着端口。

JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE = 0x2000
JobObjectExtendedLimitInformation = 9


class IO_COUNTERS(ctypes.Structure):
    _fields_ = [(n, ctypes.c_ulonglong) for n in (
        "ReadOperationCount", "WriteOperationCount", "OtherOperationCount",
        "ReadTransferCount", "WriteTransferCount", "OtherTransferCount",
    )]


class JOBOBJECT_BASIC_LIMIT_INFORMATION(ctypes.Structure):
    _fields_ = [
        ("PerProcessUserTimeLimit", ctypes.c_longlong),
        ("PerJobUserTimeLimit", ctypes.c_longlong),
        ("LimitFlags", ctypes.c_ulong),
        ("MinimumWorkingSetSize", ctypes.c_size_t),
        ("MaximumWorkingSetSize", ctypes.c_size_t),
        ("ActiveProcessLimit", ctypes.c_ulong),
        ("Affinity", ctypes.c_size_t),
        ("PriorityClass", ctypes.c_ubyte),
        ("SchedulingClass", ctypes.c_ubyte),
    ]


class JOBOBJECT_EXTENDED_LIMIT_INFORMATION(ctypes.Structure):
    _fields_ = [
        ("BasicLimitInformation", JOBOBJECT_BASIC_LIMIT_INFORMATION),
        ("IoInfo", IO_COUNTERS),
        ("ProcessMemoryLimit", ctypes.c_size_t),
        ("JobMemoryLimit", ctypes.c_size_t),
        ("PeakProcessMemoryUsed", ctypes.c_size_t),
        ("PeakJobMemoryUsed", ctypes.c_size_t),
    ]


def make_job():
    """建一个“句柄关闭即杀光成员”的 Job，返回句柄（失败返回 None）。"""
    k = ctypes.windll.kernel32
    k.CreateJobObjectW.restype = ctypes.c_void_p
    k.CreateJobObjectW.argtypes = [ctypes.c_void_p, ctypes.c_wchar_p]
    k.SetInformationJobObject.argtypes = [ctypes.c_void_p, ctypes.c_int,
                                          ctypes.c_void_p, ctypes.c_ulong]
    job = k.CreateJobObjectW(None, None)
    if not job:
        return None
    info = JOBOBJECT_EXTENDED_LIMIT_INFORMATION()
    info.BasicLimitInformation.LimitFlags = JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE
    ok = k.SetInformationJobObject(job, JobObjectExtendedLimitInformation,
                                   ctypes.byref(info), ctypes.sizeof(info))
    if not ok:
        k.CloseHandle(job)
        return None
    return job


def assign_to_job(job, process) -> None:
    if not job:
        return
    try:
        handle = process._handle
    except Exception:
        return
    ctypes.windll.kernel32.AssignProcessToJobObject(job, ctypes.c_void_p(handle))


# ---------------------------------------------------------------- 基础工具


def app_root() -> str:
    """程序所在目录：源码运行取脚本目录，打包后取 exe 目录。"""
    if getattr(sys, "frozen", False):
        return os.path.dirname(os.path.abspath(sys.executable))
    return os.path.dirname(os.path.abspath(__file__))


def pythonw() -> str:
    """优先用 pythonw.exe 起服务 —— 它不分配控制台窗口。"""
    for name in ("pythonw", "pythonw.exe"):
        found = shutil.which(name)
        if found:
            return found
    here = os.path.join(os.path.dirname(os.path.abspath(sys.executable)), "pythonw.exe")
    if os.path.exists(here):
        return here
    return sys.executable


def port_open() -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.4)
        return s.connect_ex((HOST, PORT)) == 0


def single_instance() -> bool:
    k = ctypes.windll.kernel32
    k.CreateMutexW.restype = ctypes.c_void_p
    k.CreateMutexW(None, False, MUTEX_NAME)
    return k.GetLastError() != ERROR_ALREADY_EXISTS


def load_icon(root: str) -> Image.Image:
    for name in ("assets/hot100.ico", "assets/whale-girl-face.png"):
        path = os.path.join(root, name.replace("/", os.sep))
        try:
            return Image.open(path).convert("RGBA")
        except Exception:
            continue
    return Image.new("RGBA", (64, 64), (0, 0, 0, 0))


# ---------------------------------------------------------------- 服务进程


class Service:
    def __init__(self, root: str):
        self.root = root
        self.proc = None
        self.job = make_job()
        self.lock = threading.Lock()

    def start(self) -> None:
        with self.lock:
            if self.proc and self.proc.poll() is None:
                return
            if not self.job:
                self.job = make_job()
            proc = subprocess.Popen(
                [pythonw(), os.path.join(self.root, SERVE)],
                cwd=self.root,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            assign_to_job(self.job, proc)
            self.proc = proc

    def stop(self) -> None:
        with self.lock:
            proc, self.proc = self.proc, None
        if proc and proc.poll() is None:
            proc.terminate()
            try:
                proc.wait(timeout=3)
            except Exception:
                proc.kill()
        if self.job:
            try:
                ctypes.windll.kernel32.CloseHandle(self.job)
            except Exception:
                pass
            self.job = None

    def alive(self) -> bool:
        return bool(self.proc and self.proc.poll() is None)


# ---------------------------------------------------------------- 应用


class App:
    def __init__(self, root: str):
        self.root = root
        self.svc = Service(root)
        self.icon = None
        self._stop = threading.Event()

    # ---- 服务控制 ----

    def running(self) -> bool:
        return port_open()

    def ensure_started(self) -> bool:
        if self.running():
            return True
        self.svc.start()
        return self.wait_ready(5.0)

    def wait_ready(self, timeout: float = 5.0) -> bool:
        end = time.time() + timeout
        while time.time() < end:
            if self.running():
                return True
            time.sleep(0.25)
        return False

    def restart(self) -> None:
        self.svc.stop()
        time.sleep(0.3)
        self.ensure_started()
        threading.Thread(target=self.open_page, daemon=True).start()

    # ---- 界面动作 ----

    def open_page(self) -> None:
        try:
            webbrowser.open(PAGE)
        except Exception:
            pass

    def open_dir(self) -> None:
        try:
            os.startfile(self.root)
        except Exception:
            pass

    def quit(self) -> None:
        self._stop.set()
        self.svc.stop()
        if self.icon:
            try:
                self.icon.stop()
            except Exception:
                pass

    def status_text(self) -> str:
        if self.running():
            return "Hot 100 通关舱 — 运行中 · " + URL
        return "Hot 100 通关舱 — 服务未运行（右键可重启）"

    def watcher(self) -> None:
        while not self._stop.wait(1.0):
            if self.icon:
                try:
                    self.icon.title = self.status_text()
                except Exception:
                    pass

    # ---- 主循环 ----

    def run(self) -> None:
        self.ensure_started()

        menu = pystray.Menu(
            pystray.MenuItem("打开 Hot 100", lambda *a: self.open_page(), default=True),
            pystray.MenuItem("重启服务", lambda *a: self.restart()),
            pystray.Menu.SEPARATOR,
            pystray.MenuItem("打开项目目录", lambda *a: self.open_dir()),
            pystray.MenuItem("退出", lambda *a: self.quit()),
        )

        self.icon = pystray.Icon(
            "Hot100",
            load_icon(self.root),
            self.status_text(),
            menu,
        )

        threading.Thread(target=self.watcher, daemon=True).start()
        threading.Thread(target=self.open_page, daemon=True).start()

        try:
            self.icon.run()
        finally:
            self.svc.stop()


def main() -> int:
    if not single_instance():
        # 已经有一个托盘在跑：只把页面叫出来
        try:
            webbrowser.open(PAGE)
        except Exception:
            pass
        return 0

    root = app_root()
    if not os.path.exists(os.path.join(root, SERVE)):
        sys.stderr.write("找不到 %s（请把程序与 %s 放在同一目录）\n" % (SERVE, SERVE))
        return 1

    App(root).run()
    return 0


if __name__ == "__main__":
    sys.exit(main())
