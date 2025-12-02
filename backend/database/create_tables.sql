-- Create database if not exists
CREATE DATABASE IF NOT EXISTS darbhangatravels_db;
USE darbhangatravels_db;

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
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

-- Passenger details table
CREATE TABLE IF NOT EXISTS passenger_details (
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

-- Insert default admin if not exists
INSERT IGNORE INTO admins (username, password, full_name, email) 
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin@darbhangatravels.com');
-- Default password is 'admin123'

-- Create sample data for testing (optional)
-- Uncomment below if you want sample data

/*
-- Sample customers
INSERT INTO customers (name, phone, email, address) VALUES
('Rajesh Kumar', '9876543210', 'rajesh@example.com', 'Darbhanga, Bihar'),
('Priya Sharma', '9876543211', 'priya@example.com', 'Patna, Bihar'),
('Amit Singh', '9876543212', 'amit@example.com', 'Muzaffarpur, Bihar');

-- Sample users
INSERT INTO users (username, password, full_name, email, phone) VALUES
('user1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test User 1', 'user1@example.com', '9876543220'),
('user2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test User 2', 'user2@example.com', '9876543221');
-- Default password is 'admin123'

-- Sample bookings
INSERT INTO bookings (customer_id, user_id, service, from_location, to_location, travel_date, passengers, total_amount, paid_amount, pending_amount, status, payment_status) VALUES
(1, 1, 'train', 'Darbhanga', 'Delhi', '2024-12-15', 2, 5000, 2000, 3000, 'new_booking', 'partial'),
(2, 1, 'train', 'Patna', 'Mumbai', '2024-12-20', 1, 3000, 3000, 0, 'ticket_booked', 'paid'),
(3, 2, 'train', 'Muzaffarpur', 'Kolkata', '2024-12-18', 3, 7500, 0, 7500, 'pending_booking', 'pending');
*/








