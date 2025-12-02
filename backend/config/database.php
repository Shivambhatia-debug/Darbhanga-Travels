<?php
/**
 * Database Configuration for Darbhanga Travels
 * Auto-detects localhost vs production environment
 */

function getDatabaseConnection() {
    // Detect if we're on localhost or production
    // In CLI mode, default to localhost. In web mode, check HTTP_HOST
    $isCli = php_sapi_name() === 'cli';
    
    $httpHost = $_SERVER['HTTP_HOST'] ?? '';
    $serverName = $_SERVER['SERVER_NAME'] ?? '';
    $remoteAddr = $_SERVER['REMOTE_ADDR'] ?? '';
    
    // Check for explicit environment variable
    $env = $_SERVER['DB_ENV'] ?? $_ENV['DB_ENV'] ?? '';
    if ($env === 'production') {
        $isLocalhost = false;
    } elseif ($env === 'local' || $env === 'localhost') {
        $isLocalhost = true;
    } else {
        // Auto-detect based on environment
        $isLocalhost = $isCli || (
            strpos($httpHost, 'localhost') !== false ||
            strpos($httpHost, '127.0.0.1') !== false ||
            $httpHost === 'localhost' ||
            $httpHost === '127.0.0.1' ||
            $serverName === 'localhost' ||
            $serverName === '127.0.0.1' ||
            $remoteAddr === '127.0.0.1' ||
            $remoteAddr === '::1' ||
            empty($httpHost) // CLI or no HTTP_HOST means localhost
        );
    }
    
    if ($isLocalhost) {
        // Localhost configuration
        $host = 'localhost';
        $dbname = 'darbhangatravels_db';
        $username = 'root';
        $password = '';
    } else {
        // Production configuration (Hostinger)
        $host = 'localhost';
        $dbname = 'u363779306_dbg_travels';
        $username = 'u363779306_localhost';
        $password = 'Shiva@8053';
    }
    
    try {
        $pdo = new PDO(
            "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
            $username,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        throw new Exception("Database connection failed. Please check your database configuration.");
    }
}
?>

