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
    'message' => '403 Error Debug - This file is accessible',
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => [
        'php_version' => phpversion(),
        'request_method' => $_SERVER['REQUEST_METHOD'],
        'request_uri' => $_SERVER['REQUEST_URI'],
        'script_name' => $_SERVER['SCRIPT_NAME'],
        'document_root' => $_SERVER['DOCUMENT_ROOT'],
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
    ],
    'file_info' => [
        'current_file' => __FILE__,
        'file_exists' => file_exists(__FILE__),
        'is_readable' => is_readable(__FILE__),
        'file_permissions' => substr(sprintf('%o', fileperms(__FILE__)), -4)
    ],
    'directory_info' => [
        'current_dir' => __DIR__,
        'dir_exists' => is_dir(__DIR__),
        'dir_readable' => is_readable(__DIR__),
        'dir_permissions' => substr(sprintf('%o', fileperms(__DIR__)), -4)
    ],
    'htaccess_info' => [
        'htaccess_exists' => file_exists(__DIR__ . '/.htaccess'),
        'htaccess_readable' => is_readable(__DIR__ . '/.htaccess')
    ]
]);
?>



















