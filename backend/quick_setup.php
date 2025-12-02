<?php
/**
 * Quick Database Setup for Darbhanga Travels
 * Run this to create database and tables quickly
 */

$host = 'localhost';
$dbname = 'darbhangatravels_db';
$username = 'root';
$password = '';

echo "🚀 Quick Database Setup for Darbhanga Travels\n";
echo "============================================\n\n";

try {
    // Connect to MySQL server (without database)
    $pdo = new PDO("mysql:host=$host;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ Connected to MySQL server\n";
    
    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS $dbname");
    echo "✅ Database '$dbname' created/verified\n";
    
    // Use the database
    $pdo->exec("USE $dbname");
    echo "✅ Using database '$dbname'\n";
    
    // Read and execute schema
    $schema = file_get_contents(__DIR__ . '/database/schema.sql');
    $statements = explode(';', $schema);
    
    $tableCount = 0;
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement) && !str_starts_with($statement, '--')) {
            try {
                $pdo->exec($statement);
                if (str_contains($statement, 'CREATE TABLE')) {
                    $tableCount++;
                }
            } catch (PDOException $e) {
                // Ignore table already exists errors
                if (!str_contains($e->getMessage(), 'already exists')) {
                    echo "⚠️  Warning: " . $e->getMessage() . "\n";
                }
            }
        }
    }
    
    echo "✅ Database schema executed successfully\n";
    echo "✅ Created/verified $tableCount tables\n";
    
    // Test admin login
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM admins WHERE username = 'admin'");
    $stmt->execute();
    $adminCount = $stmt->fetchColumn();
    
    if ($adminCount > 0) {
        echo "✅ Default admin user verified\n";
        echo "   Username: admin\n";
        echo "   Password: admin123\n";
    } else {
        echo "❌ Admin user not found\n";
    }
    
    // Test settings
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM settings");
    $stmt->execute();
    $settingsCount = $stmt->fetchColumn();
    
    if ($settingsCount > 0) {
        echo "✅ Default settings verified\n";
    } else {
        echo "❌ Settings not found\n";
    }
    
    echo "\n🎉 Database setup completed successfully!\n\n";
    echo "Next steps:\n";
    echo "1. Start PHP server: php -S localhost:8000 -t backend\n";
    echo "2. Start Next.js: npm run dev\n";
    echo "3. Access admin panel: http://localhost:3000/admin\n";
    echo "4. Login with: admin / admin123\n\n";
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
    echo "\nTroubleshooting:\n";
    echo "1. Make sure MySQL is running\n";
    echo "2. Check if XAMPP/WAMP is started\n";
    echo "3. Verify database credentials\n";
    echo "4. Try running: mysql -u root -p\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>




































