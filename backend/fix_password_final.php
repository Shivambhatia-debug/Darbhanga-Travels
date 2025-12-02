<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$host = 'localhost';
$dbname = 'u363779306_dbg_travels';
$username = 'u363779306_localhost';
$password = 'Shiva@8053';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h2>Password Fix Script</h2>";
    
    // Check current admin user
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
    $stmt->execute(['admin']);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        echo "<p><strong>Current admin user found:</strong></p>";
        echo "<p>Username: " . $admin['username'] . "</p>";
        echo "<p>Current password hash: " . $admin['password'] . "</p>";
        
        // Test current password
        $testPassword = 'admin123';
        $currentHash = $admin['password'];
        
        echo "<p><strong>Testing current password:</strong></p>";
        echo "<p>Testing password: admin123</p>";
        echo "<p>Current hash: " . $currentHash . "</p>";
        
        // Try different verification methods
        echo "<p><strong>Password verification tests:</strong></p>";
        echo "<p>password_verify(): " . (password_verify($testPassword, $currentHash) ? 'TRUE' : 'FALSE') . "</p>";
        echo "<p>md5(): " . (md5($testPassword) === $currentHash ? 'TRUE' : 'FALSE') . "</p>";
        echo "<p>sha1(): " . (sha1($testPassword) === $currentHash ? 'TRUE' : 'FALSE') . "</p>";
        echo "<p>Direct comparison: " . ($testPassword === $currentHash ? 'TRUE' : 'FALSE') . "</p>";
        
        // Create new password hash
        $newHash = password_hash($testPassword, PASSWORD_DEFAULT);
        echo "<p><strong>New password hash:</strong> " . $newHash . "</p>";
        
        // Update the password
        $updateStmt = $pdo->prepare("UPDATE admins SET password = ? WHERE username = ?");
        $updateStmt->execute([$newHash, 'admin']);
        
        echo "<p><strong>✅ Password updated successfully!</strong></p>";
        
        // Test the new password
        echo "<p><strong>Testing new password:</strong></p>";
        echo "<p>password_verify() with new hash: " . (password_verify($testPassword, $newHash) ? 'TRUE' : 'FALSE') . "</p>";
        
    } else {
        echo "<p><strong>❌ Admin user not found!</strong></p>";
        
        // Create admin user
        $newHash = password_hash('admin123', PASSWORD_DEFAULT);
        $insertStmt = $pdo->prepare("INSERT INTO admins (username, password, email, created_at) VALUES (?, ?, ?, NOW())");
        $insertStmt->execute(['admin', $newHash, 'admin@darbhangatravels.com']);
        
        echo "<p><strong>✅ Admin user created successfully!</strong></p>";
        echo "<p>Username: admin</p>";
        echo "<p>Password: admin123</p>";
        echo "<p>Hash: " . $newHash . "</p>";
    }
    
    echo "<hr>";
    echo "<p><strong>Test the login now:</strong></p>";
    echo "<p><a href='../admin/' target='_blank'>Go to Admin Login</a></p>";
    echo "<p>Use: admin / admin123</p>";
    
} catch (PDOException $e) {
    echo "<p><strong>❌ Database Error:</strong> " . $e->getMessage() . "</p>";
}
?>





















