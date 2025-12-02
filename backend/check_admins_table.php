<?php
require_once __DIR__ . '/config/database.php';

try {
    $pdo = getDatabaseConnection();
    
    echo "<h2>Check Admins Table Structure</h2>";
    
    // Check admins table columns
    $stmt = $pdo->query("SHOW COLUMNS FROM admins");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h3>Admins Table Columns:</h3>";
    echo "<pre>";
    print_r($columns);
    echo "</pre>";
    
    // Check if admin ID 1 exists
    $adminStmt = $pdo->prepare("SELECT * FROM admins WHERE id = 1");
    $adminStmt->execute();
    $admin = $adminStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        echo "<h3>Admin ID 1:</h3>";
        echo "<pre>";
        print_r($admin);
        echo "</pre>";
    } else {
        echo "<p>No admin with ID 1</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>Error: " . htmlspecialchars($e->getMessage()) . "</p>";
}
?>

