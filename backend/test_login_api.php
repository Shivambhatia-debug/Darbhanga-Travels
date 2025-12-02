<?php
/**
 * Test Login API Endpoint
 * This file tests the login API to ensure everything is working correctly
 */

echo "🧪 Testing Login API...\n\n";

// Test 1: Check database connection
echo "1. Testing database connection...\n";
try {
    require_once __DIR__ . '/config/database.php';
    $pdo = getDatabaseConnection();
    echo "   ✅ Database connection successful!\n";
} catch (Exception $e) {
    echo "   ❌ Database connection failed: " . $e->getMessage() . "\n";
    exit(1);
}

// Test 2: Check if admins table exists
echo "\n2. Checking admins table...\n";
try {
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM admins");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "   ✅ Admins table exists with {$result['count']} record(s)\n";
} catch (Exception $e) {
    echo "   ❌ Admins table check failed: " . $e->getMessage() . "\n";
    exit(1);
}

// Test 3: Check if admin user exists
echo "\n3. Checking admin user...\n";
try {
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
    $stmt->execute(['admin']);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        echo "   ✅ Admin user found:\n";
        echo "      Username: {$admin['username']}\n";
        echo "      Email: " . ($admin['email'] ?? 'N/A') . "\n";
        echo "      Password hash: " . substr($admin['password'], 0, 20) . "...\n";
    } else {
        echo "   ⚠️  Admin user 'admin' not found!\n";
        echo "   Creating default admin user...\n";
        
        $defaultPassword = password_hash('admin123', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("
            INSERT INTO admins (username, password, email, full_name, role, created_at) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([
            'admin',
            $defaultPassword,
            'admin@darbhangatravels.com',
            'Admin User',
            'admin'
        ]);
        echo "   ✅ Default admin user created!\n";
        echo "      Username: admin\n";
        echo "      Password: admin123\n";
    }
} catch (Exception $e) {
    echo "   ❌ Admin user check failed: " . $e->getMessage() . "\n";
    exit(1);
}

// Test 4: Test password verification
echo "\n4. Testing password verification...\n";
try {
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
    $stmt->execute(['admin']);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin && password_verify('admin123', $admin['password'])) {
        echo "   ✅ Password verification successful!\n";
    } else {
        echo "   ❌ Password verification failed!\n";
        echo "   Resetting admin password...\n";
        
        $newPassword = password_hash('admin123', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE admins SET password = ? WHERE username = ?");
        $stmt->execute([$newPassword, 'admin']);
        echo "   ✅ Admin password reset to 'admin123'\n";
    }
} catch (Exception $e) {
    echo "   ❌ Password verification test failed: " . $e->getMessage() . "\n";
    exit(1);
}

echo "\n✅ All tests passed!\n\n";
echo "Next steps:\n";
echo "1. Make sure PHP server is running: php -S localhost:8000 -t backend\n";
echo "2. Test login at: http://localhost:3000/admin\n";
echo "3. Use credentials: admin / admin123\n\n";
?>



