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

// Database connection - auto-detects localhost vs production
try {
    require_once __DIR__ . '/../../config/database.php';
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database configuration error: ' . $e->getMessage()
    ]);
    exit();
}

try {
    $pdo = getDatabaseConnection();
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get all bookings with customer details
        $user_id = $_GET['user_id'] ?? null;
        
        // Check if user_id column exists in bookings table
        $userIdColumnExists = false;
        try {
            $checkStmt = $pdo->query("SHOW COLUMNS FROM bookings LIKE 'user_id'");
            $userIdColumnExists = $checkStmt->rowCount() > 0;
        } catch (Exception $e) {
            // user_id column doesn't exist
            $userIdColumnExists = false;
        }
        
        // Check if bookings table has customer_name column
        $customerNameColumnExists = false;
        try {
            $checkStmt = $pdo->query("SHOW COLUMNS FROM bookings LIKE 'customer_name'");
            $customerNameColumnExists = $checkStmt->rowCount() > 0;
        } catch (Exception $e) {
            $customerNameColumnExists = false;
        }
        
        // Check if users table exists
        $usersTableExists = false;
        try {
            $checkStmt = $pdo->query("SHOW TABLES LIKE 'users'");
            $usersTableExists = $checkStmt->rowCount() > 0;
        } catch (Exception $e) {
            $usersTableExists = false;
        }
        
        // Check if admins table has full_name column
        $adminFullNameExists = false;
        try {
            $checkStmt = $pdo->query("SHOW COLUMNS FROM admins LIKE 'full_name'");
            $adminFullNameExists = $checkStmt->rowCount() > 0;
        } catch (Exception $e) {
            $adminFullNameExists = false;
        }
        
        // Build query with user information join if user_id column exists
        if ($userIdColumnExists) {
            // Join both users and admins tables, prioritize users table
            if ($usersTableExists) {
                // Users table exists - join with both users and admins, prioritize users
                if ($customerNameColumnExists) {
                    $query = "
                        SELECT 
                            b.*,
                            COALESCE(b.customer_name, c.name) as customer_name,
                            COALESCE(b.customer_phone, c.phone) as customer_phone,
                            COALESCE(b.customer_email, c.email) as customer_email,
                            CASE 
                                WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                WHEN a.id IS NOT NULL THEN 'Admin'
                                ELSE COALESCE(u.username, a.username)
                            END as user_username,
                            CASE 
                                WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                WHEN a.id IS NOT NULL THEN 'Admin'
                                ELSE COALESCE(u.full_name, u.username, a.username)
                            END as user_full_name,
                            CASE 
                                WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                ELSE COALESCE(u.email, a.email)
                            END as user_email
                        FROM bookings b
                        LEFT JOIN customers c ON b.customer_id = c.id
                        LEFT JOIN users u ON b.user_id = u.id AND b.user_id IS NOT NULL AND b.user_id > 0
                        LEFT JOIN admins a ON b.user_id = a.id AND b.user_id IS NOT NULL AND b.user_id > 0
                    ";
                } else {
                    $query = "
                        SELECT 
                            b.*,
                            c.name as customer_name,
                            c.phone as customer_phone,
                            c.email as customer_email,
                            CASE 
                                WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                WHEN a.id IS NOT NULL THEN 'Admin'
                                ELSE COALESCE(u.username, a.username)
                            END as user_username,
                            CASE 
                                WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                WHEN a.id IS NOT NULL THEN 'Admin'
                                ELSE COALESCE(u.full_name, u.username, a.username)
                            END as user_full_name,
                            CASE 
                                WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                ELSE COALESCE(u.email, a.email)
                            END as user_email
                        FROM bookings b
                        LEFT JOIN customers c ON b.customer_id = c.id
                        LEFT JOIN users u ON b.user_id = u.id AND b.user_id IS NOT NULL AND b.user_id > 0
                        LEFT JOIN admins a ON b.user_id = a.id AND b.user_id IS NOT NULL AND b.user_id > 0
                    ";
                }
            } else {
                // Only admins table exists
                if ($adminFullNameExists) {
                    if ($customerNameColumnExists) {
                        $query = "
                            SELECT 
                                b.*,
                                COALESCE(b.customer_name, c.name) as customer_name,
                                COALESCE(b.customer_phone, c.phone) as customer_phone,
                                COALESCE(b.customer_email, c.email) as customer_email,
                                CASE 
                                    WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                    WHEN a.id IS NOT NULL THEN 'Admin'
                                    ELSE a.username
                                END as user_username,
                                CASE 
                                    WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                    WHEN a.id IS NOT NULL THEN 'Admin'
                                    ELSE COALESCE(a.full_name, a.username)
                                END as user_full_name,
                                CASE 
                                    WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                    ELSE a.email
                                END as user_email
                            FROM bookings b
                            LEFT JOIN customers c ON b.customer_id = c.id
                            LEFT JOIN admins a ON b.user_id = a.id AND b.user_id IS NOT NULL AND b.user_id > 0
                        ";
                    } else {
                        $query = "
                            SELECT 
                                b.*,
                                c.name as customer_name,
                                c.phone as customer_phone,
                                c.email as customer_email,
                                CASE 
                                    WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                    WHEN a.id IS NOT NULL THEN 'Admin'
                                    ELSE a.username
                                END as user_username,
                                CASE 
                                    WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                    WHEN a.id IS NOT NULL THEN 'Admin'
                                    ELSE COALESCE(a.full_name, a.username)
                                END as user_full_name,
                                CASE 
                                    WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                    ELSE a.email
                                END as user_email
                            FROM bookings b
                            LEFT JOIN customers c ON b.customer_id = c.id
                            LEFT JOIN admins a ON b.user_id = a.id AND b.user_id IS NOT NULL AND b.user_id > 0
                        ";
                    }
                } else {
                    if ($customerNameColumnExists) {
                        $query = "
                            SELECT 
                                b.*,
                                COALESCE(b.customer_name, c.name) as customer_name,
                                COALESCE(b.customer_phone, c.phone) as customer_phone,
                                COALESCE(b.customer_email, c.email) as customer_email,
                                CASE 
                                    WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                    ELSE a.username
                                END as user_username,
                                CASE 
                                    WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                    ELSE a.username
                                END as user_full_name,
                                CASE 
                                    WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                    ELSE a.email
                                END as user_email
                            FROM bookings b
                            LEFT JOIN customers c ON b.customer_id = c.id
                            LEFT JOIN admins a ON b.user_id = a.id AND b.user_id IS NOT NULL AND b.user_id > 0
                        ";
                    } else {
                        $query = "
                            SELECT 
                                b.*,
                                c.name as customer_name,
                                c.phone as customer_phone,
                                c.email as customer_email,
                                CASE 
                                    WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                    ELSE a.username
                                END as user_username,
                                CASE 
                                    WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                    ELSE a.username
                                END as user_full_name,
                                CASE 
                                    WHEN b.user_id IS NULL OR b.user_id = 0 THEN NULL
                                    ELSE a.email
                                END as user_email
                            FROM bookings b
                            LEFT JOIN customers c ON b.customer_id = c.id
                            LEFT JOIN admins a ON b.user_id = a.id AND b.user_id IS NOT NULL AND b.user_id > 0
                        ";
                    }
                }
            }
        } else {
            // Query without user join
            if ($customerNameColumnExists) {
                $query = "
                    SELECT 
                        b.*,
                        COALESCE(b.customer_name, c.name) as customer_name,
                        COALESCE(b.customer_phone, c.phone) as customer_phone,
                        COALESCE(b.customer_email, c.email) as customer_email
                    FROM bookings b
                    LEFT JOIN customers c ON b.customer_id = c.id
                ";
            } else {
                $query = "
                    SELECT 
                        b.*,
                        c.name as customer_name,
                        c.phone as customer_phone,
                        c.email as customer_email
                    FROM bookings b
                    LEFT JOIN customers c ON b.customer_id = c.id
                ";
            }
        }
        
        $params = [];
        $whereConditions = [];
        
        // Exclude pending_approval bookings from main bookings page
        // These should only show in Customer Bookings page
        $whereConditions[] = "b.status != 'pending_approval'";
        
        // Filter by user_id if provided and column exists
        if ($user_id && $userIdColumnExists) {
            $whereConditions[] = "b.user_id = ?";
            $params[] = $user_id;
        }
        
        // Add WHERE clause if we have conditions
        if (!empty($whereConditions)) {
            $query .= " WHERE " . implode(" AND ", $whereConditions);
        }
        
        $query .= " ORDER BY b.created_at DESC";
        
        try {
            if (!empty($params)) {
                $stmt = $pdo->prepare($query);
                $stmt->execute($params);
            } else {
                $stmt = $pdo->query($query);
            }
            
            $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // If query fails, try simpler version without complex joins
            error_log("Query failed, trying simpler version: " . $e->getMessage());
            try {
                // Try simple query with customer and user joins (exclude pending_approval)
                if ($usersTableExists && $userIdColumnExists) {
                    $query = "
                        SELECT 
                            b.*,
                            c.name as customer_name,
                            c.phone as customer_phone,
                            c.email as customer_email,
                            COALESCE(u.full_name, u.username) as user_full_name,
                            u.username as user_username,
                            u.email as user_email
                        FROM bookings b
                        LEFT JOIN customers c ON b.customer_id = c.id
                        LEFT JOIN users u ON b.user_id = u.id
                        WHERE b.status != 'pending_approval'
                        ORDER BY b.created_at DESC
                    ";
                } else {
                    $query = "
                        SELECT 
                            b.*,
                            c.name as customer_name,
                            c.phone as customer_phone,
                            c.email as customer_email
                        FROM bookings b
                        LEFT JOIN customers c ON b.customer_id = c.id
                        WHERE b.status != 'pending_approval'
                        ORDER BY b.created_at DESC
                    ";
                }
                $stmt = $pdo->query($query);
                $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                // Ensure user fields exist and set default for admin bookings
                foreach ($bookings as &$booking) {
                    if (!isset($booking['user_username'])) {
                        $booking['user_username'] = null;
                    }
                    if (!isset($booking['user_full_name'])) {
                        $booking['user_full_name'] = null;
                    }
                    if (!isset($booking['user_email'])) {
                        $booking['user_email'] = null;
                    }
                    
                    // Check if user_id belongs to admin - prioritize admin check
                    if (isset($booking['user_id']) && $booking['user_id'] > 0) {
                        try {
                            $adminCheckStmt = $pdo->prepare("SELECT id FROM admins WHERE id = ?");
                            $adminCheckStmt->execute([$booking['user_id']]);
                            if ($adminCheckStmt->fetch(PDO::FETCH_ASSOC)) {
                                // Force "Admin" if user_id matches admin
                                $booking['user_full_name'] = 'Admin';
                                $booking['user_username'] = 'Admin';
                            } else if (empty($booking['user_username']) && empty($booking['user_full_name'])) {
                                $booking['user_full_name'] = 'Admin';
                            }
                        } catch (Exception $e) {
                            if (empty($booking['user_username']) && empty($booking['user_full_name'])) {
                                $booking['user_full_name'] = 'Admin';
                            }
                        }
                    }
                }
            } catch (PDOException $e2) {
                // Last resort: get bookings without any joins (but exclude pending_approval)
                error_log("Simple query also failed: " . $e2->getMessage());
                $query = "SELECT * FROM bookings WHERE status != 'pending_approval' ORDER BY created_at DESC";
                $stmt = $pdo->query($query);
                $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                // Add empty fields and set Admin for bookings with user_id
                foreach ($bookings as &$booking) {
                    $booking['customer_name'] = '';
                    $booking['customer_phone'] = '';
                    $booking['customer_email'] = '';
                    $booking['user_username'] = null;
                    $booking['user_full_name'] = null;
                    $booking['user_email'] = null;
                    
                    // If user_id exists, default to 'Admin'
                    if (isset($booking['user_id']) && $booking['user_id'] > 0) {
                        $booking['user_full_name'] = 'Admin';
                    }
                }
            }
        }
        
        // Ensure user fields exist even if join didn't return them
        foreach ($bookings as &$booking) {
            if (!isset($booking['user_username'])) {
                $booking['user_username'] = null;
            }
            if (!isset($booking['user_full_name'])) {
                $booking['user_full_name'] = null;
            }
            if (!isset($booking['user_email'])) {
                $booking['user_email'] = null;
            }
            
            // IMPORTANT: For customer bookings (user_id is NULL or 0), clear user fields
            // This ensures frontend shows "Customer" or customer name instead of user names
            $userId = $booking['user_id'] ?? null;
            // Convert to int for proper comparison
            $userIdInt = is_numeric($userId) ? intval($userId) : 0;
            
            if ($userIdInt === 0 || $userId === null || $userId === '' || $userId === '0') {
                // This is a customer booking from frontend - FORCE clear user fields to show "Customer"
                $booking['user_full_name'] = null;
                $booking['user_username'] = null;
                $booking['user_email'] = null;
                // Also ensure user_id is explicitly set to null/0 for consistency
                $booking['user_id'] = null;
            } else if ($userIdInt > 0) {
                // Check if user_id belongs to an admin FIRST - prioritize admin over user
                // This ensures admin panel bookings always show "Admin" even if user_id matches users table
                try {
                    $adminCheckStmt = $pdo->prepare("SELECT id FROM admins WHERE id = ?");
                    $adminCheckStmt->execute([$userIdInt]);
                    $adminExists = $adminCheckStmt->fetch(PDO::FETCH_ASSOC);
                    
                    if ($adminExists) {
                        // This is an admin booking - ALWAYS show "Admin" (override any user name)
                        $booking['user_full_name'] = 'Admin';
                        $booking['user_username'] = 'Admin';
                    } else if (empty($booking['user_username']) && empty($booking['user_full_name'])) {
                        // No user/admin found - default to "Admin" for admin panel bookings
                        $booking['user_full_name'] = 'Admin';
                    }
                } catch (Exception $e) {
                    // If check fails, default to Admin if no user details
                    if (empty($booking['user_username']) && empty($booking['user_full_name'])) {
                        $booking['user_full_name'] = 'Admin';
                    }
                }
            }
        }
        
        // Fetch passenger details for each booking
        foreach ($bookings as &$booking) {
            try {
                $passengerStmt = $pdo->prepare("SELECT * FROM passenger_details WHERE booking_id = ?");
                $passengerStmt->execute([$booking['id']]);
                $booking['passenger_details'] = $passengerStmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (Exception $e) {
                // Passenger details table might not exist or query failed
                $booking['passenger_details'] = [];
            }
        }
        
        echo json_encode([
            'success' => true,
            'data' => $bookings,
            'count' => count($bookings)
        ]);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create new booking (admin can create bookings)
        $input = json_decode(file_get_contents('php://input'), true);
        
        // First, create or find customer
        $customerId = null;
        if (!empty($input['customer_phone'])) {
            $customerStmt = $pdo->prepare("SELECT id FROM customers WHERE phone = ?");
            $customerStmt->execute([$input['customer_phone']]);
            $existingCustomer = $customerStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($existingCustomer) {
                $customerId = $existingCustomer['id'];
            } else {
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
            }
        }
        
        // Check if user_id column exists and get user_id from input or token
        $userIdColumnExists = false;
        $userId = null;
        try {
            $checkStmt = $pdo->query("SHOW COLUMNS FROM bookings LIKE 'user_id'");
            $userIdColumnExists = $checkStmt->rowCount() > 0;
            
            // Get user_id from input (if sent from frontend)
            if (isset($input['user_id']) && !empty($input['user_id'])) {
                $userId = intval($input['user_id']);
            } else {
                // Try to get from token (if admin is creating)
                try {
                    $headers = getallheaders();
                    $authHeader = $headers['Authorization'] ?? '';
                    if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
                        $token = substr($authHeader, 7);
                        $payload = json_decode(base64_decode($token), true);
                        if ($payload && isset($payload['admin_id'])) {
                            $userId = $payload['admin_id'];
                        }
                    }
                } catch (Exception $e) {
                    // Ignore token parsing errors
                }
            }
        } catch (Exception $e) {
            $userIdColumnExists = false;
        }
        
        // Build INSERT query with or without user_id
        if ($userIdColumnExists) {
            $stmt = $pdo->prepare("
                INSERT INTO bookings (
                    service, from_location, to_location, travel_date, return_date,
                    passengers, customer_id, user_id,
                    amount, total_amount, paid_amount, pending_amount, status, payment_status, notes,
                    booking_date, train_number, train_name, class, departure_time, arrival_time, duration, fare_per_person,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            
            $result = $stmt->execute([
                $input['service'] ?? '',
                $input['from'] ?? $input['from_location'] ?? '',
                $input['to'] ?? $input['to_location'] ?? '',
                $input['date'] ?? $input['travel_date'] ?? '',
                $input['return_date'] ?? null,
                $input['passengers'] ?? 1,
                $customerId,
                $userId, // user_id
                $input['amount'] ?? 0,
                $input['total_amount'] ?? $input['amount'] ?? 0,
                $input['paid_amount'] ?? 0,
                $input['pending_amount'] ?? ($input['total_amount'] ?? $input['amount'] ?? 0),
                $input['status'] ?? 'pending',
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
        } else {
            $stmt = $pdo->prepare("
                INSERT INTO bookings (
                    service, from_location, to_location, travel_date, return_date,
                    passengers, customer_id, 
                    amount, total_amount, paid_amount, pending_amount, status, payment_status, notes,
                    booking_date, train_number, train_name, class, departure_time, arrival_time, duration, fare_per_person,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            
            $result = $stmt->execute([
                $input['service'] ?? '',
                $input['from'] ?? $input['from_location'] ?? '',
                $input['to'] ?? $input['to_location'] ?? '',
                $input['date'] ?? $input['travel_date'] ?? '',
                $input['return_date'] ?? null,
                $input['passengers'] ?? 1,
                $customerId,
                $input['amount'] ?? 0,
                $input['total_amount'] ?? $input['amount'] ?? 0,
                $input['paid_amount'] ?? 0,
                $input['pending_amount'] ?? ($input['total_amount'] ?? $input['amount'] ?? 0),
                $input['status'] ?? 'pending',
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
        }
        
        if ($result) {
            $bookingId = $pdo->lastInsertId();
            
            // Store passenger details
            if (!empty($input['passenger_details'])) {
                $passengerStmt = $pdo->prepare("
                    INSERT INTO passenger_details (booking_id, name, age, gender) 
                    VALUES (?, ?, ?, ?)
                ");
                
                foreach ($input['passenger_details'] as $passenger) {
                    $passengerStmt->execute([
                        $bookingId,
                        $passenger['name'] ?? '',
                        $passenger['age'] ?? 0,
                        $passenger['gender'] ?? ''
                    ]);
                }
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Booking created successfully',
                'booking_id' => $bookingId
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to create booking'
            ]);
        }
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Update booking
        $input = json_decode(file_get_contents('php://input'), true);
        $bookingId = $input['id'] ?? $_GET['id'] ?? null;
        
        if (!$bookingId) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Booking ID is required'
            ]);
            exit();
        }
        
        $updateFields = [];
        $params = [];
        
        $allowedFields = [
            'status', 'payment_status', 'amount', 'total_amount', 
            'paid_amount', 'pending_amount', 'notes', 'travel_date',
            'return_date', 'passengers', 'from_location', 'to_location'
        ];
        
        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $updateFields[] = "$field = ?";
                $params[] = $input[$field];
            }
        }
        
        if (empty($updateFields)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'No fields to update'
            ]);
            exit();
        }
        
        $params[] = $bookingId;
        
        $query = "UPDATE bookings SET " . implode(', ', $updateFields) . " WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $result = $stmt->execute($params);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Booking updated successfully'
            ]);
        } else {
            http_response_code(500);
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
            exit();
        }
        
        $stmt = $pdo->prepare("DELETE FROM bookings WHERE id = ?");
        $result = $stmt->execute([$bookingId]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Booking deleted successfully'
            ]);
        } else {
            http_response_code(500);
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
    
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Database error in bookings.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    error_log("Server error in bookings.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>

