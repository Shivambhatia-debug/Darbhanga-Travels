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
        
        // Total customers - using customer_id instead of customer_phone
        $stmt = $pdo->query("SELECT COUNT(DISTINCT customer_id) as total FROM bookings WHERE customer_id IS NOT NULL");
        $stats['total_customers'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Total revenue from paid amounts
        $stmt = $pdo->query("SELECT SUM(paid_amount) as total FROM bookings WHERE paid_amount > 0");
        $revenue = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        $stats['total_revenue'] = $revenue ? (float)$revenue : 0;
        
        // Recent bookings
        $stmt = $pdo->query("SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5");
        $recent_bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => [
                'stats' => $stats,
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