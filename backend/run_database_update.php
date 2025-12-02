<?php
// Script to run database updates
header('Content-Type: text/html; charset=utf-8');

// Database connection
$host = 'localhost';
$dbname = 'u363779306_dbg_travels';
$username = 'u363779306_localhost';
$password = 'Shiva@8053';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h2>Database Update Script</h2>";
    echo "<p>Connected to database successfully!</p>";
    
    // Read and execute the update script
    $updateScript = file_get_contents('database/update_bookings_schema.sql');
    $statements = explode(';', $updateScript);
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement)) {
            try {
                $pdo->exec($statement);
                echo "<p style='color: green;'>✓ Executed: " . substr($statement, 0, 50) . "...</p>";
            } catch (Exception $e) {
                echo "<p style='color: orange;'>⚠ Warning: " . $e->getMessage() . "</p>";
            }
        }
    }
    
    echo "<h3>Database update completed!</h3>";
    echo "<p><a href='../admin/'>Go to Admin Panel</a></p>";
    
} catch (Exception $e) {
    echo "<h2>Error</h2>";
    echo "<p style='color: red;'>Database connection failed: " . $e->getMessage() . "</p>";
}
?>

















