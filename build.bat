@echo off
setlocal
cd /d "%~dp0"
set "PYTHONUTF8=1"
set "PYTHONUNBUFFERED=1"

echo [1/3] checking deps...
python -m pip install --disable-pip-version-check -q pystray pillow pyinstaller
if errorlevel 1 goto fail

echo [2/3] building icon assets\hot100.ico ...
python -c "from PIL import Image; im=Image.open(r'assets\whale-girl-face.png').convert('RGBA'); im.save(r'assets\hot100.ico', sizes=[(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)]); print('  ok')"
if errorlevel 1 goto fail

echo [3/3] packing Hot100 (onedir)...
REM 用 --onedir 而不是 --onefile：
REM   onefile 的引导程序要往 %%TEMP%% 解包出 _MEIxxxxxx 目录，
REM   在部分 Windows 11 构建（24H2/25H2）上会报
REM   "Could not create temporary directory!" 直接弹错退出。
REM   onedir 不解包，把运行库放在 _internal\ 里，稳定得多。
set "BUILDTMP=%TEMP%\hot100_build"
rmdir /s /q "%BUILDTMP%" 2>nul
python -m PyInstaller --noconfirm --clean --onedir --windowed --name Hot100 --distpath "%BUILDTMP%" --icon "assets\hot100.ico" tray_server.py
if errorlevel 1 goto fail

REM 把产物并回项目根目录 —— 托盘程序靠「exe 同目录」找 serve.py 和网页文件
xcopy /e /i /y /q "%BUILDTMP%\Hot100\*" "%~dp0" >nul
rmdir /s /q "%BUILDTMP%" 2>nul
rmdir /s /q "%~dp0build" 2>nul

echo.
echo ============================================
echo   DONE: Hot100.exe  (+ _internal\)
echo   双击 Hot100.exe 即可，右下角有托盘图标。
echo ============================================
goto done

:fail
echo.
echo BUILD FAILED. Send the error output back.
:done
endlocal
