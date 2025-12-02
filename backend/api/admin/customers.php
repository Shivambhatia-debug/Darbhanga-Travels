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
        // Get all customers from the customers table with booking stats
        $stmt = $pdo->query("
            SELECT 
                c.id,
                c.name,
                c.phone,
                c.email,
                c.address,
                c.created_at,
                COUNT(b.id) as total_bookings,
                COALESCE(SUM(b.paid_amount), 0) as total_spent
            FROM customers c
            LEFT JOIN bookings b ON c.id = b.customer_id
            GROUP BY c.id, c.name, c.phone, c.email, c.address, c.created_at
            ORDER BY c.created_at DESC
        ");
        $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $customers
        ]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create new customer
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Check if customer already exists by phone
        $stmt = $pdo->prepare("SELECT id FROM customers WHERE phone = ?");
        $stmt->execute([$input['phone'] ?? '']);
        $existingCustomer = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($existingCustomer) {
            echo json_encode([
                'success' => false,
                'message' => 'Customer with this phone number already exists'
            ]);
            exit;
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO customers (name, phone, email, address, created_at) 
            VALUES (?, ?, ?, ?, NOW())
        ");
        
        $result = $stmt->execute([
            $input['name'] ?? '',
            $input['phone'] ?? '',
            $input['email'] ?? '',
            $input['address'] ?? ''
        ]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Customer created successfully',
                'id' => $pdo->lastInsertId()
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to create customer'
            ]);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Update customer
        $input = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $pdo->prepare("
            UPDATE customers 
            SET name = ?, phone = ?, email = ?, address = ?
            WHERE id = ?
        ");
        
        $result = $stmt->execute([
            $input['name'] ?? '',
            $input['phone'] ?? '',
            $input['email'] ?? '',
            $input['address'] ?? '',
            $input['id']
        ]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Customer updated successfully'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to update customer'
            ]);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        // Delete customer
        $input = json_decode(file_get_contents('php://input'), true);
        $customerId = $input['id'] ?? $_GET['id'] ?? null;
        
        if (!$customerId) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Customer ID is required'
            ]);
            exit;
        }
        
        $stmt = $pdo->prepare("DELETE FROM customers WHERE id = ?");
        $result = $stmt->execute([$customerId]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Customer deleted successfully'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to delete customer'
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
