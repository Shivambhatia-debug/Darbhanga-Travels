<?php
/**
 * Test Database Connection After MySQL Starts
 * Run this after starting MySQL in XAMPP
 */

header('Content-Type: text/html; charset=utf-8');

echo "<h2>🔍 Database Connection Test</h2>";
echo "<p>Testing connection after MySQL starts...</p>";
echo "<hr>";

// Include database config
require_once __DIR__ . '/backend/config/database.php';

try {
    echo "<h3>📋 Database Configuration:</h3>";
    echo "<p><strong>Detected Environment:</strong> ";
    
    $isCli = php_sapi_name() === 'cli';
    $httpHost = $_SERVER['HTTP_HOST'] ?? '';
    $serverName = $_SERVER['SERVER_NAME'] ?? '';
    
    $isLocalhost = $isCli || (
        strpos($httpHost, 'localhost') !== false ||
        strpos($httpHost, '127.0.0.1') !== false ||
        $serverName === 'localhost' ||
        $serverName === '127.0.0.1'
    );
    
    if ($isLocalhost) {
        echo "Localhost</p>";
        echo "<ul>";
        echo "<li><strong>Host:</strong> localhost</li>";
        echo "<li><strong>Database:</strong> darbhangatravels_db</li>";
        echo "<li><strong>Username:</strong> root</li>";
        echo "<li><strong>Password:</strong> (empty)</li>";
        echo "</ul>";
    } else {
        echo "Production</p>";
    }
    
    echo "<hr>";
    echo "<h3>🔌 Testing Connection...</h3>";
    
    $pdo = getDatabaseConnection();
    
    echo "<p style='color: green; font-weight: bold;'>✅ Database connection successful!</p>";
    
    echo "<hr>";
    echo "<h3>📊 Checking Tables...</h3>";
    
    $tables = ['users', 'admins', 'bookings', 'customers'];
    foreach ($tables as $table) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM $table");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo "<p style='color: green;'>✅ Table '<strong>$table</strong>' exists with <strong>{$result['count']}</strong> records</p>";
        } catch (Exception $e) {
            echo "<p style='color: red;'>❌ Table '<strong>$table</strong>' not found: " . htmlspecialchars($e->getMessage()) . "</p>";
        }
    }
    
    echo "<hr>";
    echo "<h3>👤 Checking Users Table (for Booking By User)...</h3>";
    
    try {
        // Check if users table exists
        $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
        if ($stmt->rowCount() > 0) {
            echo "<p style='color: green;'>✅ Users table exists!</p>";
            
            // Get sample users
            $stmt = $pdo->query("SELECT id, username, full_name, email FROM users LIMIT 5");
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (count($users) > 0) {
                echo "<table border='1' cellpadding='5' style='border-collapse: collapse;'>";
                echo "<tr><th>ID</th><th>Username</th><th>Full Name</th><th>Email</th></tr>";
                foreach ($users as $user) {
                    echo "<tr>";
                    echo "<td>{$user['id']}</td>";
                    echo "<td>{$user['username']}</td>";
                    echo "<td>" . htmlspecialchars($user['full_name'] ?? 'N/A') . "</td>";
                    echo "<td>" . htmlspecialchars($user['email'] ?? 'N/A') . "</td>";
                    echo "</tr>";
                }
                echo "</table>";
            } else {
                echo "<p style='color: orange;'>⚠️ No users found in users table</p>";
            }
        } else {
            echo "<p style='color: orange;'>⚠️ Users table does not exist</p>";
        }
    } catch (Exception $e) {
        echo "<p style='color: red;'>❌ Error checking users table: " . htmlspecialchars($e->getMessage()) . "</p>";
    }
    
    echo "<hr>";
    echo "<h3>📝 Testing Booking By User Query...</h3>";
    
    try {
        // Check if bookings table has user_id column
        $stmt = $pdo->query("SHOW COLUMNS FROM bookings LIKE 'user_id'");
        if ($stmt->rowCount() > 0) {
            echo "<p style='color: green;'>✅ bookings table has user_id column</p>";
            
            // Test the join query
            $query = "
                SELECT 
                    b.id,
                    b.customer_id,
                    COALESCE(u.full_name, a.full_name, u.username, a.username, 'Admin') as booking_by_user
                FROM bookings b
                LEFT JOIN users u ON b.user_id = u.id
                LEFT JOIN admins a ON b.user_id = a.id
                LIMIT 5
            ";
            
            $stmt = $pdo->query($query);
            $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (count($bookings) > 0) {
                echo "<table border='1' cellpadding='5' style='border-collapse: collapse;'>";
                echo "<tr><th>Booking ID</th><th>Customer ID</th><th>Booking By User</th></tr>";
                foreach ($bookings as $booking) {
                    echo "<tr>";
                    echo "<td>{$booking['id']}</td>";
                    echo "<td>{$booking['customer_id']}</td>";
                    echo "<td><strong>" . htmlspecialchars($booking['booking_by_user']) . "</strong></td>";
                    echo "</tr>";
                }
                echo "</table>";
                
                echo "<p style='color: green; font-weight: bold;'>✅ Booking By User query is working correctly!</p>";
            } else {
                echo "<p style='color: orange;'>⚠️ No bookings found</p>";
            }
        } else {
            echo "<p style='color: orange;'>⚠️ bookings table does not have user_id column</p>";
        }
    } catch (Exception $e) {
        echo "<p style='color: red;'>❌ Error testing booking query: " . htmlspecialchars($e->getMessage()) . "</p>";
    }
    
    echo "<hr>";
    echo "<p style='color: green; font-weight: bold; font-size: 18px;'>🎉 All tests passed! MySQL is working correctly.</p>";
    echo "<p>You can now refresh your admin bookings page to see user names instead of 'Admin'.</p>";
    
} catch (PDOException $e) {
    echo "<p style='color: red; font-weight: bold;'>❌ Database connection failed!</p>";
    echo "<p><strong>Error:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<hr>";
    echo "<h3>🔧 Troubleshooting Steps:</h3>";
    echo "<ol>";
    echo "<li>Make sure MySQL is running in XAMPP Control Panel</li>";
    echo "<li>Check if port 3306 is free (run check_mysql.bat)</li>";
    echo "<li>Verify database name 'darbhangatravels_db' exists</li>";
    echo "<li>Check XAMPP MySQL logs for errors</li>";
    echo "</ol>";
} catch (Exception $e) {
    echo "<p style='color: red; font-weight: bold;'>❌ Error: " . htmlspecialchars($e->getMessage()) . "</p>";
}
?>

