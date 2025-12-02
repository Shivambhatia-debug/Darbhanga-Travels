<?php
// Test script to check customer bookings with pending_approval status
require_once __DIR__ . '/config/database.php';

try {
    $pdo = getDatabaseConnection();
    
    echo "=== Testing Customer Bookings Query ===\n\n";
    
    // Check all bookings
    $allBookingsStmt = $pdo->query("SELECT id, status, user_id, customer_id, from_location, to_location, created_at FROM bookings ORDER BY created_at DESC LIMIT 10");
    $allBookings = $allBookingsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Total bookings (last 10):\n";
    print_r($allBookings);
    echo "\n";
    
    // Check pending_approval bookings
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
    
    echo "Pending approval bookings (customer bookings):\n";
    if (empty($bookings)) {
        echo "No bookings found with status 'pending_approval' and user_id NULL/0\n\n";
        
        // Check what statuses exist
        $statusStmt = $pdo->query("SELECT DISTINCT status FROM bookings");
        $statuses = $statusStmt->fetchAll(PDO::FETCH_COLUMN);
        echo "Available statuses in database:\n";
        print_r($statuses);
        echo "\n";
        
        // Check bookings with user_id
        $userBookingsStmt = $pdo->query("SELECT id, status, user_id, customer_id FROM bookings WHERE user_id IS NOT NULL LIMIT 5");
        $userBookings = $userBookingsStmt->fetchAll(PDO::FETCH_ASSOC);
        echo "Bookings with user_id:\n";
        print_r($userBookings);
    } else {
        echo "Found " . count($bookings) . " bookings:\n";
        print_r($bookings);
        
        // Get passenger details for first booking
        if (!empty($bookings)) {
            $bookingId = $bookings[0]['id'];
            $passengerStmt = $pdo->prepare("SELECT id, name, age, gender FROM passenger_details WHERE booking_id = ?");
            $passengerStmt->execute([$bookingId]);
            $passengers = $passengerStmt->fetchAll(PDO::FETCH_ASSOC);
            echo "\nPassenger details for booking ID {$bookingId}:\n";
            print_r($passengers);
        }
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}

