<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

echo json_encode([
    'success' => true,
    'message' => 'Direct access test - working',
    'timestamp' => date('Y-m-d H:i:s'),
    'url_info' => [
        'request_uri' => $_SERVER['REQUEST_URI'],
        'script_name' => $_SERVER['SCRIPT_NAME'],
        'query_string' => $_SERVER['QUERY_STRING'] ?? '',
        'request_method' => $_SERVER['REQUEST_METHOD']
    ],
    'file_info' => [
        'current_file' => __FILE__,
        'file_exists' => file_exists(__FILE__),
        'is_readable' => is_readable(__FILE__)
    ]
]);
?>



















