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
        // Get all bookings with customer details and passenger details
        $stmt = $pdo->query("
            SELECT b.*, c.name as customer_name, c.phone as customer_phone, c.email as customer_email
            FROM bookings b 
            LEFT JOIN customers c ON b.customer_id = c.id 
            ORDER BY b.created_at DESC
        ");
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
            'data' => $bookings
        ]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create new booking
        $input = json_decode(file_get_contents('php://input'), true);
        
        // First, create or get customer
        $customerId = null;
        if (isset($input['customer_name']) && isset($input['customer_phone'])) {
            try {
                // Check if customer exists
                $stmt = $pdo->prepare("SELECT id FROM customers WHERE phone = ?");
                $stmt->execute([$input['customer_phone']]);
                $existingCustomer = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($existingCustomer) {
                    $customerId = $existingCustomer['id'];
                    error_log("Found existing customer with ID: " . $customerId);
                } else {
                    // Create new customer
                    $stmt = $pdo->prepare("
                        INSERT INTO customers (name, phone, email, address) 
                        VALUES (?, ?, ?, ?)
                    ");
                    $stmt->execute([
                        $input['customer_name'] ?? '',
                        $input['customer_phone'] ?? '',
                        $input['customer_email'] ?? '',
                        $input['customer_address'] ?? ''
                    ]);
                    $customerId = $pdo->lastInsertId();
                    error_log("Created new customer with ID: " . $customerId);
                }
            } catch (Exception $e) {
                error_log("Customer creation error: " . $e->getMessage());
                // If customer creation fails, we'll still try to create the booking without customer_id
            }
        }
        
        // Insert booking
        $stmt = $pdo->prepare("
            INSERT INTO bookings (
                customer_id, service, from_location, to_location, travel_date, booking_date, return_date,
                passengers, amount, total_amount, paid_amount, pending_amount, 
                status, payment_status, notes, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        
        $result = $stmt->execute([
            $customerId,
            $input['service'] ?? '',
            $input['from'] ?? '',
            $input['to'] ?? '',
            $input['date'] ?? '',
            $input['booking_date'] ?? null,
            $input['return_date'] ?? null,
            $input['passengers'] ?? 1,
            $input['amount'] ?? 0,
            $input['total_amount'] ?? 0,
            $input['paid_amount'] ?? 0,
            $input['pending_amount'] ?? 0,
            $input['status'] ?? 'pending',
            $input['payment_status'] ?? 'pending',
            $input['notes'] ?? ''
        ]);
        
        if ($result) {
            $bookingId = $pdo->lastInsertId();
            
            // Add passenger details if provided
            if (isset($input['passenger_details']) && is_array($input['passenger_details'])) {
                $stmt = $pdo->prepare("
                    INSERT INTO passenger_details (booking_id, name, age, gender, seat_number) 
                    VALUES (?, ?, ?, ?, ?)
                ");
                
                foreach ($input['passenger_details'] as $passenger) {
                    $stmt->execute([
                        $bookingId,
                        $passenger['name'] ?? '',
                        $passenger['age'] ?? 0,
                        $passenger['gender'] ?? 'male',
                        $passenger['seat_number'] ?? ''
                    ]);
                }
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Booking created successfully',
                'id' => $bookingId
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to create booking'
            ]);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Update existing booking
        $input = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $pdo->prepare("
            UPDATE bookings SET 
                service = ?, from_location = ?, to_location = ?, travel_date = ?, booking_date = ?,
                passengers = ?, amount = ?, total_amount = ?, paid_amount = ?, pending_amount = ?,
                status = ?, payment_status = ?, notes = ?, updated_at = NOW()
            WHERE id = ?
        ");
        
        $result = $stmt->execute([
            $input['service'] ?? '',
            $input['from_location'] ?? '',
            $input['to_location'] ?? '',
            $input['travel_date'] ?? '',
            $input['booking_date'] ?? null,
            $input['passengers'] ?? 1,
            $input['amount'] ?? 0,
            $input['total_amount'] ?? 0,
            $input['paid_amount'] ?? 0,
            $input['pending_amount'] ?? 0,
            $input['status'] ?? 'pending',
            $input['payment_status'] ?? 'pending',
            $input['notes'] ?? '',
            $input['id']
        ]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Booking updated successfully'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to update booking'
            ]);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        // Delete booking
        $input = json_decode(file_get_contents('php://input'), true);
        $bookingId = $input['id'] ?? $_GET['id'] ?? null;
        
        if (!$bookingId) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Booking ID is required'
            ]);
            exit;
        }
        
        $stmt = $pdo->prepare("DELETE FROM bookings WHERE id = ?");
        $result = $stmt->execute([$bookingId]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Booking deleted successfully'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to delete booking'
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