<?php
/**
 * Copy Login File Script
 * Upload this to public_html/api/copy_login.php
 */

header('Content-Type: text/html; charset=utf-8');

echo "<h2>📋 Copy Login File</h2>";

// Source file (login_test.php)
$source_file = __DIR__ . '/login_test.php';
$target_file = __DIR__ . '/admin/login.php';

echo "<p><strong>Source:</strong> $source_file</p>";
echo "<p><strong>Target:</strong> $target_file</p>";

if (file_exists($source_file)) {
    echo "<p>✅ Source file exists</p>";
    
    // Create admin directory if it doesn't exist
    $admin_dir = __DIR__ . '/admin';
    if (!is_dir($admin_dir)) {
        if (mkdir($admin_dir, 0755, true)) {
            echo "<p>✅ Created admin directory</p>";
        } else {
            echo "<p>❌ Failed to create admin directory</p>";
            exit();
        }
    } else {
        echo "<p>✅ Admin directory exists</p>";
    }
    
    // Copy the file
    if (copy($source_file, $target_file)) {
        echo "<p>✅ Successfully copied login file</p>";
        echo "<p>📄 Target file size: " . filesize($target_file) . " bytes</p>";
        
        // Test the copied file
        echo "<p><strong>Testing copied file:</strong></p>";
        echo "<p><a href='admin/login.php' target='_blank'>Test admin/login.php</a></p>";
        
    } else {
        echo "<p>❌ Failed to copy file</p>";
    }
} else {
    echo "<p>❌ Source file not found</p>";
}

echo "<h3>🔗 Next Steps:</h3>";
echo "<ol>";
echo "<li><a href='debug_api.php'>Run Debug Script</a></li>";
echo "<li><a href='../admin/'>Test Admin Login</a></li>";
echo "</ol>";
?>





















