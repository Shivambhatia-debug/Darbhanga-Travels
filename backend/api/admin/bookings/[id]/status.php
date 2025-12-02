<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit();
}

// Get booking ID from URL path
$url = $_SERVER['REQUEST_URI'];
$pathParts = explode('/', trim($url, '/'));
$bookingId = null;

// Find the booking ID in the path (should be the part before 'status.php')
for ($i = 0; $i < count($pathParts) - 1; $i++) {
    if ($pathParts[$i + 1] === 'status.php') {
        $bookingId = $pathParts[$i];
        break;
    }
}

if (!$bookingId) {
    http_response_code(400);
    echo json_encode(['message' => 'Booking ID is required']);
    exit();
}

// Database configuration (production)
$host = 'localhost';
$dbname = 'u363779306_dbg_travels';
$username = 'u363779306_localhost';
$password = 'Shiva@8053';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['status'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Status is required']);
        exit();
    }

    // Update booking status
    $stmt = $pdo->prepare("
        UPDATE bookings SET
            status = ?,
            updated_at = NOW()
        WHERE id = ?
    ");

    $stmt->execute([$input['status'], $bookingId]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['message' => 'Booking not found']);
        exit();
    }

    echo json_encode([
        'success' => true,
        'message' => 'Booking status updated successfully'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

























