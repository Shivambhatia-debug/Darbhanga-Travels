# Fix Hostinger Folder Structure

## Current Problem:
```
public_html/api/
├── admin/          ✅ Keep this
├── admin1/         ❌ DELETE - Duplicate folder
├── api/            ❌ DELETE - Wrong nested folder
├── user/           ✅ Keep this
└── ...
```

## Correct Structure Should Be:
```
public_html/api/
├── .htaccess       ✅ Keep
├── admin/          ✅ Keep - Contains dashboard.php, bookings.php, etc.
│   ├── .htaccess
│   ├── dashboard.php
│   ├── bookings.php
│   ├── login.php
│   └── verify.php
├── user/           ✅ Keep
│   ├── login.php
│   └── verify.php
└── uploads/        ✅ Keep if exists
```

## Steps to Fix:

### Step 1: Delete Duplicate/Incorrect Folders
1. Go to Hostinger File Manager
2. Navigate to `public_html/api/`
3. **DELETE `admin1` folder** - This is a duplicate
4. **DELETE `api` folder** - This is incorrectly nested (should not exist inside api/)

### Step 2: Verify Admin Folder Contents
1. Open `public_html/api/admin/` folder
2. Ensure these files exist:
   - ✅ `dashboard.php`
   - ✅ `bookings.php`
   - ✅ `login.php`
   - ✅ `verify.php`
   - ✅ `customers.php`
   - ✅ `users.php`

### Step 3: Check File Permissions
- PHP files should be: `644` (-rw-r--r--)
- Folders should be: `755` (drwxr-xr-x)

### Step 4: Test After Cleanup
1. Visit: `https://darbhangatravels.com/api/admin/dashboard.php`
2. Should return JSON (not 404)

## Why This Matters:
- Duplicate folders can cause confusion
- Nested `api/api/` folder breaks routing
- Only `public_html/api/admin/` should exist (not `admin1` or nested `api`)

## After Cleanup:
The 409 Conflict error should disappear, and API endpoints should work correctly.






