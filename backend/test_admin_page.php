<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Admin Page Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .success { color: green; }
        .error { color: red; }
        .info { color: blue; }
    </style>
</head>
<body>
    <h1>Admin Page Test</h1>
    
    <h2>File Structure Check:</h2>
    <?php
    $adminPath = '../admin/';
    $indexPath = $adminPath . 'index.html';
    
    echo "<p><strong>Admin directory exists:</strong> ";
    if (is_dir($adminPath)) {
        echo "<span class='success'>YES</span>";
    } else {
        echo "<span class='error'>NO</span>";
    }
    echo "</p>";
    
    echo "<p><strong>Admin index.html exists:</strong> ";
    if (file_exists($indexPath)) {
        echo "<span class='success'>YES</span>";
        echo " (Size: " . filesize($indexPath) . " bytes)";
    } else {
        echo "<span class='error'>NO</span>";
    }
    echo "</p>";
    
    echo "<p><strong>Admin index.html readable:</strong> ";
    if (is_readable($indexPath)) {
        echo "<span class='success'>YES</span>";
    } else {
        echo "<span class='error'>NO</span>";
    }
    echo "</p>";
    ?>
    
    <h2>Directory Contents:</h2>
    <?php
    if (is_dir($adminPath)) {
        $files = scandir($adminPath);
        echo "<ul>";
        foreach ($files as $file) {
            if ($file != '.' && $file != '..') {
                $filePath = $adminPath . $file;
                $isDir = is_dir($filePath);
                $size = $isDir ? 'DIR' : filesize($filePath) . ' bytes';
                echo "<li><strong>$file</strong> ($size)</li>";
            }
        }
        echo "</ul>";
    } else {
        echo "<p class='error'>Admin directory not found!</p>";
    }
    ?>
    
    <h2>Simple Admin Login Test:</h2>
    <form method="POST" action="admin/login.php">
        <p>
            <label>Username:</label><br>
            <input type="text" name="username" value="admin" required>
        </p>
        <p>
            <label>Password:</label><br>
            <input type="password" name="password" value="admin123" required>
        </p>
        <p>
            <button type="submit">Test Login</button>
        </p>
    </form>
    
    <h2>Direct Links:</h2>
    <ul>
        <li><a href="../admin/" target="_blank">Admin Page</a></li>
        <li><a href="admin/login.php" target="_blank">Direct Login API</a></li>
        <li><a href="test_api.php" target="_blank">Test API</a></li>
    </ul>
</body>
</html>





















