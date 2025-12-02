@echo off
echo Starting Darbhanga Travels Servers...
echo.

REM Start PHP Backend Server
echo Starting PHP Backend Server on port 8000...
start "PHP Backend" cmd /k "cd backend && php -S localhost:8000"

REM Wait for 2 seconds
timeout /t 2 /nobreak >nul

REM Start Next.js Dev Server
echo Starting Next.js Dev Server on port 3000...
start "Next.js Dev" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo PHP Backend: http://localhost:8000
echo Next.js Frontend: http://localhost:3000
echo Admin Panel: http://localhost:3000/admin
echo.
echo Press any key to exit this window (servers will keep running)...
pause >nul









