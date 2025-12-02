<?php
/**
 * Check Booking 24 Details - User Assignment
 */

require_once __DIR__ . '/config/database.php';

try {
    $pdo = getDatabaseConnection();
    
    echo "<h2>🔍 Booking 24 Analysis</h2>";
    echo "<hr>";
    
    // Get booking 24 details
    $stmt = $pdo->prepare("SELECT * FROM bookings WHERE id = 24");
    $stmt->execute();
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$booking) {
        echo "<p style='color: red;'>❌ Booking 24 not found!</p>";
        exit;
    }
    
    echo "<h3>📋 Booking Details:</h3>";
    echo "<pre>";
    print_r($booking);
    echo "</pre>";
    
    echo "<hr>";
    echo "<h3>👤 User ID Check:</h3>";
    $userId = $booking['user_id'] ?? null;
    if ($userId) {
        echo "<p>✅ Booking has user_id: <strong>{$userId}</strong></p>";
        
        // Check users table
        $userStmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $userStmt->execute([$userId]);
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            echo "<p>✅ User found in users table:</p>";
            echo "<pre>";
            print_r($user);
            echo "</pre>";
            echo "<p><strong>Full Name:</strong> " . ($user['full_name'] ?? $user['username'] ?? 'N/A') . "</p>";
        } else {
            echo "<p style='color: orange;'>⚠️ User ID {$userId} not found in users table</p>";
            
            // Check admins table
            $adminStmt = $pdo->prepare("SELECT * FROM admins WHERE id = ?");
            $adminStmt->execute([$userId]);
            $admin = $adminStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($admin) {
                echo "<p style='color: red;'>❌ User ID {$userId} is pointing to an ADMIN, not a USER!</p>";
                echo "<pre>";
                print_r($admin);
                echo "</pre>";
            }
        }
    } else {
        echo "<p style='color: red;'>❌ Booking user_id is NULL or not set!</p>";
    }
    
    echo "<hr>";
    echo "<h3>👥 Customer Details:</h3>";
    $customerId = $booking['customer_id'] ?? null;
    if ($customerId) {
        $customerStmt = $pdo->prepare("SELECT * FROM customers WHERE id = ?");
        $customerStmt->execute([$customerId]);
        $customer = $customerStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($customer) {
            echo "<p><strong>Customer Name:</strong> " . ($customer['name'] ?? 'N/A') . "</p>";
            echo "<p><strong>Customer Phone:</strong> " . ($customer['phone'] ?? 'N/A') . "</p>";
        }
    }
    
    echo "<hr>";
    echo "<h3>🔍 Find User 'Shivam Raj':</h3>";
    
    // Search for user with name containing "Shivam" or "Raj"
    $searchStmt = $pdo->prepare("SELECT * FROM users WHERE full_name LIKE ? OR username LIKE ? OR email LIKE ?");
    $searchTerm = '%shivam%';
    $searchStmt->execute([$searchTerm, $searchTerm, $searchTerm]);
    $matchingUsers = $searchStmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($matchingUsers) > 0) {
        echo "<p>✅ Found " . count($matchingUsers) . " user(s) matching 'Shivam':</p>";
        foreach ($matchingUsers as $user) {
            echo "<pre>";
            print_r($user);
            echo "</pre>";
        }
        
        // Suggest fix
        if ($userId === null && count($matchingUsers) > 0) {
            $suggestedUserId = $matchingUsers[0]['id'];
            echo "<hr>";
            echo "<h3>🔧 Suggested Fix:</h3>";
            echo "<p>Update booking 24 to use user_id: <strong>{$suggestedUserId}</strong></p>";
            echo "<p>Run this SQL:</p>";
            echo "<pre style='background: #f0f0f0; padding: 10px; border-radius: 5px;'>";
            echo "UPDATE bookings SET user_id = {$suggestedUserId} WHERE id = 24;";
            echo "</pre>";
        }
    } else {
        echo "<p style='color: orange;'>⚠️ No users found matching 'Shivam'</p>";
    }
    
    echo "<hr>";
    echo "<h3>📊 All Users:</h3>";
    $allUsersStmt = $pdo->query("SELECT id, username, full_name, email FROM users ORDER BY id");
    $allUsers = $allUsersStmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($allUsers) > 0) {
        echo "<table border='1' cellpadding='5' style='border-collapse: collapse;'>";
        echo "<tr><th>ID</th><th>Username</th><th>Full Name</th><th>Email</th></tr>";
        foreach ($allUsers as $user) {
            echo "<tr>";
            echo "<td>{$user['id']}</td>";
            echo "<td>{$user['username']}</td>";
            echo "<td>" . ($user['full_name'] ?? 'N/A') . "</td>";
            echo "<td>" . ($user['email'] ?? 'N/A') . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p>No users found in database.</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . htmlspecialchars($e->getMessage()) . "</p>";
}
?>

