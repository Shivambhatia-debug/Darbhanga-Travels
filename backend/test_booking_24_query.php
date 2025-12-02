<?php
/**
 * Test the exact query used in bookings.php for booking 24
 */

require_once __DIR__ . '/config/database.php';

try {
    $pdo = getDatabaseConnection();
    
    echo "<h2>🔍 Testing Booking 24 Query</h2>";
    
    // Check if user_id column exists
    $checkStmt = $pdo->query("SHOW COLUMNS FROM bookings LIKE 'user_id'");
    $userIdColumnExists = $checkStmt->rowCount() > 0;
    echo "<p>user_id column exists: " . ($userIdColumnExists ? "✅ Yes" : "❌ No") . "</p>";
    
    // Check if users table exists
    $checkStmt = $pdo->query("SHOW TABLES LIKE 'users'");
    $usersTableExists = $checkStmt->rowCount() > 0;
    echo "<p>users table exists: " . ($usersTableExists ? "✅ Yes" : "❌ No") . "</p>";
    
    // Check customer_name column
    $checkStmt = $pdo->query("SHOW COLUMNS FROM bookings LIKE 'customer_name'");
    $customerNameColumnExists = $checkStmt->rowCount() > 0;
    echo "<p>customer_name column exists: " . ($customerNameColumnExists ? "✅ Yes" : "❌ No") . "</p>";
    
    echo "<hr>";
    echo "<h3>📊 Test Query Result:</h3>";
    
    // Use the exact query from bookings.php
    $query = "
        SELECT 
            b.*,
            c.name as customer_name,
            c.phone as customer_phone,
            c.email as customer_email,
            COALESCE(u.username, a.username) as user_username,
            COALESCE(u.full_name, a.full_name, u.username, a.username) as user_full_name,
            COALESCE(u.email, a.email) as user_email
        FROM bookings b
        LEFT JOIN customers c ON b.customer_id = c.id
        LEFT JOIN users u ON b.user_id = u.id
        LEFT JOIN admins a ON b.user_id = a.id
        WHERE b.id = 24
    ";
    
    echo "<pre style='background: #f0f0f0; padding: 10px;'>";
    echo htmlspecialchars($query);
    echo "</pre>";
    
    $stmt = $pdo->query($query);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($booking) {
        echo "<h3>✅ Query Result:</h3>";
        echo "<pre>";
        print_r($booking);
        echo "</pre>";
        
        echo "<hr>";
        echo "<h3>📋 Key Fields:</h3>";
        echo "<p><strong>user_id:</strong> " . ($booking['user_id'] ?? 'NULL') . "</p>";
        echo "<p><strong>user_username:</strong> " . ($booking['user_username'] ?? 'NULL') . "</p>";
        echo "<p><strong>user_full_name:</strong> " . ($booking['user_full_name'] ?? 'NULL') . "</p>";
        echo "<p><strong>user_email:</strong> " . ($booking['user_email'] ?? 'NULL') . "</p>";
        
        // Check individual joins
        echo "<hr>";
        echo "<h3>🔍 Individual Join Checks:</h3>";
        
        // Check users join
        $userStmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $userStmt->execute([$booking['user_id']]);
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);
        
        echo "<p><strong>Users Table Join:</strong></p>";
        if ($user) {
            echo "<pre>";
            print_r($user);
            echo "</pre>";
        } else {
            echo "<p style='color: red;'>❌ User not found in users table!</p>";
        }
        
        // Check admins join
        $adminStmt = $pdo->prepare("SELECT * FROM admins WHERE id = ?");
        $adminStmt->execute([$booking['user_id']]);
        $admin = $adminStmt->fetch(PDO::FETCH_ASSOC);
        
        echo "<p><strong>Admins Table Join:</strong></p>";
        if ($admin) {
            echo "<pre>";
            print_r($admin);
            echo "</pre>";
            echo "<p style='color: red;'>⚠️ WARNING: user_id is also matching an admin! This might be causing the issue.</p>";
        } else {
            echo "<p style='color: green;'>✅ No admin found with this ID (good - means user_id is only pointing to user)</p>";
        }
        
    } else {
        echo "<p style='color: red;'>❌ Booking 24 not found in query result!</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}
?>

