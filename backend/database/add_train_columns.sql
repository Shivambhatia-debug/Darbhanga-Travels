-- Add train columns to bookings table
-- Run this if you get error: "Column 'train_number' not found"

USE darbhangatravels_db;

-- Check if columns already exist before adding
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS train_number VARCHAR(20) AFTER ticket_pdf_url,
ADD COLUMN IF NOT EXISTS train_name VARCHAR(100) AFTER train_number,
ADD COLUMN IF NOT EXISTS class VARCHAR(20) AFTER train_name,
ADD COLUMN IF NOT EXISTS departure_time TIME AFTER class,
ADD COLUMN IF NOT EXISTS arrival_time TIME AFTER departure_time,
ADD COLUMN IF NOT EXISTS duration VARCHAR(20) AFTER arrival_time,
ADD COLUMN IF NOT EXISTS fare_per_person DECIMAL(10, 2) AFTER duration;

-- Verify columns were added
DESCRIBE bookings;

SELECT 'Train columns added successfully!' as status;








