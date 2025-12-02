<?php
/**
 * Simple Login API for Darbhanga Travels
 * Upload this file to public_html/api/admin/login.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection - auto-detects localhost vs production
require_once __DIR__ . '/config/database.php';

try {
    // Connect to database
    $pdo = getDatabaseConnection();
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        
        if (empty($username) || empty($password)) {
            http_response_code(400);
            echo json_encode(['message' => 'Username and password are required']);
            exit();
        }
        
        // Check if admin user exists
        $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
        $stmt->execute([$username]);
        $admin = $stmt->fetch();
        
        if ($admin && password_verify($password, $admin['password'])) {
            // Login successful
            $token = base64_encode($username . ':' . time());
            
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'admin' => [
                    'id' => $admin['id'],
                    'username' => $admin['username'],
                    'email' => $admin['email'],
                    'full_name' => $admin['full_name'],
                    'role' => $admin['role']
                ]
            ]);
        } else {
            // Login failed
            http_response_code(401);
            echo json_encode(['message' => 'Invalid username or password']);
        }
    } else {
        // GET request - return login form info
        echo json_encode([
            'message' => 'Darbhanga Travels Admin Login API',
            'method' => 'POST',
            'fields' => ['username', 'password']
        ]);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}
?>



















