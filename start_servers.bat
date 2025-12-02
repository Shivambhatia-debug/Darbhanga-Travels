@echo off
echo Starting Darbhanga Travels Admin Panel...
echo.

echo Step 1: Setting up database...
php backend/quick_setup.php
echo.

echo Step 2: Starting PHP server on port 8000...
start "PHP Server" cmd /k "php -S localhost:8000 -t backend"

echo Step 3: Starting Next.js server on port 3000...
start "Next.js Server" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting...
echo.
echo 🌐 Admin Panel: http://localhost:3000/admin
echo 🔧 Backend API: http://localhost:8000/api/admin/
echo.
echo Login credentials:
echo Username: admin
echo Password: admin123
echo.
pause




































