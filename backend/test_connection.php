<?php
/**
 * Frontend-Backend Connection Test
 * Upload this to public_html/test_connection.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

echo json_encode([
    "status" => "success",
    "message" => "Frontend-Backend connection is working!",
    "timestamp" => date('Y-m-d H:i:s'),
    "server_info" => [
        "php_version" => phpversion(),
        "server_software" => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        "request_method" => $_SERVER['REQUEST_METHOD'],
        "request_uri" => $_SERVER['REQUEST_URI'],
        "http_host" => $_SERVER['HTTP_HOST'] ?? 'Unknown'
    ],
    "api_endpoints" => [
        "login" => "https://darbhangatravels.com/api/admin/login.php",
        "test_api" => "https://darbhangatravels.com/api/test_api.php",
        "debug_api" => "https://darbhangatravels.com/api/debug_api.php"
    ],
    "instructions" => [
        "1. Test this URL: https://darbhangatravels.com/test_connection.php",
        "2. Test API: https://darbhangatravels.com/api/admin/login.php",
        "3. Check if index.html has the API fix script",
        "4. Clear browser cache and try again"
    ]
]);
?>