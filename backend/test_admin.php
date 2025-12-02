<?php
/**
 * Test Admin User in Database
 * Upload this to public_html/api/test_admin.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
$host = 'localhost';
$dbname = 'u363779306_dbg_travels';
$username = 'u363779306_localhost';
$password = 'Shiva@8053';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if admins table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'admins'");
    $tableExists = $stmt->rowCount() > 0;
    
    if (!$tableExists) {
        echo json_encode([
            "status" => "error",
            "message" => "Admins table does not exist",
            "timestamp" => date('Y-m-d H:i:s')
        ]);
        exit();
    }
    
    // Get all admin users
    $stmt = $pdo->query("SELECT id, username, email, role, password FROM admins");
    $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Test password verification for admin user
    $testPassword = 'admin123';
    $testUsername = 'admin';
    
    $stmt = $pdo->prepare("SELECT password FROM admins WHERE username = ?");
    $stmt->execute([$testUsername]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $passwordMatch = false;
    if ($admin) {
        $passwordMatch = password_verify($testPassword, $admin['password']);
    }
    
    echo json_encode([
        "status" => "success",
        "message" => "Database connection successful",
        "timestamp" => date('Y-m-d H:i:s'),
        "database_info" => [
            "host" => $host,
            "database" => $dbname,
            "username" => $username
        ],
        "table_check" => [
            "admins_table_exists" => $tableExists,
            "admin_count" => count($admins)
        ],
        "admin_users" => array_map(function($admin) {
            unset($admin['password']); // Remove password from output
            return $admin;
        }, $admins),
        "test_credentials" => [
            "username" => $testUsername,
            "password" => $testPassword,
            "user_exists" => $admin ? true : false,
            "password_match" => $passwordMatch
        ],
        "instructions" => [
            "1. Check if admin user exists",
            "2. Verify password is hashed correctly",
            "3. Test login with: admin / admin123"
        ]
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed: " . $e->getMessage(),
        "timestamp" => date('Y-m-d H:i:s')
    ]);
}
?>





















