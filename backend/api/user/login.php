<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit();
}

// Database connection - auto-detects localhost vs production
require_once __DIR__ . '/../../config/database.php';

try {
    $pdo = getDatabaseConnection();
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// Get input data
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['username']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Username and password are required']);
    exit();
}

$username = $input['username'];
$password = $input['password'];

// Verify user credentials
$stmt = $pdo->prepare("SELECT id, username, full_name, email, phone, password FROM users WHERE username = ?");
$stmt->execute([$username]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    http_response_code(401);
    echo json_encode(['message' => 'Invalid credentials']);
    exit();
}

// Verify password
if (password_verify($password, $user['password'])) {
    // Remove password from response
    unset($user['password']);
    
    // Generate token
    $token = base64_encode(json_encode([
        'user_id' => $user['id'],
        'username' => $user['username'],
        'exp' => time() + (24 * 60 * 60) // 24 hours
    ]));
    
    echo json_encode([
        'success' => true,
        'token' => $token,
        'user' => $user
    ]);
} else {
    http_response_code(401);
    echo json_encode(['message' => 'Invalid credentials']);
}



