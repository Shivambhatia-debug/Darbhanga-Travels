<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Fetch customers with aggregates
        $stmt = $pdo->query("\n            SELECT c.id, c.name, c.phone, c.email, c.address, c.created_at,\n                   COALESCE(COUNT(b.id), 0) AS total_bookings,\n                   COALESCE(SUM(b.paid_amount), 0) AS total_spent\n            FROM customers c\n            LEFT JOIN bookings b ON b.customer_id = c.id\n            GROUP BY c.id\n            ORDER BY c.created_at DESC\n        ");
        $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'customers' => $customers
        ]);
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
        // Get all customers (unique phone numbers from bookings)
        $stmt = $pdo->query("
            SELECT 
                customer_phone,
                customer_name,
                customer_email,
                COUNT(*) as total_bookings,
                MAX(created_at) as last_booking,
                MIN(created_at) as first_booking
            FROM bookings 
            WHERE customer_phone IS NOT NULL AND customer_phone != ''
            GROUP BY customer_phone, customer_name, customer_email
            ORDER BY last_booking DESC
        ");
        $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $customers
        ]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create new customer (add booking)
        $input = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $pdo->prepare("
            INSERT INTO bookings (
                service, from_location, to_location, travel_date, return_date,
                passengers, customer_name, customer_phone, customer_email,
                amount, status, payment_status, notes, passenger_details,
                flight_number, seat_class, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        
        $result = $stmt->execute([
            $input['service'] ?? '',
            $input['from'] ?? '',
            $input['to'] ?? '',
            $input['date'] ?? '',
            $input['return_date'] ?? null,
            $input['passengers'] ?? 1,
            $input['customer_name'] ?? '',
            $input['customer_phone'] ?? '',
            $input['customer_email'] ?? '',
            $input['amount'] ?? 0,
            $input['status'] ?? 'pending',
            $input['payment_status'] ?? 'pending',
            $input['notes'] ?? '',
            json_encode($input['passenger_details'] ?? []),
            $input['flight_number'] ?? '',
            $input['seat_class'] ?? ''
        ]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Customer booking created successfully',
                'id' => $pdo->lastInsertId()
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to create customer booking'
            ]);
        }
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