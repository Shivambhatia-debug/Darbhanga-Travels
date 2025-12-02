-- Darbhanga Travels Database Setup
-- Run this in phpMyAdmin to create all necessary tables

USE darbhangatravels_db;

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'super_admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    service ENUM('train', 'bus', 'flight', 'cab') NOT NULL,
    from_location VARCHAR(100) NOT NULL,
    to_location VARCHAR(100) NOT NULL,
    travel_date DATE NOT NULL,
    return_date DATE NULL,
    passengers INT NOT NULL DEFAULT 1,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Passenger details table
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

-- Train bookings specific details
CREATE TABLE IF NOT EXISTS train_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    train_number VARCHAR(20),
    train_name VARCHAR(100),
    class VARCHAR(10),
    pnr_number VARCHAR(20),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Bus bookings specific details
CREATE TABLE IF NOT EXISTS bus_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    bus_operator VARCHAR(100),
    bus_type VARCHAR(50),
    seat_numbers VARCHAR(100),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Flight bookings specific details
CREATE TABLE IF NOT EXISTS flight_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    airline VARCHAR(100),
    flight_number VARCHAR(20),
    class VARCHAR(20),
    seat_numbers VARCHAR(100),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Cab bookings specific details
CREATE TABLE IF NOT EXISTS cab_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    car_type VARCHAR(50),
    driver_name VARCHAR(100),
    driver_phone VARCHAR(15),
    pickup_time TIME,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    service VARCHAR(50),
    travel_date DATE,
    budget VARCHAR(50),
    message TEXT NOT NULL,
    newsletter BOOLEAN DEFAULT FALSE,
    status ENUM('new', 'contacted', 'closed') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO admins (username, email, password, role) VALUES 
('admin', 'admin@darbhangatravels.com', MD5('admin123'), 'super_admin')
ON DUPLICATE KEY UPDATE username=username;

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, description) VALUES
('company_name', 'Darbhanga Travels', 'Company name'),
('company_phone', '+91 9876543210', 'Primary contact number'),
('company_email', 'info@darbhangatravels.com', 'Primary email address'),
('company_address', 'Main Road, Near Railway Station, Darbhanga, Bihar 846004', 'Company address'),
('booking_email', 'shivambhatia19v@gmail.com', 'Email for booking notifications'),
('currency', 'INR', 'Default currency'),
('timezone', 'Asia/Kolkata', 'Default timezone')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service ON bookings(service);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_passenger_details_booking_id ON passenger_details(booking_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);

-- Insert sample data for testing
INSERT INTO customers (name, phone, email, address) VALUES
('Rajesh Kumar', '9876543210', 'rajesh@example.com', 'Patna, Bihar'),
('Priya Singh', '9876543211', 'priya@example.com', 'Muzaffarpur, Bihar'),
('Amit Verma', '9876543212', 'amit@example.com', 'Darbhanga, Bihar')
ON DUPLICATE KEY UPDATE name=name;

-- Insert sample bookings
INSERT INTO bookings (customer_id, service, from_location, to_location, travel_date, passengers, amount, status) VALUES
(1, 'train', 'Patna', 'New Delhi', '2024-01-15', 2, 2500.00, 'confirmed'),
(2, 'bus', 'Muzaffarpur', 'Darbhanga', '2024-01-16', 1, 150.00, 'pending'),
(3, 'flight', 'Patna', 'Mumbai', '2024-01-17', 1, 8500.00, 'confirmed')
ON DUPLICATE KEY UPDATE amount=VALUES(amount);

-- Insert sample passenger details
INSERT INTO passenger_details (booking_id, name, age, gender) VALUES
(1, 'Rajesh Kumar', 35, 'male'),
(1, 'Sunita Kumar', 32, 'female'),
(2, 'Priya Singh', 28, 'female'),
(3, 'Amit Verma', 30, 'male')
ON DUPLICATE KEY UPDATE name=name;

-- Insert sample contact submissions
INSERT INTO contact_submissions (first_name, last_name, email, phone, service, message, status) VALUES
('Ravi', 'Sharma', 'ravi@example.com', '9876543213', 'train', 'Need help with train booking', 'new'),
('Sita', 'Gupta', 'sita@example.com', '9876543214', 'flight', 'Looking for flight to Bangalore', 'contacted')
ON DUPLICATE KEY UPDATE message=VALUES(message);
