<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo "<h2>🔍 Database Connection Test</h2>";

// Database credentials from Hostinger
$host = 'localhost';
$dbname = 'u363779306_dbg_travels';
$username = 'u363779306_localhost';
$password = 'Shiva@8053';

echo "<h3>📋 Database Details:</h3>";
echo "<p><strong>Host:</strong> $host</p>";
echo "<p><strong>Database:</strong> $dbname</p>";
echo "<p><strong>Username:</strong> $username</p>";
echo "<p><strong>Password:</strong> " . str_repeat('*', strlen($password)) . "</p>";

try {
    echo "<h3>🔌 Testing Connection...</h3>";
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<p style='color: green;'>✅ Database connection successful!</p>";
    
    // Test if tables exist
    echo "<h3>📊 Checking Tables...</h3>";
    
    $tables = ['admins', 'bookings'];
    foreach ($tables as $table) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM $table");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo "<p style='color: green;'>✅ Table '$table' exists with {$result['count']} records</p>";
        } catch (Exception $e) {
            echo "<p style='color: red;'>❌ Table '$table' not found: " . $e->getMessage() . "</p>";
        }
    }
    
    // Test admin user
    echo "<h3>👤 Checking Admin User...</h3>";
    try {
        $stmt = $pdo->query("SELECT username, email FROM admins LIMIT 1");
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($admin) {
            echo "<p style='color: green;'>✅ Admin user found: {$admin['username']} ({$admin['email']})</p>";
        } else {
            echo "<p style='color: orange;'>⚠️ No admin users found</p>";
        }
    } catch (Exception $e) {
        echo "<p style='color: red;'>❌ Error checking admin: " . $e->getMessage() . "</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Database connection failed: " . $e->getMessage() . "</p>";
    echo "<h3>🔧 Possible Solutions:</h3>";
    echo "<ul>";
    echo "<li>Check if database name is correct: <code>$dbname</code></li>";
    echo "<li>Check if username is correct: <code>$username</code></li>";
    echo "<li>Check if password is correct</li>";
    echo "<li>Check if database exists in Hostinger</li>";
    echo "<li>Check if user has permissions on database</li>";
    echo "</ul>";
}

echo "<h3>📤 Next Steps:</h3>";
echo "<ol>";
echo "<li>Upload this file to <code>public_html/test_db_connection.php</code></li>";
echo "<li>Visit: <code>https://darbhangatravels.com/test_db_connection.php</code></li>";
echo "<li>Check the results above</li>";
echo "<li>If connection works, upload all API files</li>";
echo "</ol>";
?>




















