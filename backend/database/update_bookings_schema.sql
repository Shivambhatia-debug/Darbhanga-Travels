-- Update bookings table to include new fields for complete booking details

-- Add new columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(100) AFTER customer_id,
ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(15) AFTER customer_name,
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(100) AFTER customer_phone,
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) DEFAULT 0.00 AFTER amount,
ADD COLUMN IF NOT EXISTS paid_amount DECIMAL(10,2) DEFAULT 0.00 AFTER total_amount,
ADD COLUMN IF NOT EXISTS pending_amount DECIMAL(10,2) DEFAULT 0.00 AFTER paid_amount,
ADD COLUMN IF NOT EXISTS booking_date DATE AFTER travel_date,
ADD COLUMN IF NOT EXISTS train_number VARCHAR(20) AFTER service,
ADD COLUMN IF NOT EXISTS train_name VARCHAR(100) AFTER train_number,
ADD COLUMN IF NOT EXISTS class VARCHAR(20) AFTER train_name,
ADD COLUMN IF NOT EXISTS departure_time TIME AFTER class,
ADD COLUMN IF NOT EXISTS arrival_time TIME AFTER departure_time,
ADD COLUMN IF NOT EXISTS duration VARCHAR(20) AFTER arrival_time,
ADD COLUMN IF NOT EXISTS fare_per_person DECIMAL(10,2) DEFAULT 0.00 AFTER duration;

-- Update existing records to set total_amount = amount where total_amount is 0
UPDATE bookings SET total_amount = amount WHERE total_amount = 0 OR total_amount IS NULL;

-- Update existing records to set pending_amount = total_amount where pending_amount is 0
UPDATE bookings SET pending_amount = total_amount WHERE pending_amount = 0 OR pending_amount IS NULL;

-- Update existing records to set booking_date = created_at date where booking_date is NULL
UPDATE bookings SET booking_date = DATE(created_at) WHERE booking_date IS NULL;

-- Create customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create passenger_details table if it doesn't exist
CREATE TABLE IF NOT EXISTS passenger_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    seat_number VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

