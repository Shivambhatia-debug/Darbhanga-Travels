-- =====================================================
-- QUICK CLEAN - DELETE DATA ONLY (Keep Table Structure)
-- Database: u363779306_dbg_travels
-- =====================================================
-- This only deletes data, keeps table structure intact
-- Use this if your tables are already correct
-- =====================================================

USE u363779306_dbg_travels;

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Delete all data from tables (in correct order due to foreign keys)
-- First delete from child tables that reference bookings
-- Using DELETE instead of TRUNCATE to avoid foreign key constraint issues

-- Delete from service-specific booking tables (if they exist)
DELETE FROM passenger_details WHERE 1=1;
DELETE FROM bus_bookings WHERE 1=1;
DELETE FROM train_bookings WHERE 1=1;
DELETE FROM flight_bookings WHERE 1=1;
DELETE FROM cab_bookings WHERE 1=1;

-- Now delete from bookings
DELETE FROM bookings WHERE 1=1;

-- Delete from other tables
DELETE FROM customers WHERE 1=1;
DELETE FROM users WHERE 1=1;
DELETE FROM settings WHERE 1=1;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Reset auto increment counters (run these only if tables exist)
-- If any table doesn't exist, that line will error but others will continue
SET FOREIGN_KEY_CHECKS = 0;
ALTER TABLE passenger_details AUTO_INCREMENT = 1;
ALTER TABLE bookings AUTO_INCREMENT = 1;
ALTER TABLE customers AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE settings AUTO_INCREMENT = 1;
-- Reset service-specific tables if they exist
ALTER TABLE bus_bookings AUTO_INCREMENT = 1;
ALTER TABLE train_bookings AUTO_INCREMENT = 1;
ALTER TABLE flight_bookings AUTO_INCREMENT = 1;
ALTER TABLE cab_bookings AUTO_INCREMENT = 1;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- RE-INSERT DEFAULT DATA
-- =====================================================

-- Insert default admin user
-- Password: admin123 (bcrypt hash)
INSERT INTO admins (username, password, email, role) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@darbhangatravels.com', 'super_admin')
ON DUPLICATE KEY UPDATE username=username, password=VALUES(password), email=VALUES(email), role=VALUES(role);

-- Note: If your admins table has 'full_name' column, add it:
-- INSERT INTO admins (username, password, email, full_name, role) VALUES 
-- ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@darbhangatravels.com', 'Admin User', 'super_admin')

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
-- VERIFY
-- =====================================================

SELECT '✅ Data cleaned successfully!' as status;
SELECT '✅ Default admin: username=admin, password=admin123' as admin_info;

-- Show counts
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
SELECT 'bus_bookings', COUNT(*) FROM bus_bookings
UNION ALL
SELECT 'train_bookings', COUNT(*) FROM train_bookings
UNION ALL
SELECT 'flight_bookings', COUNT(*) FROM flight_bookings
UNION ALL
SELECT 'cab_bookings', COUNT(*) FROM cab_bookings
UNION ALL
SELECT 'settings', COUNT(*) FROM settings;

