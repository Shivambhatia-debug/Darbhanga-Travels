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
    'message' => 'Admin folder is accessible - 403 error debug',
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => [
        'php_version' => phpversion(),
        'request_method' => $_SERVER['REQUEST_METHOD'],
        'request_uri' => $_SERVER['REQUEST_URI'],
        'script_name' => $_SERVER['SCRIPT_NAME']
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
    'admin_files' => [
        'login_php_exists' => file_exists(__DIR__ . '/login.php'),
        'bookings_php_exists' => file_exists(__DIR__ . '/bookings.php'),
        'verify_php_exists' => file_exists(__DIR__ . '/verify.php'),
        'dashboard_php_exists' => file_exists(__DIR__ . '/dashboard.php'),
        'customers_php_exists' => file_exists(__DIR__ . '/customers.php'),
        'settings_php_exists' => file_exists(__DIR__ . '/settings.php')
    ]
]);
?>






