-- Add user_id column to bookings table to track which admin/user created the booking

-- Check if user_id column exists, if not add it
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS user_id INT NULL AFTER customer_id;

-- Add foreign key constraint if admins table exists
-- ALTER TABLE bookings 
-- ADD CONSTRAINT fk_bookings_user 
-- FOREIGN KEY (user_id) REFERENCES admins(id) ON DELETE SET NULL;

-- For MySQL versions that don't support IF NOT EXISTS in ALTER TABLE
-- Run this manually in phpMyAdmin:
-- ALTER TABLE bookings ADD COLUMN user_id INT NULL AFTER customer_id;



