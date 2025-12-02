<?php
/**
 * Standalone Database Setup Script for Hostinger
 * This script creates all required tables without external files
 */

header('Content-Type: text/html; charset=utf-8');

echo "<h2>🔧 Darbhanga Travels - Database Setup</h2>";

// Database configuration
$db_config = [
    'host' => 'localhost',
    'dbname' => 'u363779306_dbg_travels',
    'username' => 'u363779306_localhost',
    'password' => 'Shiva@8053'
];

try {
    // Connect to database
    $pdo = new PDO(
        "mysql:host={$db_config['host']};dbname={$db_config['dbname']};charset=utf8mb4",
        $db_config['username'],
        $db_config['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
    
    echo "<p>✅ Database connection successful!</p>";
    
    // Create tables
    $tables = [
        'admins' => "
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(100),
                full_name VARCHAR(100),
                role ENUM('admin', 'super_admin') DEFAULT 'admin',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        ",
        'customers' => "
            CREATE TABLE IF NOT EXISTS customers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(15) UNIQUE NOT NULL,
                email VARCHAR(100),
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        ",
        'bookings' => "
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_id INT NOT NULL,
                service ENUM('train', 'bus', 'flight', 'cab') NOT NULL,
                from_location VARCHAR(100) NOT NULL,
                to_location VARCHAR(100) NOT NULL,
                travel_date DATE NOT NULL,
                return_date DATE NULL,
                passengers INT NOT NULL DEFAULT 1,
                amount DECIMAL(10,2) DEFAULT 0.00,
                status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
                payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
            )
        ",
        'passenger_details' => "
            CREATE TABLE IF NOT EXISTS passenger_details (
                id INT AUTO_INCREMENT PRIMARY KEY,
                booking_id INT NOT NULL,
                name VARCHAR(100) NOT NULL,
                age INT NOT NULL,
                gender ENUM('male', 'female', 'other') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
            )
        ",
        'settings' => "
            CREATE TABLE IF NOT EXISTS settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(100) UNIQUE NOT NULL,
                setting_value TEXT,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        "
    ];
    
    echo "<p>🔄 Creating database tables...</p>";
    
    foreach ($tables as $table_name => $sql) {
        try {
            $pdo->exec($sql);
            echo "<p>✅ Table '$table_name' created successfully</p>";
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'already exists') !== false) {
                echo "<p>ℹ️ Table '$table_name' already exists</p>";
            } else {
                echo "<p>⚠️ Error creating table '$table_name': " . $e->getMessage() . "</p>";
            }
        }
    }
    
    // Insert default admin user
    try {
        $admin_password = password_hash('admin123', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("
            INSERT IGNORE INTO admins (username, password, email, full_name, role) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute(['admin', $admin_password, 'admin@darbhangatravels.com', 'Admin User', 'super_admin']);
        echo "<p>✅ Default admin user created</p>";
    } catch (PDOException $e) {
        echo "<p>ℹ️ Admin user already exists</p>";
    }
    
    // Insert default settings
    $settings = [
        ['company_name', 'Darbhanga Travels', 'Company name'],
        ['company_email', 'info@darbhangatravels.com', 'Company email'],
        ['company_phone', '+91 9876543210', 'Company phone'],
        ['company_address', 'Darbhanga, Bihar', 'Company address']
    ];
    
    foreach ($settings as $setting) {
        try {
            $stmt = $pdo->prepare("INSERT IGNORE INTO settings (setting_key, setting_value, description) VALUES (?, ?, ?)");
            $stmt->execute($setting);
        } catch (PDOException $e) {
            // Ignore duplicate key errors
        }
    }
    echo "<p>✅ Default settings created</p>";
    
    echo "<h3>🎉 Database setup completed successfully!</h3>";
    echo "<p><strong>Login credentials:</strong></p>";
    echo "<ul>";
    echo "<li>Username: <strong>admin</strong></li>";
    echo "<li>Password: <strong>admin123</strong></li>";
    echo "</ul>";
    
    echo "<h3>🔗 Next Steps:</h3>";
    echo "<ul>";
    echo "<li><a href='../admin/'>Go to Admin Panel</a></li>";
    echo "<li><a href='test_db.php'>Test Database</a></li>";
    echo "</ul>";
    
} catch (PDOException $e) {
    echo "<p>❌ Database error: " . $e->getMessage() . "</p>";
} catch (Exception $e) {
    echo "<p>❌ Error: " . $e->getMessage() . "</p>";
}
?>





















