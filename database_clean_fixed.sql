-- =====================================================
-- DATABASE CLEAN - FIXED VERSION (Handles Foreign Keys)
-- Database: u363779306_dbg_travels
-- =====================================================
-- This version properly handles foreign key constraints
-- by deleting from child tables first
-- =====================================================

USE u363779306_dbg_travels;

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- STEP 1: Delete from child tables first
-- =====================================================

-- Delete from passenger_details (references bookings)
DELETE FROM passenger_details;

-- Delete from service-specific booking tables (references bookings)
-- These may or may not exist, so we handle errors gracefully
DELETE FROM bus_bookings;
DELETE FROM train_bookings;
DELETE FROM flight_bookings;
DELETE FROM cab_bookings;

-- Delete from contact_submissions if exists (no foreign key but clean it)
DELETE FROM contact_submissions;

-- =====================================================
-- STEP 2: Delete from main tables
-- =====================================================

-- Now safe to delete from bookings
DELETE FROM bookings;

-- Delete from other tables
DELETE FROM customers;
DELETE FROM users;
DELETE FROM settings;

-- =====================================================
-- STEP 3: Reset auto increment
-- =====================================================

-- Reset auto increment for all tables
ALTER TABLE passenger_details AUTO_INCREMENT = 1;
ALTER TABLE bookings AUTO_INCREMENT = 1;
ALTER TABLE customers AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE settings AUTO_INCREMENT = 1;

-- Reset service-specific tables (if they exist)
ALTER TABLE bus_bookings AUTO_INCREMENT = 1;
ALTER TABLE train_bookings AUTO_INCREMENT = 1;
ALTER TABLE flight_bookings AUTO_INCREMENT = 1;
ALTER TABLE cab_bookings AUTO_INCREMENT = 1;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- STEP 4: Re-insert default data
-- =====================================================

-- Insert default admin user
-- Password: admin123 (bcrypt hash)
-- Note: If table has 'full_name' column, uncomment that part
INSERT INTO admins (username, password, email, role) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@darbhangatravels.com', 'super_admin')
ON DUPLICATE KEY UPDATE username=username, password=VALUES(password), email=VALUES(email), role=VALUES(role);

-- Alternative: If your table has full_name column, use this instead:
-- INSERT INTO admins (username, password, email, full_name, role) VALUES 
-- ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@darbhangatravels.com', 'Admin User', 'super_admin')
-- ON DUPLICATE KEY UPDATE username=username;

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, description) VALUES 
('company_name', 'Darbhanga Travels', 'Company name'),
('company_email', 'info@darbhangatravels.com', 'Company email'),
('company_phone', '+91 9876543210', 'Company phone'),
('company_address', 'Darbhanga, Bihar', 'Company address'),
('booking_email', 'bookings@darbhangatravels.com', 'Email for booking notifications'),
('admin_email', 'admin@darbhangatravels.com', 'Admin email for notifications'),
('currency', 'INR', 'Default currency'),
('timezone', 'Asia/Kolkata', 'Default timezone')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

-- =====================================================
-- STEP 5: Verify
-- =====================================================

SELECT '✅ Database cleaned successfully!' as status;
SELECT '✅ Default admin: username=admin, password=admin123' as admin_info;

-- Show record counts
SELECT 'admins' as table_name, COUNT(*) as count FROM admins
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'passenger_details', COUNT(*) FROM passenger_details
UNION ALL
SELECT 'settings', COUNT(*) FROM settings;

