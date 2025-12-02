<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection - auto-detects localhost vs production
require_once __DIR__ . '/../config/database.php';

try {
    $pdo = getDatabaseConnection();
    
    // Check if user is already logged in (check for token in headers or session)
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = '';
    
    if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        $token = $matches[1];
    }
    
    // For now, just return success to prevent 401 errors
    // In a real app, you'd verify the JWT token here
    echo json_encode([
        'success' => true,
        'message' => 'Admin verification endpoint working',
        'authenticated' => false, // Will be true when user actually logs in
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>



















