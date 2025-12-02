@echo off
echo ========================================
echo Adding Train Columns to Database
echo ========================================
echo.

echo This will add the following columns to the bookings table:
echo - train_number
echo - train_name
echo - class
echo - departure_time
echo - arrival_time
echo - duration
echo - fare_per_person
echo.

echo Attempting to add columns...
echo.

mysql -u root darbhangatravels_db < backend/database/add_train_columns.sql

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! Train columns added.
    echo ========================================
    echo.
    echo Now you can:
    echo 1. Refresh the browser
    echo 2. Try creating a booking again
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Could not add columns
    echo ========================================
    echo.
    echo Possible reasons:
    echo 1. MySQL is not running
    echo 2. Database doesn't exist
    echo 3. MySQL command not in PATH
    echo.
    echo Manual Solution:
    echo 1. Open phpMyAdmin
    echo 2. Select darbhangatravels_db database
    echo 3. Go to SQL tab
    echo 4. Copy and paste contents from:
    echo    backend/database/add_train_columns.sql
    echo 5. Click Go
    echo.
)

pause








