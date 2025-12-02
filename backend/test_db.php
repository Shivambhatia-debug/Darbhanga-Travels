<?php
/**
 * Database Test Script
 * Upload this to public_html/api/test_db.php
 */

header('Content-Type: text/html; charset=utf-8');

echo "<h2>🧪 Database Test - Darbhanga Travels</h2>";

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
    
    // Check if admins table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'admins'");
    if ($stmt->rowCount() > 0) {
        echo "<p>✅ Admins table exists</p>";
        
        // Check if admin user exists
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM admins WHERE username = 'admin'");
        $admin_count = $stmt->fetch()['count'];
        
        if ($admin_count > 0) {
            echo "<p>✅ Admin user exists</p>";
            
            // Get admin user details
            $stmt = $pdo->query("SELECT username, email, role FROM admins WHERE username = 'admin'");
            $admin = $stmt->fetch();
            echo "<p><strong>Admin Details:</strong></p>";
            echo "<ul>";
            echo "<li>Username: " . $admin['username'] . "</li>";
            echo "<li>Email: " . $admin['email'] . "</li>";
            echo "<li>Role: " . $admin['role'] . "</li>";
            echo "</ul>";
        } else {
            echo "<p>❌ Admin user not found</p>";
        }
    } else {
        echo "<p>❌ Admins table does not exist</p>";
        echo "<p>Please run: <a href='setup_database.php'>setup_database.php</a></p>";
    }
    
    // List all tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "<p><strong>All tables in database:</strong></p>";
    echo "<ul>";
    foreach ($tables as $table) {
        echo "<li>$table</li>";
    }
    echo "</ul>";
    
} catch (PDOException $e) {
    echo "<p>❌ Database error: " . $e->getMessage() . "</p>";
} catch (Exception $e) {
    echo "<p>❌ Error: " . $e->getMessage() . "</p>";
}

echo "<h3>🔗 Test Links:</h3>";
echo "<ul>";
echo "<li><a href='setup_database.php'>Setup Database</a></li>";
echo "<li><a href='admin/login.php'>Test Login API</a></li>";
echo "<li><a href='../admin/'>Admin Panel</a></li>";
echo "</ul>";
?>





















