# 🔧 Localhost Login Fix - Complete Guide

## ✅ Fixes Applied

### 1. Database Configuration (`backend/config/database.php`)
- ✅ Created complete database configuration file
- ✅ Auto-detects localhost vs production
- ✅ Localhost uses: `darbhangatravels_db` database, `root` user, no password

### 2. Login API (`backend/api/admin/login.php`)
- ✅ Created complete login API file
- ✅ Proper error handling and JSON responses
- ✅ Input validation and security checks

## 🚀 How to Start Servers Correctly

### **Important: PHP Server MUST be started with `-t backend` flag!**

### Option 1: Use the Batch File (Easiest)
```bash
start_servers.bat
```

### Option 2: Start Manually

**Terminal 1 - PHP Server:**
```bash
cd "C:\Users\shiva\Dbg trvls web"
php -S localhost:8000 -t backend
```

**Terminal 2 - Next.js Server:**
```bash
cd "C:\Users\shiva\Dbg trvls web"
npm run dev
```

### Option 3: Quick Start Script
```bash
# Test database connection first
php backend/test_login_api.php

# Then start servers
start_servers.bat
```

## ⚠️ Common Mistakes

### ❌ WRONG:
```bash
php -S localhost:8000
```
This will give 404 errors because it's looking in the wrong directory.

### ✅ CORRECT:
```bash
php -S localhost:8000 -t backend
```
The `-t backend` flag sets the document root to the backend folder.

## 🧪 Testing

### 1. Test Database Connection:
```bash
php backend/test_login_api.php
```

### 2. Test PHP Server:
```bash
# After starting PHP server, test in browser:
http://localhost:8000/api/admin/login.php
```

You should see a JSON response (not 404).

### 3. Test Login:
1. Make sure both servers are running
2. Open: http://localhost:3000/admin
3. Login with:
   - Username: `admin`
   - Password: `admin123`

## 🔍 Troubleshooting

### Problem: 404 Error - "No such file or directory"
**Solution:** Make sure PHP server is started with `-t backend` flag:
```bash
php -S localhost:8000 -t backend
```

### Problem: Database Connection Error
**Solution:** 
1. Make sure MySQL is running (XAMPP/WAMP)
2. Check database exists: `darbhangatravels_db`
3. Run: `php backend/test_login_api.php`

### Problem: "Invalid credentials"
**Solution:**
1. Run: `php backend/test_login_api.php`
2. This will create/reset admin user if needed
3. Default credentials: `admin` / `admin123`

## 📝 File Locations

- **Database Config:** `backend/config/database.php`
- **Login API:** `backend/api/admin/login.php`
- **Test Script:** `backend/test_login_api.php`
- **Start Script:** `start_servers.bat`

## ✅ Verification Checklist

- [ ] MySQL is running (check XAMPP/WAMP)
- [ ] Database `darbhangatravels_db` exists
- [ ] PHP server started with: `php -S localhost:8000 -t backend`
- [ ] Next.js server running on port 3000
- [ ] Test script passes: `php backend/test_login_api.php`
- [ ] Can access: http://localhost:8000/api/admin/login.php
- [ ] Login page loads: http://localhost:3000/admin

## 🎯 Quick Fix Commands

```bash
# Stop any running PHP servers first (Ctrl+C)

# Test database
php backend/test_login_api.php

# Start PHP server correctly
php -S localhost:8000 -t backend

# In another terminal, start Next.js
npm run dev
```

---

**Remember:** Always use `-t backend` flag when starting PHP server! 🚀



