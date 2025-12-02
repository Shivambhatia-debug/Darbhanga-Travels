<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Database connection - auto-detects localhost vs production
require_once __DIR__ . '/../../config/database.php';

try {
    $pdo = getDatabaseConnection();
    
    // Get authorization token
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authorization required']);
        exit();
    }
    
    $token = str_replace('Bearer ', '', $authHeader);
    $tokenData = json_decode(base64_decode($token), true);
    
    // Determine if it's a user or admin token
    $userId = null;
    $adminId = null;
    $isAdmin = false;
    
    if ($tokenData) {
        if (isset($tokenData['user_id'])) {
            $userId = $tokenData['user_id'];
        } elseif (isset($tokenData['admin_id'])) {
            $adminId = $tokenData['admin_id'];
            $isAdmin = true;
        }
    }
    
    if (!$userId && !$adminId) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid token']);
        exit();
    }
    
    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['current_password']) || !isset($input['new_password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Current password and new password are required']);
        exit();
    }
    
    $currentPassword = $input['current_password'];
    $newPassword = $input['new_password'];
    
    if (strlen($newPassword) < 6) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'New password must be at least 6 characters long']);
        exit();
    }
    
    // Get user/admin from database
    if ($isAdmin) {
        $stmt = $pdo->prepare("SELECT id, username, password FROM admins WHERE id = ?");
        $stmt->execute([$adminId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $targetId = $adminId;
    } else {
        $stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $targetId = $userId;
    }
    
    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit();
    }
    
    // Verify current password
    if (!password_verify($currentPassword, $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
        exit();
    }
    
    // Hash new password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // Update password
    if ($isAdmin) {
        $stmt = $pdo->prepare("UPDATE admins SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
    } else {
        $stmt = $pdo->prepare("UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
    }
    $result = $stmt->execute([$hashedPassword, $targetId]);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Password changed successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update password']);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>

