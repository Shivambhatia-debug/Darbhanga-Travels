<?php
/**
 * Frontend API Fix
 * This creates a simple proxy to handle API calls from the static frontend
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

// Get the request path
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

// Remove /api/ prefix
$api_path = str_replace('/api/', '', $path);

// Route to the correct API file
$api_file = __DIR__ . '/' . $api_path . '.php';

if (file_exists($api_file)) {
    // Include the API file
    include $api_file;
} else {
    http_response_code(404);
    echo json_encode(['message' => 'API endpoint not found: ' . $api_path]);
}
?>





















