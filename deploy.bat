@echo off
echo ========================================
echo Darbhanga Travels - Deployment Script
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Building static version...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Failed to build application
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Go to Hostinger hPanel
echo 2. Open File Manager
echo 3. Navigate to public_html
echo 4. Upload all contents from 'dist' folder
echo 5. Connect your domain
echo.
echo See DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause





















