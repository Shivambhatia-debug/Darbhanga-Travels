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

try {
    $payload = json_decode(base64_decode($token), true);
    
    if (!$payload || !isset($payload['user_id']) || !isset($payload['exp'])) {
        throw new Exception('Invalid token');
    }
    
    // Check if token is expired
    if ($payload['exp'] < time()) {
        http_response_code(401);
        echo json_encode(['message' => 'Token expired']);
        exit();
    }
    
    // Database connection - auto-detects localhost vs production
    require_once __DIR__ . '/../../config/database.php';
    
    $pdo = getDatabaseConnection();
    
    // Verify user still exists
    $stmt = $pdo->prepare("SELECT id, username, full_name, email, phone FROM users WHERE id = ?");
    $stmt->execute([$payload['user_id']]);
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['message' => 'User not found']);
        exit();
    }
    
    echo json_encode([
        'success' => true,
        'user' => $user
    ]);
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['message' => 'Invalid token']);
}



