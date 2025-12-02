<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get booking ID from URL
$bookingId = basename($_SERVER['REQUEST_URI']);

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

        echo json_encode($booking);

    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Update booking
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid JSON input']);
            exit();
        }

        $pdo->beginTransaction();

        // Update booking
        $stmt = $pdo->prepare("
            UPDATE bookings SET
                service = ?,
                from_location = ?,
                to_location = ?,
                travel_date = ?,
                return_date = ?,
                passengers = ?,
                amount = ?,
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
            $input['return_date'] ?? null,
            $input['passengers'],
            $input['amount'],
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






























