<?php
/**
 * Script to add user_id column to bookings table.
 * This column tracks which admin/user created the booking.
 */

// Database connection - auto-detects localhost vs production
try {
    require_once __DIR__ . '/config/database.php';
    $pdo = getDatabaseConnection();
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    exit(1);
}

echo "🚀 Checking if user_id column exists in bookings table...\n";

try {
    // Check if user_id column exists
    $checkStmt = $pdo->query("SHOW COLUMNS FROM bookings LIKE 'user_id'");
    $columnExists = $checkStmt->rowCount() > 0;
    
    if ($columnExists) {
        echo "✅ user_id column already exists in bookings table.\n";
    } else {
        echo "⚠️  user_id column does not exist. Adding it now...\n";
        
        // Add user_id column
        $pdo->exec("ALTER TABLE bookings ADD COLUMN user_id INT NULL AFTER customer_id");
        
        echo "✅ user_id column added successfully.\n";
        echo "Note: Existing bookings will have user_id as NULL.\n";
        echo "New bookings created through admin panel will have user_id set.\n";
    }
    
    // Show current structure
    echo "\n📋 Current bookings table structure:\n";
    $stmt = $pdo->query("SHOW COLUMNS FROM bookings");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $column) {
        echo "  - {$column['Field']} ({$column['Type']})\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>



