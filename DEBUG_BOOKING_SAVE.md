# Debug Booking Save Issue

## Current Status

Booking form is stuck on "Saving..." - need to debug to find the exact issue.

## Debug Steps Added

### 1. Frontend Console Logging
Added console.log statements in `app/admin/customers/add/page.tsx`:
- Logs booking data being sent
- Logs response status
- Logs response ok status
- Logs success/error responses
- Logs catch errors

### 2. Backend Error Logging
Added error_log in `backend/api/admin/bookings.php`:
- Logs received booking data
- Logs customer creation
- Logs database errors
- Logs server errors

## How to Debug

### Step 1: Open Browser Console
1. Press `F12` to open DevTools
2. Go to **Console** tab
3. Clear console (trash icon)
4. Try submitting the form
5. Look for these logs:

```
Sending booking data: { customer_name: "...", ... }
Response status: 200 (or error code)
Response ok: true/false
Success response: { ... } OR Error response: { ... }
```

### Step 2: Check Network Tab
1. In DevTools, go to **Network** tab
2. Filter by "Fetch/XHR"
3. Submit the form
4. Look for `/api/admin/bookings.php` request
5. Click on it and check:
   - **Headers** tab: Request headers, status code
   - **Payload** tab: Data being sent
   - **Response** tab: Server response
   - **Timing** tab: How long it took

### Step 3: Check PHP Backend Logs
1. Look at terminal where PHP server is running
2. Check for these logs:
```
Received booking data: {...}
Found existing customer with ID: X
OR
Created new customer with ID: X
Database error: ... (if any)
```

## Common Issues & Solutions

### Issue 1: Network Timeout
**Symptoms:** Request takes forever, no response
**Solution:**
- Check if PHP backend is running: `netstat -ano | findstr :8000`
- Restart PHP server: `cd backend && php -S localhost:8000`

### Issue 2: Database Error
**Symptoms:** Response status 500, error in PHP logs
**Possible causes:**
- Database not running
- Table columns missing
- Foreign key constraint error

**Solution:**
```bash
# Check MySQL is running
# Open XAMPP/WAMP and start MySQL

# Run database schema
mysql -u root -p < backend/database/create_tables.sql
```

### Issue 3: Invalid Data Format
**Symptoms:** Response status 400 or validation error
**Solution:**
- Check console logs for data being sent
- Verify all required fields are filled
- Check date format (should be YYYY-MM-DD)
- Check numeric fields are numbers, not strings

### Issue 4: Authentication Error
**Symptoms:** Response status 401 or 403
**Solution:**
- Check if admin_token exists in localStorage
- Re-login to get fresh token
- Check PHP backend verifies token correctly

### Issue 5: CORS Error
**Symptoms:** "CORS policy" error in console
**Solution:**
- Check backend has CORS headers
- Verify PHP backend is on localhost:8000
- Check Next.js proxy is working

## Test Files Created

### 1. test-booking-api.html
Simple HTML page to test API directly:
```bash
# Open in browser
http://localhost:3000/test-booking-api.html

# Click "Test Booking Creation" button
# Check result
```

### 2. Manual cURL Test
```bash
# Test PHP backend directly
curl -X POST http://localhost:8000/api/admin/bookings.php \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Test","customer_phone":"1234567890","service":"train","from":"Delhi","to":"Mumbai","date":"2024-12-15","booking_date":"2024-11-08","passengers":1,"amount":1000,"total_amount":1000,"paid_amount":500,"pending_amount":500,"status":"new_booking","payment_status":"partial"}'
```

## Expected Flow

1. **User fills form** → formData populated
2. **User clicks "Create Booking"** → handleSubmit called
3. **Validation passes** → setIsLoading(true)
4. **PDF upload (if any)** → Upload to /api/admin/upload-ticket.php
5. **Prepare bookingData** → All fields formatted correctly
6. **Console log** → "Sending booking data: {...}"
7. **Fetch API call** → POST to /api/admin/bookings.php
8. **Next.js proxy** → Forwards to PHP backend
9. **PHP receives** → Logs "Received booking data: {...}"
10. **Create customer** → If new, insert into customers table
11. **Insert booking** → Insert into bookings table with all fields
12. **Insert passengers** → Insert into passenger_details table
13. **Return success** → { success: true, id: X }
14. **Frontend receives** → Console log "Success response: {...}"
15. **Show toast** → "Booking Created Successfully! 🎉"
16. **Redirect** → router.push('/admin/bookings')

## Where It's Stuck?

Based on console logs, identify where the flow stops:

- **No console logs at all** → JavaScript error before handleSubmit
- **"Sending booking data" but no response** → Network/timeout issue
- **Response status 500** → PHP backend error (check PHP logs)
- **Response status 400** → Validation error (check error message)
- **Success but stuck** → Router.push not working
- **"Saving..." forever** → setIsLoading(false) not called

## Quick Fixes

### Fix 1: Clear Everything and Restart
```bash
# Stop all servers
taskkill /F /IM node.exe
taskkill /F /IM php.exe

# Start fresh
cd backend && php -S localhost:8000
# In new terminal
npm run dev

# Clear browser cache
Ctrl+Shift+Delete

# Try again
```

### Fix 2: Check Database Tables
```sql
USE darbhangatravels_db;

-- Check if tables exist
SHOW TABLES;

-- Check bookings table structure
DESCRIBE bookings;

-- Check if train columns exist
SHOW COLUMNS FROM bookings LIKE 'train%';
```

### Fix 3: Simplify Test
Try creating a booking with minimal data:
- Only required fields
- No train details
- No passenger details
- No PDF upload

If this works, add fields one by one to find the problematic field.

## Next Steps

1. **Try submitting the form**
2. **Open console (F12)**
3. **Check what logs appear**
4. **Share the console output** to identify the exact issue

---

**Debug tools added:** Console logging, error logging, test page  
**Date:** November 8, 2025  
**Status:** Waiting for console output to identify issue








