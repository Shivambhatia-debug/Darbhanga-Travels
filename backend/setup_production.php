<?php
/**
 * Production Setup Script for Hostinger
 * Run this after uploading to Hostinger to configure the database
 */

// Database configuration - UPDATE THESE VALUES
$db_config = [
    'host' => 'localhost', // Usually localhost on Hostinger
    'dbname' => 'u363779306_dbg_travels', // Your actual database name
    'username' => 'u363779306_localhost', // Your actual username
    'password' => 'Shiva@8053' // Your actual password
];

try {
    // Test database connection
    $pdo = new PDO(
        "mysql:host={$db_config['host']};dbname={$db_config['dbname']};charset=utf8mb4",
        $db_config['username'],
        $db_config['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
    
    echo "✅ Database connection successful!\n";
    
    // Check if tables exist
    $tables = ['bookings', 'customers', 'admins', 'settings'];
    $existing_tables = [];
    
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            $existing_tables[] = $table;
        }
    }
    
    if (count($existing_tables) === count($tables)) {
        echo "✅ All required tables exist!\n";
    } else {
        echo "⚠️  Some tables are missing. Please run the database setup.\n";
        echo "Missing tables: " . implode(', ', array_diff($tables, $existing_tables)) . "\n";
        echo "Run: https://darbhangatravels.com/api/setup_database.php\n";
    }
    
    echo "\n🎉 Setup completed successfully!\n";
    echo "Your Darbhanga Travels website is ready to use.\n";
    
} catch (PDOException $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    echo "\nPlease check your database configuration in this file.\n";
    echo "Update the \$db_config array with your actual database credentials.\n";
}
?>
