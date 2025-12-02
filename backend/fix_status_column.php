<?php
/**
 * Fix Status Column in Bookings Table
 * This script converts status column from ENUM to VARCHAR
 */

header('Content-Type: text/html; charset=utf-8');

echo "<h2>🔧 Fixing Status Column in Bookings Table</h2>\n";

// Database connection - auto-detects localhost vs production
require_once __DIR__ . '/config/database.php';

try {
    $pdo = getDatabaseConnection();
    
    echo "<h3>Step 1: Checking current status column type...</h3>\n";
    
    // Check current column type
    $stmt = $pdo->query("
        SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, COLUMN_DEFAULT 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'bookings' 
          AND COLUMN_NAME = 'status'
    ");
    
    $columnInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($columnInfo) {
        echo "<p>Current status column type: <strong>{$columnInfo['COLUMN_TYPE']}</strong></p>\n";
        echo "<p>Data type: <strong>{$columnInfo['DATA_TYPE']}</strong></p>\n";
    } else {
        echo "<p style='color: red;'>❌ Status column not found!</p>\n";
        exit(1);
    }
    
    echo "<h3>Step 2: Converting status column to VARCHAR...</h3>\n";
    
    // Convert status column to VARCHAR
    $pdo->exec("ALTER TABLE bookings MODIFY COLUMN status VARCHAR(50) DEFAULT 'new_booking'");
    echo "<p style='color: green;'>✅ Status column converted to VARCHAR successfully!</p>\n";
    
    // Also convert payment_status if needed
    echo "<h3>Step 3: Converting payment_status column to VARCHAR...</h3>\n";
    try {
        $pdo->exec("ALTER TABLE bookings MODIFY COLUMN payment_status VARCHAR(50) DEFAULT 'pending'");
        echo "<p style='color: green;'>✅ Payment status column converted to VARCHAR successfully!</p>\n";
    } catch (Exception $e) {
        echo "<p style='color: orange;'>⚠️ Payment status update: " . $e->getMessage() . "</p>\n";
    }
    
    echo "<h3>Step 4: Verifying changes...</h3>\n";
    
    // Verify the change
    $stmt = $pdo->query("
        SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, COLUMN_DEFAULT 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'bookings' 
          AND COLUMN_NAME = 'status'
    ");
    
    $newColumnInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($newColumnInfo && $newColumnInfo['DATA_TYPE'] === 'varchar') {
        echo "<p style='color: green;'>✅ Verification successful! Status column is now VARCHAR(50)</p>\n";
        echo "<p><strong>New column type:</strong> {$newColumnInfo['COLUMN_TYPE']}</p>\n";
        echo "<p><strong>Default value:</strong> {$newColumnInfo['COLUMN_DEFAULT']}</p>\n";
    } else {
        echo "<p style='color: red;'>❌ Verification failed!</p>\n";
    }
    
    echo "<h3 style='color: green;'>🎉 Status column fix completed successfully!</h3>\n";
    echo "<p>You can now use any status value like 'not_booked', 'new_booking', etc.</p>\n";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Database error: " . $e->getMessage() . "</p>\n";
    echo "<p>Make sure you have proper permissions to alter the table.</p>\n";
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>\n";
}
?>



