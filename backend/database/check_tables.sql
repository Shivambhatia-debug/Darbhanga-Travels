-- Check if all required tables exist in darbhangatravels_db

USE darbhangatravels_db;

-- Show all tables
SHOW TABLES;

-- Check customers table structure
DESCRIBE customers;

-- Check users table structure  
DESCRIBE users;

-- Check bookings table structure
DESCRIBE bookings;

-- Check passenger_details table structure
DESCRIBE passenger_details;

-- Check admins table structure
DESCRIBE admins;

-- Count records in each table
SELECT 'customers' as table_name, COUNT(*) as record_count FROM customers
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'passenger_details', COUNT(*) FROM passenger_details
UNION ALL
SELECT 'admins', COUNT(*) FROM admins;








