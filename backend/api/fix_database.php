<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Database connection
$host = 'localhost';
$dbname = 'u363779306_dbg_travels';
$username = 'u363779306_localhost';
$password = 'Shiva@8053';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $results = [];
    
    // 1. Create customers table
    $createCustomersTable = "
        CREATE TABLE IF NOT EXISTS customers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            phone VARCHAR(15) UNIQUE NOT NULL,
            email VARCHAR(100),
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    ";
    $pdo->exec($createCustomersTable);
    $results[] = "✅ Customers table created/verified";
    
    // 2. Create passenger_details table
    $createPassengerDetailsTable = "
        CREATE TABLE IF NOT EXISTS passenger_details (
            id INT AUTO_INCREMENT PRIMARY KEY,
            booking_id INT NOT NULL,
            name VARCHAR(100) NOT NULL,
            age INT NOT NULL,
            gender ENUM('male', 'female', 'other') NOT NULL,
            seat_number VARCHAR(10),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
        )
    ";
    $pdo->exec($createPassengerDetailsTable);
    $results[] = "✅ Passenger details table created/verified";
    
    // 3. Check if bookings table has customer_id column
    $columns = $pdo->query("SHOW COLUMNS FROM bookings LIKE 'customer_id'")->fetchAll();
    if (empty($columns)) {
        $pdo->exec("ALTER TABLE bookings ADD COLUMN customer_id INT NULL AFTER id");
        $results[] = "✅ Added customer_id column to bookings table";
    } else {
        $results[] = "✅ customer_id column already exists in bookings table";
    }
    
    // 4. Add foreign key constraint if it doesn't exist
    $constraints = $pdo->query("
        SELECT CONSTRAINT_NAME 
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = '$dbname' 
        AND TABLE_NAME = 'bookings' 
        AND COLUMN_NAME = 'customer_id'
        AND CONSTRAINT_NAME != 'PRIMARY'
    ")->fetchAll();
    
    if (empty($constraints)) {
        $pdo->exec("ALTER TABLE bookings ADD CONSTRAINT bookings_ibfk_1 FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE");
        $results[] = "✅ Added foreign key constraint";
    } else {
        $results[] = "✅ Foreign key constraint already exists";
    }
    
    // 5. Check table status
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    $results[] = "📊 Available tables: " . implode(', ', $tables);
    
    echo json_encode([
        'success' => true,
        'message' => 'Database setup completed successfully',
        'results' => $results
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ], JSON_PRETTY_PRINT);
}
?>
















