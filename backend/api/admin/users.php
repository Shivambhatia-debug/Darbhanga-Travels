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
        // Check if requesting a single user by ID
        $userId = $_GET['id'] ?? null;
        
        if ($userId) {
            // Get single user with password (for admin view)
            // First get user basic info with password
            $userStmt = $pdo->prepare("
                SELECT 
                    id,
                    username,
                    password,
                    full_name,
                    email,
                    phone,
                    created_at,
                    is_active
                FROM users
                WHERE id = ?
            ");
            $userStmt->execute([$userId]);
            $user = $userStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                // Get booking statistics separately
                $statsStmt = $pdo->prepare("
                    SELECT 
                        COUNT(id) as total_bookings,
                        COALESCE(SUM(total_amount), 0) as total_spent
                    FROM bookings
                    WHERE user_id = ?
                ");
                $statsStmt->execute([$userId]);
                $stats = $statsStmt->fetch(PDO::FETCH_ASSOC);
                
                // Merge user data with stats
                $user['total_bookings'] = $stats['total_bookings'] ?? 0;
                $user['total_spent'] = $stats['total_spent'] ?? 0;
                
                // Ensure password is included (even if NULL)
                if (!isset($user['password'])) {
                    $user['password'] = null;
                }
                
                echo json_encode([
                    'success' => true,
                    'user' => $user
                ]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'User not found']);
            }
        } else {
            // Get all users
            $stmt = $pdo->query("
                SELECT 
                    u.id,
                    u.username,
                    u.full_name,
                    u.email,
                    u.phone,
                    u.created_at,
                    u.is_active,
                    COUNT(b.id) as total_bookings,
                    COALESCE(SUM(b.total_amount), 0) as total_spent
                FROM users u
                LEFT JOIN bookings b ON u.id = b.user_id
                GROUP BY 
                    u.id,
                    u.username,
                    u.full_name,
                    u.email,
                    u.phone,
                    u.created_at,
                    u.is_active
                ORDER BY u.created_at DESC
            ");
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'users' => $users
            ]);
        }
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create new user
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['username']) || !isset($input['password']) || !isset($input['full_name'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Username, password, and full name are required']);
            exit();
        }
        
        // Check if username already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$input['username']]);
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Username already exists']);
            exit();
        }
        
        // Hash password
        $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
        
        // Insert user
        $stmt = $pdo->prepare("
            INSERT INTO users (username, password, full_name, email, phone, created_at) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        
        $result = $stmt->execute([
            $input['username'],
            $hashedPassword,
            $input['full_name'],
            $input['email'] ?? null,
            $input['phone'] ?? null
        ]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'User created successfully',
                'id' => $pdo->lastInsertId()
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create user']);
        }
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Update user
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'User ID is required']);
            exit();
        }
        
        $updates = [];
        $params = [];
        
        if (isset($input['full_name'])) {
            $updates[] = "full_name = ?";
            $params[] = $input['full_name'];
        }
        if (isset($input['email'])) {
            $updates[] = "email = ?";
            $params[] = $input['email'];
        }
        if (isset($input['phone'])) {
            $updates[] = "phone = ?";
            $params[] = $input['phone'];
        }
        if (isset($input['password']) && !empty($input['password'])) {
            $updates[] = "password = ?";
            $params[] = password_hash($input['password'], PASSWORD_DEFAULT);
        }
        
        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No fields to update']);
            exit();
        }
        
        $params[] = $input['id'];
        $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
        
        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute($params);
        
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'User updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update user']);
        }
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        // Delete user
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'User ID is required']);
            exit();
        }
        
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $result = $stmt->execute([$input['id']]);
        
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to delete user']);
        }
        
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}


