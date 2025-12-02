<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection - auto-detects localhost vs production
require_once __DIR__ . '/../config/database.php';

try {
    $pdo = getDatabaseConnection();
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get bookings (for customer view)
        $phone = $_GET['phone'] ?? '';
        
        if ($phone) {
            // Join with customers table to get bookings by phone
            $stmt = $pdo->prepare("
                SELECT b.*, c.name as customer_name, c.phone as customer_phone, c.email as customer_email 
                FROM bookings b 
                LEFT JOIN customers c ON b.customer_id = c.id 
                WHERE c.phone = ? 
                ORDER BY b.created_at DESC
            ");
            $stmt->execute([$phone]);
        } else {
            // Join with customers table to get customer details
            $stmt = $pdo->query("
                SELECT b.*, c.name as customer_name, c.phone as customer_phone, c.email as customer_email 
                FROM bookings b 
                LEFT JOIN customers c ON b.customer_id = c.id 
                ORDER BY b.created_at DESC 
                LIMIT 10
            ");
        }
        
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $bookings
        ]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create new booking
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Debug: Log the received data
        error_log("Received booking data: " . json_encode($input));
        
        // First, create or find customer
        $customerId = null;
        if (!empty($input['customer_phone'])) {
            // Check if customer exists
            $customerStmt = $pdo->prepare("SELECT id FROM customers WHERE phone = ?");
            $customerStmt->execute([$input['customer_phone']]);
            $existingCustomer = $customerStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($existingCustomer) {
                $customerId = $existingCustomer['id'];
                error_log("Found existing customer with ID: " . $customerId);
            } else {
                // Create new customer
                $createCustomerStmt = $pdo->prepare("
                    INSERT INTO customers (name, phone, email, created_at) 
                    VALUES (?, ?, ?, NOW())
                ");
                $createCustomerStmt->execute([
                    $input['customer_name'] ?? '',
                    $input['customer_phone'] ?? '',
                    $input['customer_email'] ?? ''
                ]);
                $customerId = $pdo->lastInsertId();
                error_log("Created new customer with ID: " . $customerId);
            }
        }
        
        // Check if user_id column exists in bookings table
        $userIdColumnExists = false;
        try {
            $checkStmt = $pdo->query("SHOW COLUMNS FROM bookings LIKE 'user_id'");
            $userIdColumnExists = $checkStmt->rowCount() > 0;
        } catch (Exception $e) {
            $userIdColumnExists = false;
        }
        
        // Build INSERT query - include user_id if column exists (set to NULL for frontend bookings)
        $columns = "
            service, from_location, to_location, travel_date, return_date,
            passengers, customer_id, 
            amount, total_amount, paid_amount, pending_amount, status, payment_status, notes,
            booking_date, train_number, train_name, class, departure_time, arrival_time, duration, fare_per_person,
            created_at
        ";
        $values = "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()";
        
        if ($userIdColumnExists) {
            $columns = "
                service, from_location, to_location, travel_date, return_date,
                passengers, customer_id, user_id,
                amount, total_amount, paid_amount, pending_amount, status, payment_status, notes,
                booking_date, train_number, train_name, class, departure_time, arrival_time, duration, fare_per_person,
                created_at
            ";
            $values = "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()";
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO bookings (
                $columns
            ) VALUES ($values)
        ");
        
        $params = [
            $input['service'] ?? '',
            $input['from'] ?? '',
            $input['to'] ?? '',
            $input['date'] ?? '',
            $input['return_date'] ?? null,
            $input['passengers'] ?? 1,
            $customerId, // customer_id (foreign key to customers table)
        ];
        
        // Add user_id as NULL for frontend bookings (they need admin approval)
        if ($userIdColumnExists) {
            $params[] = null; // user_id = NULL for frontend bookings
        }
        
        $params = array_merge($params, [
            $input['amount'] ?? 0,
            $input['total_amount'] ?? $input['amount'] ?? 0,
            $input['paid_amount'] ?? 0,
            $input['pending_amount'] ?? ($input['total_amount'] ?? $input['amount'] ?? 0),
            // Frontend bookings need admin approval - set status to 'pending_approval'
            'pending_approval',
            $input['payment_status'] ?? 'pending',
            $input['notes'] ?? '',
            $input['booking_date'] ?? $input['date'] ?? date('Y-m-d'),
            $input['train_number'] ?? null,
            $input['train_name'] ?? null,
            $input['class'] ?? null,
            $input['departure_time'] ?? null,
            $input['arrival_time'] ?? null,
            $input['duration'] ?? null,
            $input['fare_per_person'] ?? 0
        ]);
        
        $result = $stmt->execute($params);
        
        if ($result) {
            $bookingId = $pdo->lastInsertId();
            
            // Store passenger details in separate table
            if (!empty($input['passenger_details'])) {
                error_log("Processing passenger details: " . json_encode($input['passenger_details']));
                $passengerStmt = $pdo->prepare("
                    INSERT INTO passenger_details (booking_id, name, age, gender) 
                    VALUES (?, ?, ?, ?)
                ");
                
                foreach ($input['passenger_details'] as $passenger) {
                    error_log("Inserting passenger: " . json_encode($passenger));
                    $passengerStmt->execute([
                        $bookingId,
                        $passenger['name'] ?? '',
                        $passenger['age'] ?? 0,
                        $passenger['gender'] ?? ''
                    ]);
                }
            } else {
                error_log("No passenger details received");
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Booking submitted successfully! We will contact you soon.',
                'booking_id' => $bookingId
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to submit booking. Please try again.'
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