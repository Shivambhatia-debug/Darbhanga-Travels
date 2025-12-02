@echo off
echo ========================================
echo Advanced MySQL Fix Script
echo This will fix Aria errors and mysql.plugin table
echo ========================================
echo.

echo WARNING: This script will:
echo - Delete corrupted Aria log files
echo - Repair Aria tables
echo - Fix mysql.plugin table
echo.
echo Make sure MySQL is COMPLETELY STOPPED!
echo.
pause

echo.
echo [Step 1] Force stopping MySQL...
taskkill /F /IM mysqld.exe 2>nul
timeout /t 3 /nobreak >nul
echo Done.
echo.

echo [Step 2] Backing up data directory (just in case)...
if not exist "C:\xampp\mysql\data_backup" (
    echo Creating backup directory...
    mkdir "C:\xampp\mysql\data_backup" 2>nul
)

echo.
echo [Step 3] Deleting corrupted Aria files...
cd /d C:\xampp\mysql\data

echo Deleting aria_log files...
del /Q aria_log.* 2>nul

echo Deleting aria_log_control (if exists)...
if exist aria_log_control (
    del /Q aria_log_control 2>nul
    echo aria_log_control deleted.
)

echo Checking for aria_log_control.* files...
for %%f in (aria_log_control.*) do (
    echo Deleting %%f
    del /Q "%%f" 2>nul
)

echo.
echo [Step 4] Repairing Aria tables in mysql database...
cd /d C:\xampp\mysql\bin

if exist aria_chk.exe (
    echo Running aria_chk on mysql database tables...
    if exist "C:\xampp\mysql\data\mysql\*.MAI" (
        for %%f in ("C:\xampp\mysql\data\mysql\*.MAI") do (
            echo Repairing %%f
            aria_chk.exe -r "%%f" 2>nul
        )
    )
    if exist "C:\xampp\mysql\data\mysql\*.MAD" (
        for %%f in ("C:\xampp\mysql\data\mysql\*.MAD") do (
            echo Repairing %%f
            aria_chk.exe -r "%%f" 2>nul
        )
    )
) else (
    echo aria_chk.exe not found. Skipping.
)

echo.
echo [Step 5] Preparing SQL script to fix mysql.plugin table...
cd /d "%~dp0"

echo Creating SQL fix script...
(
echo -- Fix mysql.plugin table
echo DROP TABLE IF EXISTS mysql.plugin;
echo CREATE TABLE mysql.plugin ^(
echo   name VARCHAR^(64^) NOT NULL DEFAULT '',
echo   dl VARCHAR^(128^) NOT NULL DEFAULT '',
echo   PRIMARY KEY ^(name^)
echo ^) ENGINE=Aria DEFAULT CHARSET=utf8mb4;
echo.
) > fix_plugin_table.sql

echo SQL script created: fix_plugin_table.sql
echo.

echo ========================================
echo Advanced Fix Completed!
echo ========================================
echo.
echo Next Steps:
echo 1. Start MySQL in XAMPP Control Panel
echo 2. If it starts successfully, run: mysql -u root -e "source fix_plugin_table.sql"
echo 3. Or run the automatic fix script that will do this for you
echo.
pause

