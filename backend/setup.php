<?php
/**
 * Darbhanga Travels Admin Panel Setup Script
 * Run this script to set up the database and initial data
 */

// Database configuration
$host = 'localhost';
$dbname = 'darbhanga_travels';
$username = 'root';
$password = '';

echo "🚀 Setting up Darbhanga Travels Admin Panel...\n\n";

try {
    // Connect to MySQL server
    $pdo = new PDO("mysql:host=$host;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Connected to MySQL server\n";
    
    // Read and execute schema
    $schema = file_get_contents(__DIR__ . '/database/schema.sql');
    $statements = explode(';', $schema);
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement)) {
            $pdo->exec($statement);
        }
    }
    
    echo "✅ Database schema created successfully\n";
    
    // Test admin login
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM admins WHERE username = 'admin'");
    $stmt->execute();
    $adminCount = $stmt->fetchColumn();
    
    if ($adminCount > 0) {
        echo "✅ Default admin user created\n";
        echo "   Username: admin\n";
        echo "   Password: admin123\n";
    }
    
    // Test settings
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM settings");
    $stmt->execute();
    $settingsCount = $stmt->fetchColumn();
    
    if ($settingsCount > 0) {
        echo "✅ Default settings created\n";
    }
    
    echo "\n🎉 Setup completed successfully!\n\n";
    echo "Next steps:\n";
    echo "1. Start your PHP server: php -S localhost:8000 -t backend\n";
    echo "2. Start your Next.js development server: npm run dev\n";
    echo "3. Access the admin panel at: http://localhost:3000/admin\n";
    echo "4. Login with admin/admin123\n\n";
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
    echo "Please check your MySQL connection and try again.\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>




































