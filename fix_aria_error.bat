@echo off
echo ========================================
echo MySQL Aria Recovery Fix Script
echo ========================================
echo.

echo WARNING: This script will fix MySQL Aria errors.
echo Make sure MySQL is STOPPED in XAMPP before running this!
echo.
pause

echo.
echo [Step 1] Stopping any running MySQL processes...
taskkill /F /IM mysqld.exe 2>nul
timeout /t 2 /nobreak >nul
echo Done.
echo.

echo [Step 2] Deleting Aria log files...
cd /d C:\xampp\mysql\data
if exist aria_log.* (
    echo Found Aria log files. Deleting...
    del /Q aria_log.* 2>nul
    echo Aria log files deleted.
) else (
    echo No Aria log files found.
)
echo.

echo [Step 3] Checking for aria_log_control file...
if exist aria_log_control (
    echo Found aria_log_control file.
    echo You may need to delete this manually if recovery fails.
) else (
    echo No aria_log_control file found.
)
echo.

echo [Step 4] Running aria_chk recovery on Aria tables...
cd /d C:\xampp\mysql\bin
if exist aria_chk.exe (
    echo Running aria_chk recovery...
    aria_chk.exe -r "C:\xampp\mysql\data\mysql\*.MAI" 2>nul
    aria_chk.exe -r "C:\xampp\mysql\data\mysql\*.MAD" 2>nul
    echo Aria recovery completed.
) else (
    echo aria_chk.exe not found in C:\xampp\mysql\bin
    echo Skipping aria recovery step.
)
echo.

echo [Step 5] Fixing mysql.plugin table...
echo This will be done after MySQL starts.
echo.

echo ========================================
echo Fix Steps Completed!
echo ========================================
echo.
echo Next Steps:
echo 1. Go to XAMPP Control Panel
echo 2. Start MySQL
echo 3. If it still fails, we'll need to repair the mysql.plugin table
echo.
echo If MySQL still doesn't start, run the advanced fix script.
echo.
pause

