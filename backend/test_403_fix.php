<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Test database connection
try {
    $host = 'localhost';
    $dbname = 'u363779306_dbg_travels';
    $username = 'u363779306_localhost';
    $password = 'Shiva@8053';
    
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Test query
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM bookings");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'message' => '403 Fix Test - Database connection successful',
        'timestamp' => date('Y-m-d H:i:s'),
        'database_test' => [
            'connection' => 'success',
            'bookings_count' => $result['count']
        ],
        'server_info' => [
            'php_version' => phpversion(),
            'request_method' => $_SERVER['REQUEST_METHOD'],
            'request_uri' => $_SERVER['REQUEST_URI'],
            'script_name' => $_SERVER['SCRIPT_NAME']
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed',
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>

















