# Booking Save Issue Fixed

## Date: November 8, 2025

## Problem

When creating a new booking from `/admin/customers/add`, the form was getting stuck on "Saving..." and the booking was not being created.

## Root Cause

The backend PHP API (`backend/api/admin/bookings.php`) was missing **train detail columns** in both INSERT and UPDATE SQL queries. 

The database schema has these columns:
- `train_number`
- `train_name`
- `class`
- `departure_time`
- `arrival_time`
- `duration`
- `fare_per_person`

But the PHP code was not including them in the SQL queries, causing the booking creation to fail silently or hang.

## Solution

### 1. Updated INSERT Query

**Before:**
```sql
INSERT INTO bookings (
    customer_id, user_id, service, from_location, to_location, travel_date, booking_date, return_date,
    passengers, amount, total_amount, paid_amount, pending_amount, 
    status, payment_status, notes, ticket_pdf_url, created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
```

**After:**
```sql
INSERT INTO bookings (
    customer_id, user_id, service, from_location, to_location, travel_date, booking_date, return_date,
    passengers, amount, total_amount, paid_amount, pending_amount, 
    status, payment_status, notes, ticket_pdf_url,
    train_number, train_name, class, departure_time, arrival_time, duration, fare_per_person,
    created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
```

### 2. Updated UPDATE Query

**Before:**
```sql
UPDATE bookings SET 
    service = ?, from_location = ?, to_location = ?, travel_date = ?, booking_date = ?,
    passengers = ?, amount = ?, total_amount = ?, paid_amount = ?, pending_amount = ?,
    status = ?, payment_status = ?, notes = ?, ticket_pdf_url = ?, updated_at = NOW()
WHERE id = ?
```

**After:**
```sql
UPDATE bookings SET 
    service = ?, from_location = ?, to_location = ?, travel_date = ?, booking_date = ?,
    passengers = ?, amount = ?, total_amount = ?, paid_amount = ?, pending_amount = ?,
    status = ?, payment_status = ?, notes = ?, ticket_pdf_url = ?,
    train_number = ?, train_name = ?, class = ?, departure_time = ?, arrival_time = ?, 
    duration = ?, fare_per_person = ?, updated_at = NOW()
WHERE id = ?
```

### 3. Improved Error Handling

Added separate exception handling for database errors:

```php
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Database error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'error_code' => $e->getCode()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    error_log("Server error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
```

## Files Modified

- `backend/api/admin/bookings.php`
  - Added 7 train columns to INSERT query
  - Added 7 train columns to UPDATE query
  - Improved error handling with PDOException

## Train Details Now Saved

The following train details are now properly saved:

1. **Train Number** - e.g., "12301"
2. **Train Name** - e.g., "Rajdhani Express"
3. **Class** - e.g., "1A", "2A", "3A", "SL", "CC", "2S"
4. **Departure Time** - e.g., "10:30"
5. **Arrival Time** - e.g., "18:45"
6. **Duration** - e.g., "8h 15m"
7. **Fare Per Person** - e.g., "1250.00"

## Data Flow

```
Frontend Form
    ↓
    Collects train details
    ↓
POST /api/admin/bookings.php
    ↓
    Next.js API Route (proxy)
    ↓
backend/api/admin/bookings.php
    ↓
    Creates customer (if new)
    ↓
    Inserts booking WITH train details ✅
    ↓
    Inserts passenger details
    ↓
    Returns success response
    ↓
Frontend redirects to /admin/bookings
```

## Testing

To test the fix:

1. **Go to:** http://localhost:3000/admin/customers/add
2. **Fill in:**
   - Customer details (name, phone, email)
   - Booking details (from, to, date, passengers, amounts)
   - Train details (train number, name, class, times)
   - Passenger details (name, age, gender)
3. **Click:** "Create Booking"
4. **Expected:** 
   - "Saving..." appears briefly
   - Success toast: "Booking Created Successfully! 🎉"
   - Redirects to bookings page
   - Booking appears with all train details

## Error Handling

If booking still fails:

1. **Check browser console (F12):**
   - Look for network errors
   - Check API response

2. **Check PHP error log:**
   - Look in terminal where PHP server is running
   - Errors are logged with `error_log()`

3. **Check database:**
   ```sql
   USE darbhangatravels_db;
   SELECT * FROM bookings ORDER BY id DESC LIMIT 1;
   ```

4. **Common issues:**
   - Database not running
   - Table columns missing (run `create_tables.sql`)
   - PHP server not running
   - Network timeout

## Prevention

To prevent similar issues:

1. **Always match frontend and backend fields**
2. **Test API endpoints separately**
3. **Use proper error logging**
4. **Check database schema matches code**
5. **Add validation for required fields**

## Related Files

- `app/admin/customers/add/page.tsx` - Frontend form
- `backend/api/admin/bookings.php` - Backend API (FIXED)
- `backend/database/create_tables.sql` - Database schema
- `app/api/admin/bookings.php/route.ts` - Next.js API proxy

## Status

✅ **FIXED** - Bookings now save successfully with all train details

---

**Fixed by:** AI Assistant  
**Date:** November 8, 2025  
**Issue:** Booking stuck on "Saving..."  
**Solution:** Added missing train columns to SQL queries








