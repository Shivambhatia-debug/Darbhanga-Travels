<?php
/**
 * Script to analyze booking ID 21 and check database structure
 */

// Database connection - auto-detects localhost vs production
try {
    require_once __DIR__ . '/config/database.php';
    $pdo = getDatabaseConnection();
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    exit(1);
}

echo "🔍 Analyzing Booking ID 21...\n\n";

try {
    // Check bookings table structure
    echo "📋 Bookings Table Columns:\n";
    $stmt = $pdo->query("SHOW COLUMNS FROM bookings");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $column) {
        echo "  - {$column['Field']} ({$column['Type']})\n";
    }
    echo "\n";
    
    // Get booking 21 directly from bookings table
    echo "📦 Booking 21 Data (from bookings table):\n";
    $stmt = $pdo->prepare("SELECT * FROM bookings WHERE id = 21");
    $stmt->execute();
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($booking) {
        echo "  Booking ID: " . ($booking['id'] ?? 'N/A') . "\n";
        echo "  Customer ID: " . ($booking['customer_id'] ?? 'N/A') . "\n";
        echo "  Customer Name (direct): " . ($booking['customer_name'] ?? 'NULL') . "\n";
        echo "  Customer Phone (direct): " . ($booking['customer_phone'] ?? 'NULL') . "\n";
        echo "  User ID: " . ($booking['user_id'] ?? 'NULL') . "\n";
        echo "  Status: " . ($booking['status'] ?? 'N/A') . "\n";
        echo "  Created At: " . ($booking['created_at'] ?? 'N/A') . "\n";
    } else {
        echo "  ❌ Booking 21 not found!\n";
    }
    echo "\n";
    
    // Check if customers table exists and get customer data
    echo "👤 Customer Data (from customers table):\n";
    if ($booking && isset($booking['customer_id'])) {
        $stmt = $pdo->prepare("SELECT * FROM customers WHERE id = ?");
        $stmt->execute([$booking['customer_id']]);
        $customer = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($customer) {
            echo "  Customer ID: " . ($customer['id'] ?? 'N/A') . "\n";
            echo "  Customer Name: " . ($customer['name'] ?? 'NULL') . "\n";
            echo "  Customer Phone: " . ($customer['phone'] ?? 'NULL') . "\n";
            echo "  Customer Email: " . ($customer['email'] ?? 'NULL') . "\n";
        } else {
            echo "  ❌ Customer not found in customers table!\n";
        }
    } else {
        echo "  ⚠️  No customer_id in booking\n";
    }
    echo "\n";
    
    // Check user/admin data if user_id exists
    if ($booking && isset($booking['user_id'])) {
        echo "👨‍💼 User/Admin Data (from admins table):\n";
        $stmt = $pdo->prepare("SELECT * FROM admins WHERE id = ?");
        $stmt->execute([$booking['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            echo "  Admin ID: " . ($user['id'] ?? 'N/A') . "\n";
            echo "  Username: " . ($user['username'] ?? 'NULL') . "\n";
            echo "  Full Name: " . ($user['full_name'] ?? 'NULL') . "\n";
            echo "  Email: " . ($user['email'] ?? 'NULL') . "\n";
        } else {
            echo "  ❌ Admin/User not found in admins table!\n";
        }
        echo "\n";
    }
    
    // Test the actual API query
    echo "🔗 Testing API Query (with JOINs):\n";
    $query = "
        SELECT 
            b.*,
            c.name as customer_name,
            c.phone as customer_phone,
            c.email as customer_email,
            a.username as user_username,
            a.full_name as user_full_name,
            a.email as user_email
        FROM bookings b
        LEFT JOIN customers c ON b.customer_id = c.id
        LEFT JOIN admins a ON b.user_id = a.id
        WHERE b.id = 21
    ";
    
    $stmt = $pdo->query($query);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        echo "  Customer Name (from JOIN): " . ($result['customer_name'] ?? 'NULL') . "\n";
        echo "  Customer Phone (from JOIN): " . ($result['customer_phone'] ?? 'NULL') . "\n";
        echo "  User Username (from JOIN): " . ($result['user_username'] ?? 'NULL') . "\n";
        echo "  User Full Name (from JOIN): " . ($result['user_full_name'] ?? 'NULL') . "\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>



