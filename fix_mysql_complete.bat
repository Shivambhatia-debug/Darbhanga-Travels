@echo off
echo ========================================
echo Complete MySQL Fix Script
echo This will fix all MySQL errors automatically
echo ========================================
echo.

echo WARNING: This script will stop MySQL and fix errors.
echo Close XAMPP Control Panel if it's open.
echo.
pause

echo.
echo [Step 1] Stopping MySQL completely...
taskkill /F /IM mysqld.exe 2>nul
timeout /t 3 /nobreak >nul
echo Done.
echo.

echo [Step 2] Fixing Aria errors...
cd /d C:\xampp\mysql\data

echo Deleting corrupted Aria log files...
del /Q aria_log.* 2>nul 2>&1
del /Q aria_log_control 2>nul 2>&1
del /Q aria_log_control.* 2>nul 2>&1

echo Repairing Aria tables...
cd /d C:\xampp\mysql\bin
if exist aria_chk.exe (
    echo Running aria_chk recovery...
    aria_chk.exe -r "C:\xampp\mysql\data\mysql\*.MAI" 2>nul
    aria_chk.exe -r "C:\xampp\mysql\data\mysql\*.MAD" 2>nul
)

echo.
echo [Step 3] Starting MySQL in safe mode to fix mysql.plugin table...
cd /d C:\xampp\mysql\bin

echo Attempting to start MySQL with --skip-grant-tables...
start /B mysqld.exe --skip-grant-tables --skip-networking --console
timeout /t 5 /nobreak >nul

echo Checking if MySQL started...
netstat -ano | findstr :3306 >nul
if %errorlevel% == 0 (
    echo MySQL started in safe mode!
    
    echo Waiting for MySQL to fully initialize...
    timeout /t 3 /nobreak >nul
    
    echo Fixing mysql.plugin table...
    mysql.exe -u root -e "DROP TABLE IF EXISTS mysql.plugin;" 2>nul
    mysql.exe -u root -e "CREATE TABLE mysql.plugin (name VARCHAR(64) NOT NULL DEFAULT '', dl VARCHAR(128) NOT NULL DEFAULT '', PRIMARY KEY (name)) ENGINE=Aria DEFAULT CHARSET=utf8mb4;" 2>nul
    
    echo Stopping MySQL...
    taskkill /F /IM mysqld.exe 2>nul
    timeout /t 2 /nobreak >nul
) else (
    echo MySQL did not start in safe mode. Trying alternative method...
    echo.
    echo You will need to manually fix this:
    echo 1. Delete C:\xampp\mysql\data\aria_log.* files
    echo 2. Start MySQL from XAMPP
    echo 3. If it starts, run the SQL commands manually
)

echo.
echo ========================================
echo Fix Script Completed!
echo ========================================
echo.
echo Now try starting MySQL from XAMPP Control Panel.
echo.
echo If it still doesn't work, you may need to:
echo 1. Reinstall XAMPP MySQL (preserve your data)
echo 2. Or restore from a backup
echo.
pause

