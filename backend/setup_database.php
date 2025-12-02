<?php
/**
 * Database Setup Script for Hostinger
 * This script creates all required tables for Darbhanga Travels
 */

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
    
    echo "✅ Database connection successful!<br><br>";
    
    // Read and execute schema
    $schema = file_get_contents(__DIR__ . '/database/schema.sql');
    
    if ($schema === false) {
        throw new Exception("Could not read schema file");
    }
    
    // Split schema into individual statements
    $statements = array_filter(
        array_map('trim', explode(';', $schema)),
        function($stmt) {
            return !empty($stmt) && !preg_match('/^--/', $stmt);
        }
    );
    
    echo "🔄 Creating database tables...<br><br>";
    
    foreach ($statements as $statement) {
        if (!empty(trim($statement))) {
            try {
                $pdo->exec($statement);
                echo "✅ Executed: " . substr($statement, 0, 50) . "...<br>";
            } catch (PDOException $e) {
                if (strpos($e->getMessage(), 'already exists') !== false) {
                    echo "ℹ️ Table already exists: " . substr($statement, 0, 50) . "...<br>";
                } else {
                    echo "⚠️ Warning: " . $e->getMessage() . "<br>";
                }
            }
        }
    }
    
    echo "<br>🎉 Database setup completed successfully!<br><br>";
    
    // Verify tables were created
    $tables = ['admins', 'customers', 'bookings', 'passenger_details', 'service_bookings', 'settings'];
    $existing_tables = [];
    
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            $existing_tables[] = $table;
        }
    }
    
    echo "📋 Created tables: " . implode(', ', $existing_tables) . "<br><br>";
    
    // Check if admin user exists
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM admins WHERE username = 'admin'");
    $admin_count = $stmt->fetch()['count'];
    
    if ($admin_count > 0) {
        echo "👤 Default admin user created successfully!<br>";
        echo "Username: admin<br>";
        echo "Password: admin123<br><br>";
    }
    
    echo "🚀 Your Darbhanga Travels website is now ready!<br>";
    echo "You can now login to the admin panel at: <a href='/admin/'>/admin/</a><br>";
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "<br>";
    echo "Please check your database configuration.<br>";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}
?>





















