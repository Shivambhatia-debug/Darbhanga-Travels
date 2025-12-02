# Darbhanga Travels - Setup Guide

## 🚀 Quick Start

### Method 1: Using Batch Files (Recommended)

1. **Start Both Servers:**
   - Double-click `start-servers.bat`
   - This will start both PHP backend (port 8000) and Next.js frontend (port 3000)

2. **Stop Both Servers:**
   - Double-click `stop-servers.bat`
   - This will stop all running servers

### Method 2: Manual Start

#### Start PHP Backend Server:
```bash
cd backend
php -S localhost:8000
```

#### Start Next.js Dev Server (in new terminal):
```bash
npm run dev
```

## 📦 Database Configuration

All backend files are configured with local database:
- **Host:** localhost
- **Database:** darbhangatravels_db
- **Username:** root
- **Password:** (empty)

## 🔐 Admin Login Credentials

- **Username:** admin
- **Password:** admin123

## 📱 Access URLs

- **Homepage:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Admin Login:** http://localhost:3000/admin/login
- **User Login:** http://localhost:3000/user/login
- **PHP Backend:** http://localhost:8000

## 🛠️ Troubleshooting

### Page Shows "0" for All Stats / No Data Loading

This is the most common issue. Follow these steps:

1. **Check if both servers are running:**
   ```bash
   # Run test-api.bat to check all services
   test-api.bat
   ```

2. **Verify database exists and has tables:**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Check if `darbhangatravels_db` database exists
   - If not, run: `backend/database/create_tables.sql`

3. **Check browser console for errors:**
   - Press `F12` to open DevTools
   - Go to Console tab
   - Look for any red errors
   - Common errors:
     - "Failed to fetch" → Backend server not running
     - "404 Not Found" → API route missing
     - "500 Internal Server Error" → Database connection issue

4. **Verify API routes are working:**
   - Open: http://localhost:3000/api/admin/customers.php
   - Should show JSON response (not 404)
   - If 404, restart Next.js server

5. **Check PHP backend directly:**
   - Open: http://localhost:8000/api/admin/customers.php
   - Should show JSON response
   - If error, check database connection

### Page Unresponsive Error

If you see "Page Unresponsive" error:

1. **Stop all servers:**
   ```bash
   # Run stop-servers.bat or manually:
   taskkill /F /IM node.exe
   taskkill /F /IM php.exe
   ```

2. **Clear browser cache:**
   - Press `Ctrl + Shift + Delete`
   - Clear cached images and files
   - Or use Incognito mode

3. **Restart servers:**
   - Run `start-servers.bat`
   - Wait 10-15 seconds for servers to fully start
   - Refresh browser

### Database Connection Error

If you see database connection errors:

1. **Check MySQL is running:**
   - Open XAMPP/WAMP/MAMP Control Panel
   - Start MySQL service

2. **Verify database exists:**
   - Open phpMyAdmin
   - Check if `darbhangatravels_db` database exists
   - If not, import: `backend/database/create_tables.sql`

3. **Create database and tables:**
   ```bash
   # Using MySQL command line
   mysql -u root -p < backend/database/create_tables.sql
   
   # Or import via phpMyAdmin
   ```

### API Returns Empty Data

If API calls return empty arrays:

1. **Check if tables have data:**
   ```sql
   USE darbhangatravels_db;
   SELECT COUNT(*) FROM customers;
   SELECT COUNT(*) FROM bookings;
   SELECT COUNT(*) FROM users;
   ```

2. **Add sample data:**
   - Uncomment the sample data section in `backend/database/create_tables.sql`
   - Run the SQL file again

3. **Check PHP errors:**
   - Look at terminal where PHP server is running
   - Check for any error messages

### Port Already in Use

If port 3000 or 8000 is already in use:

```bash
# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /F /PID <PID_NUMBER>

# Find and kill process on port 8000
netstat -ano | findstr :8000
taskkill /F /PID <PID_NUMBER>
```

### Admin Login Not Working

If admin login fails:

1. **Check if admin exists in database:**
   ```sql
   USE darbhangatravels_db;
   SELECT * FROM admins;
   ```

2. **Create admin if missing:**
   ```sql
   INSERT INTO admins (username, password, full_name, email) 
   VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin@darbhangatravels.com');
   ```
   Password: `admin123`

3. **Check browser console for errors**

### Quick Diagnostic Checklist

Run through this checklist if anything isn't working:

- [ ] MySQL service is running (check XAMPP/WAMP)
- [ ] Database `darbhangatravels_db` exists
- [ ] All tables exist (run `backend/database/check_tables.sql`)
- [ ] PHP backend server is running on port 8000
- [ ] Next.js dev server is running on port 3000
- [ ] No errors in browser console (F12)
- [ ] No errors in PHP terminal
- [ ] No errors in Next.js terminal
- [ ] Can access http://localhost:8000/api/admin/customers.php
- [ ] Can access http://localhost:3000/api/admin/customers.php

## 📂 Project Structure

```
Dbg trvls web/
├── app/                      # Next.js app directory
│   ├── admin/               # Admin panel pages
│   ├── user/                # User panel pages
│   └── api/                 # Next.js API routes (proxy to PHP)
├── backend/                 # PHP backend
│   └── api/                 # PHP API endpoints
│       ├── admin/           # Admin APIs
│       └── user/            # User APIs
├── components/              # React components
├── public/                  # Static files
├── start-servers.bat        # Start both servers
└── stop-servers.bat         # Stop both servers
```

## 🔧 Development Tips

1. **Always run both servers** - Frontend (Next.js) and Backend (PHP)
2. **Clear browser cache** if you see old data
3. **Check console** for any JavaScript errors
4. **Check terminal** for any server errors
5. **Use Incognito mode** for testing to avoid cache issues

## 📝 Features

### Admin Panel Features:
- ✅ Dashboard with statistics
- ✅ Booking management (all statuses)
- ✅ Customer management
- ✅ User management
- ✅ PDF ticket upload
- ✅ Calendar view
- ✅ Status filters

### User Panel Features:
- ✅ User login
- ✅ View own bookings
- ✅ Create new bookings
- ✅ View booking history
- ✅ Download tickets

## 🆘 Need Help?

If you're still facing issues:

1. Check if both servers are running:
   ```bash
   netstat -ano | findstr :3000
   netstat -ano | findstr :8000
   ```

2. Check browser console for errors (F12)

3. Check terminal for server errors

4. Try restarting your computer and running `start-servers.bat` again

## 📞 Support

For any issues, check the error messages in:
- Browser Console (F12)
- Terminal/Command Prompt
- Network tab in DevTools


