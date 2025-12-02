# Hostinger Deployment Checklist

## Files to Upload to `public_html/api/admin/`

### Required PHP Files:
- ✅ `dashboard.php` - **MUST BE UPLOADED** (currently missing - causing 404)
- ✅ `bookings.php` - **MUST BE UPLOADED** (currently missing - causing 404)
- ✅ `login.php` - Already working ✅
- ✅ `verify.php`
- ✅ `customers.php`
- ✅ `users.php`
- ✅ `settings.php`
- ✅ `upload-ticket.php`

### Required .htaccess Files:
- ✅ `public_html/api/.htaccess` - Must allow PHP execution
- ✅ `public_html/api/admin/.htaccess` - Must allow PHP execution
- ✅ `public_html/.htaccess` - Must allow `/api/` routes to bypass SPA rewrite

## Quick Fix Steps:

1. **Upload Missing PHP Files:**
   - Go to Hostinger File Manager
   - Navigate to `public_html/api/admin/`
   - Upload `dashboard.php` and `bookings.php` from `backend/api/admin/` folder
   - Ensure file permissions are 644

2. **Verify .htaccess Files:**
   - Check `public_html/api/.htaccess` exists and has PHP execution enabled
   - Check `public_html/api/admin/.htaccess` exists
   - Check `public_html/.htaccess` has the API bypass rule (already fixed in code)

3. **Test API Endpoints:**
   - Visit: `https://darbhangatravels.com/api/admin/dashboard.php` (should return JSON)
   - Visit: `https://darbhangatravels.com/api/admin/bookings.php` (should return JSON)

## File Structure on Server:

```
public_html/
├── .htaccess (root - allows /api/ routes)
├── index.html (Next.js static export)
├── _next/ (Next.js static assets)
└── api/
    ├── .htaccess (allows PHP execution)
    ├── admin/
    │   ├── .htaccess (allows PHP execution)
    │   ├── dashboard.php ✅ NEEDS UPLOAD
    │   ├── bookings.php ✅ NEEDS UPLOAD
    │   ├── login.php ✅ Working
    │   └── verify.php
    └── user/
        ├── login.php ✅ Working
        └── verify.php
```

## Current Issue:
- Admin login works ✅
- Dashboard API returns 404 ❌ (file missing)
- Bookings API returns 404 ❌ (file missing)

## Solution:
Upload `dashboard.php` and `bookings.php` from `backend/api/admin/` to `public_html/api/admin/` on Hostinger.






