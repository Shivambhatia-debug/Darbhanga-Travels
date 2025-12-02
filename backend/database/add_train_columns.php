<?php
/**
 * Add Train Columns to Bookings Table
 * Run this script to fix: "Column 'train_number' not found" error
 * 
 * Usage: php backend/database/add_train_columns.php
 */

echo "========================================\n";
echo "Adding Train Columns to Database\n";
echo "========================================\n\n";

// Database connection
$host = 'localhost';
$dbname = 'u363779306_dbg_travels';
$username = 'u363779306_localhost';
$password = 'Shiva@8053';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✓ Connected to database\n\n";
    
    // Check if columns already exist
    $stmt = $pdo->query("SHOW COLUMNS FROM bookings LIKE 'train_number'");
    $exists = $stmt->fetch();
    
    if ($exists) {
        echo "ℹ Train columns already exist!\n";
        echo "No changes needed.\n\n";
    } else {
        echo "Adding train columns...\n\n";
        
        // Add columns one by one
        $columns = [
            "ADD COLUMN train_number VARCHAR(20) AFTER ticket_pdf_url",
            "ADD COLUMN train_name VARCHAR(100) AFTER train_number",
            "ADD COLUMN class VARCHAR(20) AFTER train_name",
            "ADD COLUMN departure_time TIME AFTER class",
            "ADD COLUMN arrival_time TIME AFTER departure_time",
            "ADD COLUMN duration VARCHAR(20) AFTER arrival_time",
            "ADD COLUMN fare_per_person DECIMAL(10, 2) AFTER duration"
        ];
        
        foreach ($columns as $column) {
            try {
                $pdo->exec("ALTER TABLE bookings $column");
                echo "✓ Added: " . explode(' ', $column)[2] . "\n";
            } catch (PDOException $e) {
                // Column might already exist, continue
                if (strpos($e->getMessage(), 'Duplicate column') !== false) {
                    echo "ℹ Column already exists: " . explode(' ', $column)[2] . "\n";
                } else {
                    throw $e;
                }
            }
        }
        
        echo "\n========================================\n";
        echo "SUCCESS! All train columns added.\n";
        echo "========================================\n\n";
    }
    
    // Show current table structure
    echo "Current bookings table structure:\n";
    echo "-----------------------------------\n";
    $stmt = $pdo->query("DESCRIBE bookings");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($columns as $col) {
        echo sprintf("%-25s %-20s\n", $col['Field'], $col['Type']);
    }
    
    echo "\n";
    echo "You can now:\n";
    echo "1. Refresh your browser\n";
    echo "2. Try creating a booking again\n";
    echo "3. Train details will be saved properly\n\n";
    
} catch (PDOException $e) {
    echo "\n========================================\n";
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "========================================\n\n";
    
    echo "Troubleshooting:\n";
    echo "1. Make sure MySQL is running (check XAMPP/WAMP)\n";
    echo "2. Verify database exists: darbhangatravels_db\n";
    echo "3. Check database credentials in this file\n\n";
    
    exit(1);
}
?>


