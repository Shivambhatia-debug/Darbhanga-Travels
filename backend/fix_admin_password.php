<?php
/**
 * Fix Admin Password
 * Upload this to public_html/api/fix_admin_password.php
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
    
    // New password to set
    $newPassword = 'admin123';
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // Update admin password
    $stmt = $pdo->prepare("UPDATE admins SET password = ? WHERE username = 'admin'");
    $result = $stmt->execute([$hashedPassword]);
    
    if ($result) {
        // Verify the update worked
        $stmt = $pdo->prepare("SELECT username, password FROM admins WHERE username = 'admin'");
        $stmt->execute();
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $passwordMatch = password_verify($newPassword, $admin['password']);
        
        echo json_encode([
            "status" => "success",
            "message" => "Admin password updated successfully!",
            "timestamp" => date('Y-m-d H:i:s'),
            "details" => [
                "username" => "admin",
                "new_password" => $newPassword,
                "password_hashed" => true,
                "password_verified" => $passwordMatch,
                "login_credentials" => [
                    "username" => "admin",
                    "password" => "admin123"
                ]
            ],
            "instructions" => [
                "1. Password has been updated to: admin123",
                "2. Try logging in with: admin / admin123",
                "3. Delete this file after successful login for security"
            ]
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Failed to update admin password",
            "timestamp" => date('Y-m-d H:i:s')
        ]);
    }
    
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage(),
        "timestamp" => date('Y-m-d H:i:s')
    ]);
}
?>





















