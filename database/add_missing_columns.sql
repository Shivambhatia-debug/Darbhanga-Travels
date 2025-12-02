-- Add missing columns to bookings table
-- Run this SQL on your Hostinger database

USE u363779306_dbg_travels;

-- Add missing columns to bookings table
ALTER TABLE bookings 
ADD COLUMN total_amount DECIMAL(10,2) DEFAULT 0.00 AFTER amount,
ADD COLUMN paid_amount DECIMAL(10,2) DEFAULT 0.00 AFTER total_amount,
ADD COLUMN pending_amount DECIMAL(10,2) DEFAULT 0.00 AFTER paid_amount,
ADD COLUMN booking_date DATE NULL AFTER travel_date;

-- Update existing records to set total_amount = amount
UPDATE bookings SET total_amount = amount WHERE total_amount = 0.00;

-- Add index for better performance
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX idx_bookings_paid_amount ON bookings(paid_amount);

















