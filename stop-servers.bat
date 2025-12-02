@echo off
echo Stopping Darbhanga Travels Servers...
echo.

REM Kill Node.js processes (Next.js)
echo Stopping Next.js Dev Server...
taskkill /F /IM node.exe /T >nul 2>&1
if %errorlevel% equ 0 (
    echo Next.js server stopped successfully
) else (
    echo No Next.js server was running
)

REM Kill PHP processes
echo Stopping PHP Backend Server...
taskkill /F /IM php.exe /T >nul 2>&1
if %errorlevel% equ 0 (
    echo PHP server stopped successfully
) else (
    echo No PHP server was running
)

echo.
echo All servers stopped!
echo.
pause









