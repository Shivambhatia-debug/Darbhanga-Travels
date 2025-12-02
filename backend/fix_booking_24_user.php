<?php
/**
 * Fix Booking 24 - Ensure user name shows correctly
 */

require_once __DIR__ . '/config/database.php';

try {
    $pdo = getDatabaseConnection();
    
    echo "<h2>🔧 Fix Booking 24 User Display</h2>";
    echo "<hr>";
    
    // Get booking 24
    $stmt = $pdo->prepare("SELECT * FROM bookings WHERE id = 24");
    $stmt->execute();
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$booking) {
        echo "<p style='color: red;'>❌ Booking 24 not found!</p>";
        exit;
    }
    
    echo "<p>✅ Booking 24 found</p>";
    echo "<p><strong>Current user_id:</strong> " . ($booking['user_id'] ?? 'NULL') . "</p>";
    
    // Get user details
    $userId = $booking['user_id'] ?? null;
    if ($userId) {
        $userStmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $userStmt->execute([$userId]);
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            echo "<p>✅ User found:</p>";
            echo "<ul>";
            echo "<li><strong>ID:</strong> {$user['id']}</li>";
            echo "<li><strong>Username:</strong> {$user['username']}</li>";
            echo "<li><strong>Full Name:</strong> " . ($user['full_name'] ?? 'N/A') . "</li>";
            echo "<li><strong>Email:</strong> " . ($user['email'] ?? 'N/A') . "</li>";
            echo "</ul>";
            
            // Test the actual query
            echo "<hr>";
            echo "<h3>📊 Testing Query Result:</h3>";
            
            // Check if admin with same ID exists
            $adminStmt = $pdo->prepare("SELECT * FROM admins WHERE id = ?");
            $adminStmt->execute([$userId]);
            $admin = $adminStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($admin) {
                echo "<p style='color: orange;'>⚠️ WARNING: Admin also exists with ID {$userId}!</p>";
                echo "<p>This might cause confusion in the join query.</p>";
            } else {
                echo "<p style='color: green;'>✅ No admin found with ID {$userId} (Good!)</p>";
            }
            
            // Test the query
            $query = "
                SELECT 
                    b.*,
                    c.name as customer_name,
                    COALESCE(u.full_name, u.username) as user_full_name,
                    COALESCE(u.username) as user_username
                FROM bookings b
                LEFT JOIN customers c ON b.customer_id = c.id
                LEFT JOIN users u ON b.user_id = u.id
                WHERE b.id = 24
            ";
            
            $testStmt = $pdo->query($query);
            $result = $testStmt->fetch(PDO::FETCH_ASSOC);
            
            echo "<p><strong>Query Result - user_full_name:</strong> " . ($result['user_full_name'] ?? 'NULL') . "</p>";
            echo "<p><strong>Query Result - user_username:</strong> " . ($result['user_username'] ?? 'NULL') . "</p>";
            
            if ($result['user_full_name'] === $user['full_name']) {
                echo "<p style='color: green;'>✅ Query is returning correct user name!</p>";
            } else {
                echo "<p style='color: red;'>❌ Query is NOT returning correct user name!</p>";
            }
        }
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . htmlspecialchars($e->getMessage()) . "</p>";
}
?>

