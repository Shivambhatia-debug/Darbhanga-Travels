<?php
/**
 * Comprehensive API Debug Script
 * Upload this to public_html/api/debug_api.php
 */

header('Content-Type: text/html; charset=utf-8');

echo "<h2>🔍 Darbhanga Travels - API Debug</h2>";

// Test 1: Check if we can access the admin folder
echo "<h3>1. File Structure Check</h3>";
$admin_path = __DIR__ . '/admin';
if (is_dir($admin_path)) {
    echo "<p>✅ Admin folder exists at: $admin_path</p>";
    
    $login_file = $admin_path . '/login.php';
    if (file_exists($login_file)) {
        echo "<p>✅ login.php exists at: $login_file</p>";
        echo "<p>📄 File size: " . filesize($login_file) . " bytes</p>";
        echo "<p>📅 Last modified: " . date('Y-m-d H:i:s', filemtime($login_file)) . "</p>";
    } else {
        echo "<p>❌ login.php NOT found at: $login_file</p>";
    }
    
    // List all files in admin folder
    $files = scandir($admin_path);
    echo "<p><strong>Files in admin folder:</strong></p>";
    echo "<ul>";
    foreach ($files as $file) {
        if ($file != '.' && $file != '..') {
            echo "<li>$file</li>";
        }
    }
    echo "</ul>";
} else {
    echo "<p>❌ Admin folder NOT found at: $admin_path</p>";
}

// Test 2: Check current directory
echo "<h3>2. Current Directory Info</h3>";
echo "<p><strong>Current directory:</strong> " . __DIR__ . "</p>";
echo "<p><strong>Script name:</strong> " . $_SERVER['SCRIPT_NAME'] . "</p>";
echo "<p><strong>Request URI:</strong> " . $_SERVER['REQUEST_URI'] . "</p>";

// Test 3: Check .htaccess
echo "<h3>3. .htaccess Check</h3>";
$htaccess_file = __DIR__ . '/.htaccess';
if (file_exists($htaccess_file)) {
    echo "<p>✅ .htaccess file exists</p>";
    echo "<p>📄 File size: " . filesize($htaccess_file) . " bytes</p>";
    echo "<p><strong>Contents:</strong></p>";
    echo "<pre>" . htmlspecialchars(file_get_contents($htaccess_file)) . "</pre>";
} else {
    echo "<p>❌ .htaccess file NOT found</p>";
}

// Test 4: Test database connection
echo "<h3>4. Database Connection Test</h3>";
$host = 'localhost';
$dbname = 'u363779306_dbg_travels';
$username = 'u363779306_localhost';
$password = 'Shiva@8053';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<p>✅ Database connection successful</p>";
    
    // Check if admins table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'admins'");
    if ($stmt->rowCount() > 0) {
        echo "<p>✅ Admins table exists</p>";
        
        // Check admin user
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM admins WHERE username = 'admin'");
        $count = $stmt->fetch()['count'];
        echo "<p>👤 Admin user count: $count</p>";
    } else {
        echo "<p>❌ Admins table does not exist</p>";
    }
} catch (PDOException $e) {
    echo "<p>❌ Database error: " . $e->getMessage() . "</p>";
}

// Test 5: Test API endpoints
echo "<h3>5. API Endpoint Tests</h3>";
echo "<p><strong>Test these URLs:</strong></p>";
echo "<ul>";
echo "<li><a href='test_api.php' target='_blank'>test_api.php</a></li>";
echo "<li><a href='admin/login.php' target='_blank'>admin/login.php</a></li>";
echo "<li><a href='login_test.php' target='_blank'>login_test.php</a></li>";
echo "</ul>";

echo "<h3>6. Quick Fix</h3>";
echo "<p>If login.php is not working, try this:</p>";
echo "<ol>";
echo "<li>Copy the content from <a href='login_test.php' target='_blank'>login_test.php</a></li>";
echo "<li>Create a new file at <code>admin/login.php</code></li>";
echo "<li>Paste the content and save</li>";
echo "</ol>";

echo "<h3>7. Manual Test</h3>";
echo "<p>Test the login API manually:</p>";
echo "<form method='POST' action='admin/login.php'>";
echo "<input type='hidden' name='test' value='1'>";
echo "<button type='submit'>Test Login API</button>";
echo "</form>";
?>





















