@echo off
echo ========================================
echo Fixing Status Column in Database
echo ========================================
echo.

echo Running PHP script to fix status column...
php backend/fix_status_column.php

echo.
echo ========================================
echo Fix completed!
echo ========================================
echo.
echo Now you can update status to any value.
echo.
pause



