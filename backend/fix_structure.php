<?php
/**
 * File Structure Fix Script
 * Run this to check and fix the file structure
 */

echo "<h2>🔧 Darbhanga Travels - File Structure Check</h2>";

// Check if we're in the right location
$current_dir = __DIR__;
echo "<p><strong>Current directory:</strong> $current_dir</p>";

// Check if admin folder exists
if (is_dir('admin')) {
    echo "<p>✅ Admin folder exists</p>";
    
    // List files in admin folder
    $admin_files = scandir('admin');
    echo "<p><strong>Files in admin folder:</strong></p>";
    echo "<ul>";
    foreach ($admin_files as $file) {
        if ($file != '.' && $file != '..') {
            echo "<li>$file</li>";
        }
    }
    echo "</ul>";
} else {
    echo "<p>❌ Admin folder not found</p>";
}

// Check if login.php exists
if (file_exists('admin/login.php')) {
    echo "<p>✅ login.php found in admin folder</p>";
} else {
    echo "<p>❌ login.php not found in admin folder</p>";
}

// Check if .htaccess exists
if (file_exists('.htaccess')) {
    echo "<p>✅ .htaccess file exists</p>";
} else {
    echo "<p>❌ .htaccess file not found</p>";
}

echo "<h3>📋 Instructions:</h3>";
echo "<ol>";
echo "<li>Make sure all files are in the correct location</li>";
echo "<li>Admin files should be in: <code>public_html/api/admin/</code></li>";
echo "<li>Main API files should be in: <code>public_html/api/</code></li>";
echo "<li>Test the login API: <a href='admin/login.php'>admin/login.php</a></li>";
echo "</ol>";

echo "<h3>🧪 Test Links:</h3>";
echo "<ul>";
echo "<li><a href='admin/login.php'>Test Login API</a></li>";
echo "<li><a href='setup_database.php'>Setup Database</a></li>";
echo "<li><a href='setup_production.php'>Test Connection</a></li>";
echo "</ul>";
?>





















