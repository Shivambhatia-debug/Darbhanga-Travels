-- Fix Status Column in Bookings Table
-- This script changes the status column from ENUM to VARCHAR to support all status values

USE darbhangatravels_db;

-- Check if status column exists and is ENUM, then convert to VARCHAR
-- Step 1: Modify status column to VARCHAR if it's ENUM
ALTER TABLE bookings 
MODIFY COLUMN status VARCHAR(50) DEFAULT 'new_booking';

-- Step 2: Update payment_status to VARCHAR as well (if needed)
ALTER TABLE bookings 
MODIFY COLUMN payment_status VARCHAR(50) DEFAULT 'pending';

-- Step 3: Verify the change
SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'darbhangatravels_db' 
  AND TABLE_NAME = 'bookings' 
  AND COLUMN_NAME = 'status';

-- Success message
SELECT 'Status column updated to VARCHAR successfully!' as status;



