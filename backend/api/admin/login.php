<?php
// Suppress any warnings/notices that might interfere with JSON output
error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection - auto-detects localhost vs production
try {
    require_once __DIR__ . '/../../config/database.php';
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database configuration error: ' . $e->getMessage()
    ]);
    exit();
}

try {
    $pdo = getDatabaseConnection();
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get POST data
        $input = json_decode(file_get_contents('php://input'), true);
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        
        if (empty($username) || empty($password)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Username and password are required'
            ]);
            exit();
        }
        
        // Find admin user
        $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
        $stmt->execute([$username]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($admin && password_verify($password, $admin['password'])) {
            // Generate token with admin_id and expiration (valid for 24 hours)
            $tokenData = [
                'admin_id' => $admin['id'],
                'username' => $admin['username'],
                'exp' => time() + (24 * 60 * 60) // 24 hours from now
            ];
            $token = base64_encode(json_encode($tokenData));
            
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'id' => $admin['id'],
                    'username' => $admin['username'],
                    'email' => $admin['email'] ?? ''
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid credentials'
            ]);
        }
    } else {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method not allowed'
        ]);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Database error in login.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    error_log("Server error in login.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>

