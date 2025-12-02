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
    
    if (!$payload || !isset($payload['admin_id']) || !isset($payload['exp'])) {
        throw new Exception('Invalid token');
    }
    
    // Check if token is expired
    if ($payload['exp'] < time()) {
        http_response_code(401);
        echo json_encode(['message' => 'Token expired']);
        exit();
    }
    
    // Database configuration (production)
    $host = 'localhost';
    $dbname = 'u363779306_dbg_travels';
    $username = 'u363779306_localhost';
    $password = 'Shiva@8053';
    
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
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
    echo json_encode(['message' => 'Invalid token']);
}
?>
