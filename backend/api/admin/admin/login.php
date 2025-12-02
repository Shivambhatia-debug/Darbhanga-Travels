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

// Database configuration (production)
$host = 'localhost';
$dbname = 'u363779306_dbg_travels';
$username = 'u363779306_localhost';
$password = 'Shiva@8053';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
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

// Verify admin credentials
$stmt = $pdo->prepare("SELECT id, username, email, role, password FROM admins WHERE username = ?");
$stmt->execute([$username]);

$admin = $stmt->fetch(PDO::FETCH_ASSOC);

// Debug logging
if (!$admin) {
    http_response_code(401);
    echo json_encode([
        'message' => 'Invalid credentials',
        'debug' => 'Admin user not found in database'
    ]);
    exit();
}

// Debug: Check password verification
$passwordMatch = password_verify($password, $admin['password']);
error_log("Login attempt - Username: $username, Password match: " . ($passwordMatch ? 'YES' : 'NO'));

if ($admin && $passwordMatch) {
    // Remove password from response
    unset($admin['password']);
    // Generate JWT token (simplified version)
    $token = base64_encode(json_encode([
        'admin_id' => $admin['id'],
        'username' => $admin['username'],
        'role' => $admin['role'],
        'exp' => time() + (24 * 60 * 60) // 24 hours
    ]));
    
    echo json_encode([
        'success' => true,
        'token' => $token,
        'admin' => [
            'id' => $admin['id'],
            'username' => $admin['username'],
            'email' => $admin['email'],
            'role' => $admin['role']
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(['message' => 'Invalid credentials']);
}
?>
