<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$dbname = 'u363779306_dbg_travels';
$username = 'u363779306_localhost';
$password = 'Shiva@8053';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Ensure settings table
    $pdo->exec("CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT NULL,
        description VARCHAR(255) NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->query("SELECT id, setting_key, setting_value, description FROM settings ORDER BY setting_key ASC");
        $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'settings' => $settings]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        $settings = $input['settings'] ?? [];

        $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value, description) VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), description = VALUES(description)");

        foreach ($settings as $s) {
            $stmt->execute([
                $s['setting_key'] ?? '',
                $s['setting_value'] ?? '',
                $s['description'] ?? null
            ]);
        }

        echo json_encode(['success' => true, 'message' => 'Settings updated']);
        exit;
    }

    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>

<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$host = 'localhost';
$dbname = 'u363779306_dbg_travels';
$username = 'u363779306_localhost';
$password = 'Shiva@8053';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get settings (for now, return default settings)
        $settings = [
            'company_name' => 'Darbhanga Travels',
            'contact_phone' => '+919876543210',
            'contact_email' => 'info@darbhangatravels.com',
            'address' => 'Darbhanga, Bihar, India',
            'booking_commission' => 5,
            'auto_confirm_bookings' => false,
            'email_notifications' => true,
            'sms_notifications' => true,
            'currency' => 'INR',
            'timezone' => 'Asia/Kolkata'
        ];
        
        echo json_encode([
            'success' => true,
            'data' => $settings
        ]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Update settings
        $input = json_decode(file_get_contents('php://input'), true);
        
        // For now, just return success (in production, save to database)
        echo json_encode([
            'success' => true,
            'message' => 'Settings updated successfully',
            'data' => $input
        ]);
    } else {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method not allowed'
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>