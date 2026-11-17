#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Hot 100 通关舱 —— 本地静态服务器

只启动服务、不刷屏：正常请求一律不打印，只有真正的错误才会出现。
"""

import ctypes
import os
import socket
import sys
import threading
import time
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HOST = "127.0.0.1"
PORT = 8791
ROOT = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- 终端着色

C = {
    "reset": "\033[0m",
    "dim": "\033[2m",
    "bold": "\033[1m",
    "cyan": "\033[36m",
    "green": "\033[32m",
    "yellow": "\033[33m",
    "red": "\033[31m",
    "grey": "\033[90m",
}


def enable_ansi() -> bool:
    """Windows 10+ 打开 VT 转义支持；失败就退回无色输出。"""
    if os.name != "nt":
        return True
    try:
        k = ctypes.windll.kernel32
        k.SetConsoleMode(k.GetStdHandle(-11), 7)
        return True
    except Exception:
        return False


def paint(text: str, *styles: str) -> str:
    return "".join(C[s] for s in styles) + text + C["reset"]


# ---------------------------------------------------------------- 处理器


class QuietHandler(SimpleHTTPRequestHandler):
    """抑制访问日志：2xx / 3xx 不打印，4xx / 5xx 才提示。"""

    server_version = "Hot100/1.0"
    sys_version = ""

    def log_request(self, code="-", size="-"):
        try:
            status = int(code)
        except (TypeError, ValueError):
            status = 0
        if status >= 400:
            line = f'  {paint("!", "yellow")} {self.command} {self.path} → {status}'
            print(line, flush=True)

    def log_error(self, fmt, *args):
        # 默认那条 "code 404, message File not found" 也一并静音
        pass

    def log_message(self, fmt, *args):
        pass

    def end_headers(self):
        # 本地开发：永远拿最新文件，避免改了代码还看到旧页面
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def do_GET(self):
        if self.path.split("?")[0] == "/favicon.ico":
            self.send_response(204)
            self.end_headers()
            return
        super().do_GET()

    def do_HEAD(self):
        if self.path.split("?")[0] == "/favicon.ico":
            self.send_response(204)
            self.end_headers()
            return
        super().do_HEAD()


class Server(ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True


# ---------------------------------------------------------------- 输出


def print_banner(url: str) -> None:
    out = sys.stdout
    out.write("\n")
    out.write("  " + paint("Hot 100 通关舱", "bold", "cyan") + "\n")
    out.write("  " + paint("─" * 42, "grey") + "\n")
    out.write("  " + paint("地址  ", "dim") + paint(url, "green") + "\n")
    out.write("  " + paint("目录  ", "dim") + paint(ROOT, "grey") + "\n")
    out.write("  " + paint("状态  ", "dim") + paint("运行中", "green")
              + paint("  关掉这个窗口即停止服务", "dim") + "\n")
    out.write("  " + paint("─" * 42, "grey") + "\n")
    out.write("\n")
    out.flush()


def port_in_use() -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.4)
        return s.connect_ex((HOST, PORT)) == 0


# ---------------------------------------------------------------- 主流程


def main() -> int:
    colored = enable_ansi()
    if not colored:
        for k in C:
            C[k] = ""

    os.chdir(ROOT)

    if port_in_use():
        print()
        print("  " + paint("× 端口 " + str(PORT) + " 已被占用", "red", "bold"))
        print("  " + paint("  可能已经有一个窗口在跑这个服务了。", "dim"))
        print("  " + paint("  先关掉那个窗口，或者直接在浏览器打开：", "dim"))
        print("  " + paint("  http://%s:%d/" % (HOST, PORT), "cyan"))
        print()
        return 1

    try:
        httpd = Server((HOST, PORT), QuietHandler)
    except OSError as exc:
        print()
        print("  " + paint("× 启动失败：" + str(exc), "red", "bold"))
        print()
        return 1

    url = "http://%s:%d/" % (HOST, PORT)
    print_banner(url)

    # 先绑定端口再开浏览器，避免出现“连接被拒绝”
    threading.Thread(
        target=lambda: (time.sleep(0.35), webbrowser.open(url + "index.html")),
        daemon=True,
    ).start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.shutdown()
        httpd.server_close()
        print()
        print("  " + paint("服务已停止", "dim"))
        print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
