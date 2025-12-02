@echo off
echo ========================================
echo MySQL Troubleshooting Script
echo ========================================
echo.

echo [1] Checking if MySQL port 3306 is in use...
netstat -ano | findstr :3306
if %errorlevel% == 0 (
    echo WARNING: Port 3306 is already in use!
    echo This might prevent MySQL from starting.
    echo.
    echo To see which process is using port 3306:
    netstat -ano | findstr :3306
    echo.
    echo To kill the process, note the PID (last number) and run:
    echo taskkill /PID [PID_NUMBER] /F
    echo.
) else (
    echo Port 3306 is free.
)
echo.

echo [2] Checking XAMPP MySQL directory...
if exist "C:\xampp\mysql\data" (
    echo MySQL data directory exists: C:\xampp\mysql\data
) else (
    echo WARNING: MySQL data directory not found!
)
echo.

echo [3] Checking for MySQL processes...
tasklist | findstr /i "mysqld mysql"
if %errorlevel% == 0 (
    echo MySQL processes found (might be conflicting)
) else (
    echo No MySQL processes running
)
echo.

echo ========================================
echo Solutions:
echo ========================================
echo.
echo 1. Check XAMPP Control Panel logs:
echo    - Click on MySQL "Logs" button in XAMPP
echo    - Look for error messages
echo.
echo 2. Try these steps:
echo    - Stop MySQL in XAMPP (if showing as running)
echo    - Close XAMPP Control Panel completely
echo    - Run XAMPP as Administrator (Right-click -^> Run as Administrator)
echo    - Start MySQL again
echo.
echo 3. If port 3306 is in use:
echo    - Find the PID from step 1
echo    - Run: taskkill /PID [PID] /F
echo    - Then try starting MySQL again
echo.
echo 4. If MySQL keeps failing:
echo    - Check Windows Event Viewer for MySQL errors
echo    - Look at C:\xampp\mysql\data\*.err files
echo.
echo ========================================
pause

