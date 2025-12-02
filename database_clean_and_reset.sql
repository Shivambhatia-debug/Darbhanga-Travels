-- =====================================================
-- DARBHANGA TRAVELS - PRODUCTION DATABASE CLEAN & RESET
-- Database: u363779306_dbg_travels
-- =====================================================
-- WARNING: This will DELETE ALL DATA from all tables!
-- Make sure you have a backup if needed.
-- =====================================================

USE u363779306_dbg_travels;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- STEP 1: DELETE ALL DATA FROM TABLES
-- =====================================================

-- Delete all passenger details first (has foreign key to bookings)
TRUNCATE TABLE IF EXISTS passenger_details;

-- Delete all bookings (has foreign keys to customers and users)
TRUNCATE TABLE IF EXISTS bookings;

-- Delete all customers
TRUNCATE TABLE IF EXISTS customers;

-- Delete all users (except if you want to keep admin users)
-- TRUNCATE TABLE IF EXISTS users;  -- Uncomment if you want to delete users too

-- Delete all admins (except if you want to keep admin accounts)
-- TRUNCATE TABLE IF EXISTS admins;  -- Uncomment if you want to delete admins too

-- Delete settings (optional - will be recreated)
TRUNCATE TABLE IF EXISTS settings;

-- Delete contact submissions if exists
DROP TABLE IF EXISTS contact_submissions;

-- Delete service_bookings if exists
DROP TABLE IF EXISTS service_bookings;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- STEP 2: RECREATE TABLES WITH CURRENT SCHEMA
-- =====================================================

-- Drop and recreate admins table
DROP TABLE IF EXISTS admins;
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    full_name VARCHAR(100),
    role ENUM('admin', 'super_admin') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Drop and recreate users table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Drop and recreate customers table
DROP TABLE IF EXISTS customers;
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone)
);

-- Drop and recreate bookings table (with all current columns)
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    user_id INT,
    service VARCHAR(50) DEFAULT 'train',
    from_location VARCHAR(100),
    to_location VARCHAR(100),
    travel_date DATE,
    booking_date DATE,
    return_date DATE,
    passengers INT DEFAULT 1,
    amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) DEFAULT 0,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    pending_amount DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'new_booking',
    payment_status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    ticket_pdf_url VARCHAR(255),
    train_number VARCHAR(20),
    train_name VARCHAR(100),
    class VARCHAR(20),
    departure_time TIME,
    arrival_time TIME,
    duration VARCHAR(20),
    fare_per_person DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_customer (customer_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_travel_date (travel_date)
);

-- Drop and recreate passenger_details table
DROP TABLE IF EXISTS passenger_details;
CREATE TABLE passenger_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender VARCHAR(10),
    seat_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking (booking_id)
);

-- Drop and recreate settings table
DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- STEP 3: INSERT DEFAULT DATA
-- =====================================================

-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO admins (username, password, email, full_name, role) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@darbhangatravels.com', 'Admin User', 'super_admin');

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, description) VALUES 
('company_name', 'Darbhanga Travels', 'Company name'),
('company_email', 'info@darbhangatravels.com', 'Company email'),
('company_phone', '+91 9876543210', 'Company phone'),
('company_address', 'Darbhanga, Bihar', 'Company address'),
('booking_email', 'bookings@darbhangatravels.com', 'Email for booking notifications'),
('admin_email', 'admin@darbhangatravels.com', 'Admin email for notifications'),
('currency', 'INR', 'Default currency'),
('timezone', 'Asia/Kolkata', 'Default timezone');

-- =====================================================
-- STEP 4: VERIFY TABLES
-- =====================================================

-- Show all tables
SHOW TABLES;

-- Show table structures
DESCRIBE admins;
DESCRIBE users;
DESCRIBE customers;
DESCRIBE bookings;
DESCRIBE passenger_details;
DESCRIBE settings;

-- Show record counts (should be 0 for data tables, 1 for admin, 8 for settings)
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

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT '✅ Database cleaned and reset successfully!' as status;
SELECT '✅ Default admin created: username=admin, password=admin123' as admin_info;
SELECT '✅ All tables recreated with fresh schema' as schema_info;
SELECT '✅ Ready for production use!' as ready;






