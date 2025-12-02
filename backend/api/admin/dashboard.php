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
require_once __DIR__ . '/../../config/database.php';

try {
    $pdo = getDatabaseConnection();
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get dashboard statistics
        $stats = [];
        
        // Total bookings
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM bookings");
        $stats['total_bookings'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Pending bookings
        $stmt = $pdo->query("SELECT COUNT(*) as pending FROM bookings WHERE status = 'pending'");
        $stats['pending_bookings'] = $stmt->fetch(PDO::FETCH_ASSOC)['pending'];
        
        // Completed bookings
        $stmt = $pdo->query("SELECT COUNT(*) as completed FROM bookings WHERE status = 'completed'");
        $stats['completed_bookings'] = $stmt->fetch(PDO::FETCH_ASSOC)['completed'];
        
        // Total customers - count from customers table
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM customers");
        $stats['total_customers'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Total users - count from users table
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM users");
        $stats['total_users'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Total revenue - try both amount and paid_amount columns
        $stmt = $pdo->query("SELECT SUM(COALESCE(amount, paid_amount, 0)) as total FROM bookings WHERE COALESCE(amount, paid_amount, 0) > 0");
        $revenue = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        $stats['total_revenue'] = $revenue ? (float)$revenue : 0;
        
        // Status-wise counts - Get all statuses from database and map them
        $statusCounts = [
            'new_booking' => 0,
            'ticket_booked' => 0,
            'not_booked' => 0,
            'cancelled' => 0,
            'refund_amount' => 0,
            'pending_booking' => 0,
            'ticket_delivery_paid_amount' => 0,
            'ticket_delivery_duse_amount' => 0,
            'pending_amount_by_customer' => 0
        ];
        
        // Get all unique statuses and their counts from database
        $stmt = $pdo->query("SELECT status, COUNT(*) as count FROM bookings GROUP BY status");
        $allStatuses = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Map old statuses to new ones
        $statusMapping = [
            'pending' => 'pending_booking',
            'confirmed' => 'ticket_booked',
            'completed' => 'ticket_booked',
            'cancelled' => 'cancelled',
            'new_booking' => 'new_booking',
            'ticket_booked' => 'ticket_booked',
            'not_booked' => 'not_booked',
            'refund_amount' => 'refund_amount',
            'pending_booking' => 'pending_booking',
            'ticket_delivery_paid_amount' => 'ticket_delivery_paid_amount',
            'ticket_delivery_duse_amount' => 'ticket_delivery_duse_amount',
            'pending_amount_by_customer' => 'pending_amount_by_customer'
        ];
        
        foreach ($allStatuses as $row) {
            $oldStatus = strtolower(trim($row['status']));
            $count = (int)$row['count'];
            
            // Map to new status if mapping exists, otherwise use as is
            $newStatus = $statusMapping[$oldStatus] ?? $oldStatus;
            
            // If it's a new status format, use it directly
            if (isset($statusCounts[$newStatus])) {
                $statusCounts[$newStatus] += $count;
            } elseif (isset($statusCounts[$oldStatus])) {
                $statusCounts[$oldStatus] += $count;
            } else {
                // If status doesn't match any known status, add to pending_booking
                $statusCounts['pending_booking'] += $count;
            }
        }
        
        // Recent bookings
        $stmt = $pdo->query("SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5");
        $recent_bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'status_counts' => $statusCounts,
                'recent_bookings' => $recent_bookings
            ]
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