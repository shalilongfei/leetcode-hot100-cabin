@echo off
setlocal
chcp 65001 >nul 2>&1
cd /d "%~dp0"
title Hot 100

set "PYTHONUTF8=1"
set "PYTHONIOENCODING=utf-8"
set "PYTHONUNBUFFERED=1"
set "PY=python"

where python >nul 2>&1
if not errorlevel 1 goto run

where py >nul 2>&1
if errorlevel 1 goto nopython
set "PY=py -3"

:run
%PY% "%~dp0serve.py"
if errorlevel 1 pause
goto done

:nopython
echo.
echo   Python not found.
echo   Install Python 3.8+ and tick "Add Python to PATH".
echo   https://www.python.org/downloads/
echo.
pause

:done
endlocal
