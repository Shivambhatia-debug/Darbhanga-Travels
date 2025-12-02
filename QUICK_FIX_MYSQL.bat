@echo off
echo ========================================
echo QUICK MySQL Fix - Aria Error Solution
echo ========================================
echo.

echo This will fix the Aria recovery error.
echo.
echo IMPORTANT: Close XAMPP Control Panel first!
echo.
pause

echo.
echo Stopping MySQL...
taskkill /F /IM mysqld.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Fixing Aria errors...
cd /d C:\xampp\mysql\data

echo Step 1: Deleting corrupted Aria log files...
if exist aria_log.* (
    del /Q aria_log.*
    echo Deleted aria_log files.
) else (
    echo No aria_log files found.
)

if exist aria_log_control (
    del /Q aria_log_control
    echo Deleted aria_log_control.
)

echo.
echo Step 2: Repairing Aria tables...
cd /d C:\xampp\mysql\bin
if exist aria_chk.exe (
    echo Repairing mysql database tables...
    aria_chk.exe -r "C:\xampp\mysql\data\mysql\*.MAI" >nul 2>&1
    aria_chk.exe -r "C:\xampp\mysql\data\mysql\*.MAD" >nul 2>&1
    echo Repair completed.
) else (
    echo aria_chk.exe not found. Continuing...
)

echo.
echo ========================================
echo Fix completed!
echo ========================================
echo.
echo Now:
echo 1. Open XAMPP Control Panel
echo 2. Start MySQL
echo.
echo If MySQL still doesn't start, we'll fix the mysql.plugin table.
echo.
pause

