<?php
// Suppress any warnings/notices that might interfere with JSON output
error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
require_once __DIR__ . '/../../config/database.php';

try {
    $pdo = getDatabaseConnection();
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get all pending customer bookings (status = 'pending_approval')
        // These are bookings created from frontend by customers, need admin approval
        $query = "
            SELECT 
                b.*,
                c.name as customer_name,
                c.phone as customer_phone,
                c.email as customer_email
            FROM bookings b
            LEFT JOIN customers c ON b.customer_id = c.id
            WHERE b.status = 'pending_approval'
                AND (b.user_id IS NULL OR b.user_id = 0)
            ORDER BY b.created_at DESC
        ";
        
        $stmt = $pdo->query($query);
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Fetch passenger details for each booking from passenger_details table
        foreach ($bookings as &$booking) {
            // Get passenger details from passenger_details table
            $passengerStmt = $pdo->prepare("
                SELECT id, name, age, gender 
                FROM passenger_details 
                WHERE booking_id = ?
                ORDER BY id ASC
            ");
            $passengerStmt->execute([$booking['id']]);
            $passengerDetails = $passengerStmt->fetchAll(PDO::FETCH_ASSOC);
            $booking['passenger_details'] = $passengerDetails;
            
            // Also check if passenger_details JSON column exists in bookings table
            if (isset($booking['passenger_details_json']) && !empty($booking['passenger_details_json'])) {
                $jsonPassengers = json_decode($booking['passenger_details_json'], true);
                if (is_array($jsonPassengers) && !empty($jsonPassengers)) {
                    // Merge with passenger_details from table
                    $booking['passenger_details'] = array_merge($booking['passenger_details'], $jsonPassengers);
                }
            }
        }
        
        echo json_encode([
            'success' => true,
            'data' => $bookings
        ]);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Accept or Reject booking
        $input = json_decode(file_get_contents('php://input'), true);
        $bookingId = $input['id'] ?? null;
        $action = $input['action'] ?? null; // 'accept' or 'reject'
        
        if (!$bookingId || !$action) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Booking ID and action are required'
            ]);
            exit;
        }
        
        if ($action === 'accept') {
            // Accept booking - change status to 'new_booking' so it shows in main bookings
            $stmt = $pdo->prepare("
                UPDATE bookings 
                SET status = 'new_booking', updated_at = NOW()
                WHERE id = ?
            ");
            
            $result = $stmt->execute([$bookingId]);
            
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Booking accepted successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to accept booking'
                ]);
            }
        } elseif ($action === 'reject') {
            // Reject booking - change status to 'cancelled'
            $stmt = $pdo->prepare("
                UPDATE bookings 
                SET status = 'cancelled', updated_at = NOW()
                WHERE id = ?
            ");
            
            $result = $stmt->execute([$bookingId]);
            
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Booking rejected successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to reject booking'
                ]);
            }
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid action. Use "accept" or "reject"'
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
    error_log("Customer Bookings API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

