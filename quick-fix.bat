@echo off
echo ========================================
echo Darbhanga Travels - Quick Fix Script
echo ========================================
echo.

echo Step 1: Stopping all existing servers...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM php.exe >nul 2>&1
echo [OK] All servers stopped
echo.

echo Step 2: Checking MySQL service...
sc query MySQL >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MySQL service found
) else (
    echo [WARNING] MySQL service not found
    echo Please make sure XAMPP/WAMP is installed and MySQL is running
)
echo.

echo Step 3: Testing database connection...
php -r "try { $pdo = new PDO('mysql:host=localhost;dbname=darbhangatravels_db', 'root', ''); echo '[OK] Database connected successfully'; } catch (Exception $e) { echo '[ERROR] Database connection failed'; echo PHP_EOL; echo 'Error: ' . $e->getMessage(); echo PHP_EOL; echo 'Please:'; echo PHP_EOL; echo '1. Start MySQL in XAMPP/WAMP'; echo PHP_EOL; echo '2. Create database: darbhangatravels_db'; echo PHP_EOL; echo '3. Import: backend/database/create_tables.sql'; }"
echo.

echo Step 4: Clearing Next.js cache...
if exist ".next" (
    rmdir /s /q ".next" >nul 2>&1
    echo [OK] Next.js cache cleared
) else (
    echo [INFO] No cache to clear
)
echo.

echo Step 5: Starting servers...
echo Starting PHP Backend Server...
start "PHP Backend" cmd /k "cd backend && php -S localhost:8000"
timeout /t 3 /nobreak >nul

echo Starting Next.js Dev Server...
start "Next.js Dev" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo Fix completed!
echo ========================================
echo.
echo Servers are starting...
echo Please wait 10-15 seconds before opening the browser
echo.
echo URLs:
echo - Admin Panel: http://localhost:3000/admin
echo - PHP Backend: http://localhost:8000
echo.
echo Login Credentials:
echo Username: admin
echo Password: admin123
echo.
echo If you still see issues:
echo 1. Check browser console (F12) for errors
echo 2. Check the server terminal windows for errors
echo 3. Read SETUP_GUIDE.md for detailed troubleshooting
echo.
pause








