<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get Authorization header
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
    http_response_code(401);
    echo json_encode(['message' => 'Authorization header required']);
    exit();
}

$token = substr($authHeader, 7);

try {
    $payload = json_decode(base64_decode($token), true);
    
    if (!$payload || !isset($payload['user_id'])) {
        throw new Exception('Invalid token');
    }
    
    // Database connection - auto-detects localhost vs production
    require_once __DIR__ . '/../../config/database.php';
    
    $pdo = getDatabaseConnection();
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $bookingId = isset($_GET['booking_id']) ? intval($_GET['booking_id']) : null;

        if ($bookingId) {
            // Check if user_id column exists
            $userIdColumnExists = false;
            try {
                $checkStmt = $pdo->query("SHOW COLUMNS FROM bookings LIKE 'user_id'");
                $userIdColumnExists = $checkStmt->rowCount() > 0;
            } catch (Exception $e) {
                $userIdColumnExists = false;
            }
            
            if ($userIdColumnExists) {
                $stmt = $pdo->prepare("
                    SELECT 
                        b.*, 
                        COALESCE(b.customer_name, c.name) as customer_name, 
                        COALESCE(b.customer_phone, c.phone) as customer_phone, 
                        COALESCE(b.customer_email, c.email) as customer_email
                    FROM bookings b 
                    LEFT JOIN customers c ON b.customer_id = c.id 
                    WHERE b.user_id = ? AND b.user_id IS NOT NULL AND b.id = ?
                    LIMIT 1
                ");
                $stmt->execute([$payload['user_id'], $bookingId]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Booking not found'
                ]);
                exit();
            }
            $booking = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$booking) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Booking not found'
                ]);
                exit();
            }

            $passengerStmt = $pdo->prepare("
                SELECT name, age, gender 
                FROM passenger_details 
                WHERE booking_id = ?
            ");
            $passengerStmt->execute([$booking['id']]);
            $booking['passenger_details'] = $passengerStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'success' => true,
                'booking' => $booking
            ]);
        } else {
            // Get bookings for this user only - only show bookings that belong to this user
            // Also check if user_id column exists and filter accordingly
            $userIdColumnExists = false;
            try {
                $checkStmt = $pdo->query("SHOW COLUMNS FROM bookings LIKE 'user_id'");
                $userIdColumnExists = $checkStmt->rowCount() > 0;
            } catch (Exception $e) {
                $userIdColumnExists = false;
            }
            
            if ($userIdColumnExists) {
                // Check if bookings table has customer_name column
                $customerNameColumnExists = false;
                try {
                    $checkStmt = $pdo->query("SHOW COLUMNS FROM bookings LIKE 'customer_name'");
                    $customerNameColumnExists = $checkStmt->rowCount() > 0;
                } catch (Exception $e) {
                    $customerNameColumnExists = false;
                }
                
                // Filter by user_id - only show bookings where user_id matches and is not NULL
                if ($customerNameColumnExists) {
                    $stmt = $pdo->prepare("
                        SELECT 
                            b.*, 
                            COALESCE(b.customer_name, c.name) as customer_name, 
                            COALESCE(b.customer_phone, c.phone) as customer_phone, 
                            COALESCE(b.customer_email, c.email) as customer_email
                        FROM bookings b 
                        LEFT JOIN customers c ON b.customer_id = c.id 
                        WHERE b.user_id = ? AND b.user_id IS NOT NULL
                        ORDER BY b.created_at DESC
                    ");
                } else {
                    $stmt = $pdo->prepare("
                        SELECT 
                            b.*, 
                            c.name as customer_name, 
                            c.phone as customer_phone, 
                            c.email as customer_email
                        FROM bookings b 
                        LEFT JOIN customers c ON b.customer_id = c.id 
                        WHERE b.user_id = ? AND b.user_id IS NOT NULL
                        ORDER BY b.created_at DESC
                    ");
                }
                $stmt->execute([$payload['user_id']]);
            } else {
                // If user_id column doesn't exist, return empty array (no bookings)
                $stmt = $pdo->prepare("SELECT * FROM bookings WHERE 1=0");
                $stmt->execute();
            }
            
            $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Fetch passenger details for each booking
            foreach ($bookings as &$booking) {
                $passengerStmt = $pdo->prepare("
                    SELECT name, age, gender 
                    FROM passenger_details 
                    WHERE booking_id = ?
                ");
                $passengerStmt->execute([$booking['id']]);
                $booking['passenger_details'] = $passengerStmt->fetchAll(PDO::FETCH_ASSOC);
            }
            
            echo json_encode([
                'success' => true,
                'bookings' => $bookings
            ]);
        }
        
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}



