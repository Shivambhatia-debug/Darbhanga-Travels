<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit();
}

// Get Authorization header
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
    http_response_code(401);
    echo json_encode(['message' => 'Authorization header required']);
    exit();
}

$token = substr($authHeader, 7); // Remove 'Bearer ' prefix

// Database connection - auto-detects localhost vs production
require_once __DIR__ . '/../../config/database.php';

try {
    $pdo = getDatabaseConnection();
    
    // Decode the token
    $decoded = base64_decode($token, true);
    if ($decoded === false) {
        throw new Exception('Invalid token encoding');
    }
    
    $payload = json_decode($decoded, true);
    
    if (!$payload || !isset($payload['admin_id'])) {
        // If token doesn't have expected format, try simple format (backward compatibility)
        $parts = explode(':', $decoded);
        if (count($parts) === 2) {
            // Simple format: username:timestamp
            $username = $parts[0];
            $stmt = $pdo->prepare("SELECT id, username, email, role FROM admins WHERE username = ?");
            $stmt->execute([$username]);
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($admin) {
                echo json_encode([
                    'success' => true,
                    'admin' => $admin
                ]);
                exit();
            }
        }
        throw new Exception('Invalid token format');
    }
    
    // Check if token is expired (if exp is set)
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        http_response_code(401);
        echo json_encode(['message' => 'Token expired']);
        exit();
    }
    
    // Verify admin still exists
    $stmt = $pdo->prepare("SELECT id, username, email, role FROM admins WHERE id = ?");
    $stmt->execute([$payload['admin_id']]);
    
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$admin) {
        http_response_code(401);
        echo json_encode(['message' => 'Admin not found']);
        exit();
    }
    
    echo json_encode([
        'success' => true,
        'admin' => $admin
    ]);
    
} catch (Exception $e) {
    http_response_code(401);
    error_log("Verify error: " . $e->getMessage());
    echo json_encode(['message' => 'Invalid token: ' . $e->getMessage()]);
}
?>
