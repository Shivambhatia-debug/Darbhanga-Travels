@echo off
echo Starting MySQL...
cd C:\xampp
mysql\bin\mysqld.exe --defaults-file=mysql\bin\my.ini --standalone --console
pause

