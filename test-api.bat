@echo off
echo Testing Darbhanga Travels API Endpoints...
echo.

echo Testing PHP Backend Server (localhost:8000)...
curl -s http://localhost:8000/api/admin/customers.php > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] PHP Backend is running
) else (
    echo [ERROR] PHP Backend is NOT running
    echo Please start it with: cd backend ^&^& php -S localhost:8000
)

echo.
echo Testing Next.js Dev Server (localhost:3000)...
curl -s http://localhost:3000 > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Next.js Dev Server is running
) else (
    echo [ERROR] Next.js Dev Server is NOT running
    echo Please start it with: npm run dev
)

echo.
echo Testing Database Connection...
php -r "try { $pdo = new PDO('mysql:host=localhost;dbname=darbhangatravels_db', 'root', ''); echo '[OK] Database connection successful'; } catch (Exception $e) { echo '[ERROR] Database connection failed: ' . $e->getMessage(); }"

echo.
echo.
echo Test completed!
pause








