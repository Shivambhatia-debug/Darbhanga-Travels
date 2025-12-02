<?php
/**
 * Test URL Rewriting
 * Upload this to public_html/api/test_rewrite.php
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
    "message" => "URL rewriting is working!",
    "method" => $_SERVER['REQUEST_METHOD'],
    "request_uri" => $_SERVER['REQUEST_URI'],
    "script_name" => $_SERVER['SCRIPT_NAME'],
    "timestamp" => date('Y-m-d H:i:s'),
    "test_urls" => [
        "with_extension" => "https://darbhangatravels.com/api/test_rewrite.php",
        "without_extension" => "https://darbhangatravels.com/api/test_rewrite"
    ]
]);
?>





















