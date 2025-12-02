<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get booking ID from query parameter or URL path
$bookingId = null;

// Try to get ID from query parameter first
if (isset($_GET['id'])) {
    $bookingId = $_GET['id'];
} else {
    // Try to extract from URL path
    $url = $_SERVER['REQUEST_URI'];
    $pathParts = explode('/', trim($url, '/'));
    
    // Look for the ID in the path (should be after 'bookings')
    for ($i = 0; $i < count($pathParts) - 1; $i++) {
        if ($pathParts[$i] === 'bookings' && isset($pathParts[$i + 1])) {
            $bookingId = $pathParts[$i + 1];
            break;
        }
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

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get booking details
        $stmt = $pdo->prepare("
            SELECT 
                b.*,
                c.name as customer_name,
                c.phone as customer_phone,
                c.email as customer_email
            FROM bookings b
            JOIN customers c ON b.customer_id = c.id
            WHERE b.id = ?
        ");
        $stmt->execute([$bookingId]);
        $booking = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$booking) {
            http_response_code(404);
            echo json_encode(['message' => 'Booking not found']);
            exit();
        }

        // Get passenger details
        $stmt = $pdo->prepare("SELECT * FROM passenger_details WHERE booking_id = ?");
        $stmt->execute([$bookingId]);
        $passengerDetails = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get service-specific details
        $stmt = $pdo->prepare("SELECT * FROM service_bookings WHERE booking_id = ?");
        $stmt->execute([$bookingId]);
        $serviceDetails = $stmt->fetch(PDO::FETCH_ASSOC);

        $booking['passenger_details'] = $passengerDetails;
        if ($serviceDetails) {
            $booking['service_details'] = json_decode($serviceDetails['details'], true);
        }

        // Map database field names to frontend expected names
        $booking['date'] = $booking['travel_date'];
        $booking['from'] = $booking['from_location'];
        $booking['to'] = $booking['to_location'];

        echo json_encode($booking);

    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Update booking
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid JSON input']);
            exit();
        }

        // Log the input for debugging
        error_log('PUT request received for booking ID: ' . $bookingId);
        error_log('Input data: ' . json_encode($input));


        try {
            $pdo->beginTransaction();

            // Update booking
            $stmt = $pdo->prepare("
                UPDATE bookings SET
                    service = ?,
                    from_location = ?,
                    to_location = ?,
                    travel_date = ?,
                    booking_date = ?,
                    passengers = ?,
                    amount = ?,
                    total_amount = ?,
                    paid_amount = ?,
                    pending_amount = ?,
                    status = ?,
                    payment_status = ?,
                    notes = ?,
                    updated_at = NOW()
                WHERE id = ?
            ");

            $stmt->execute([
                $input['service'],
                $input['from'],
                $input['to'],
                $input['date'],
                $input['booking_date'] ?? date('Y-m-d'),
                $input['passengers'],
                $input['total_amount'] ?? $input['amount'] ?? 0,
                $input['total_amount'] ?? $input['amount'] ?? 0,
                $input['paid_amount'] ?? 0,
                $input['pending_amount'] ?? ($input['total_amount'] ?? $input['amount'] ?? 0),
                $input['status'],
                $input['payment_status'],
                $input['notes'],
                $bookingId
            ]);

        // Update customer details
        $stmt = $pdo->prepare("
            UPDATE customers SET
                name = ?,
                phone = ?,
                email = ?
            WHERE id = (SELECT customer_id FROM bookings WHERE id = ?)
        ");

        $stmt->execute([
            $input['customer_name'],
            $input['customer_phone'],
            $input['customer_email'],
            $bookingId
        ]);

        // Update passenger details
        $stmt = $pdo->prepare("DELETE FROM passenger_details WHERE booking_id = ?");
        $stmt->execute([$bookingId]);

        if (isset($input['passenger_details']) && is_array($input['passenger_details'])) {
            $stmt = $pdo->prepare("
                INSERT INTO passenger_details (booking_id, name, age, gender) 
                VALUES (?, ?, ?, ?)
            ");

            foreach ($input['passenger_details'] as $passenger) {
                $stmt->execute([
                    $bookingId,
                    $passenger['name'],
                    $passenger['age'],
                    $passenger['gender']
                ]);
            }
        }

            $pdo->commit();

            echo json_encode([
                'success' => true,
                'message' => 'Booking updated successfully'
            ]);

        } catch (Exception $e) {
            $pdo->rollback();
            error_log('Booking update error: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to update booking: ' . $e->getMessage(),
                'error_details' => $e->getTraceAsString()
            ]);
        }

    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        // Delete booking
        $pdo->beginTransaction();

        // Delete passenger details
        $stmt = $pdo->prepare("DELETE FROM passenger_details WHERE booking_id = ?");
        $stmt->execute([$bookingId]);

        // Delete service details
        $stmt = $pdo->prepare("DELETE FROM service_bookings WHERE booking_id = ?");
        $stmt->execute([$bookingId]);

        // Delete booking
        $stmt = $pdo->prepare("DELETE FROM bookings WHERE id = ?");
        $stmt->execute([$bookingId]);

        $pdo->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Booking deleted successfully'
        ]);

    } else {
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
    }

} catch (Exception $e) {
    if (isset($pdo)) {
        $pdo->rollback();
    }
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

