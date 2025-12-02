<?php
// Create a simple admin index.html file
$adminIndexContent = '<!DOCTYPE html>
<html lang="en">
<head>
    <script>
    // Fix API calls for static export
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      if (url.startsWith("/api/")) {
        url = "https://darbhangatravels.com" + url;
      }
      return originalFetch(url, options);
    };
    </script>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Login - Darbhanga Travels</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo h1 {
            color: #333;
            margin: 0;
            font-size: 24px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #555;
            font-weight: bold;
        }
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            box-sizing: border-box;
        }
        .form-group input:focus {
            outline: none;
            border-color: #667eea;
        }
        .login-btn {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .login-btn:hover {
            transform: translateY(-2px);
        }
        .error {
            color: red;
            text-align: center;
            margin-top: 10px;
        }
        .success {
            color: green;
            text-align: center;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>Darbhanga Travels</h1>
            <p>Admin Login</p>
        </div>
        
        <form id="loginForm">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="login-btn">Login</button>
            
            <div id="message"></div>
        </form>
    </div>

    <script>
        document.getElementById("loginForm").addEventListener("submit", async function(e) {
            e.preventDefault();
            
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const messageDiv = document.getElementById("message");
            
            messageDiv.innerHTML = "<div style=\"color: blue; text-align: center;\">Logging in...</div>";
            
            try {
                const response = await fetch("/api/admin/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    messageDiv.innerHTML = "<div class=\"success\">Login successful! Redirecting...</div>";
                    // Store token and redirect
                    localStorage.setItem("adminToken", data.token);
                    setTimeout(() => {
                        window.location.href = "/admin/dashboard";
                    }, 1000);
                } else {
                    messageDiv.innerHTML = "<div class=\"error\">" + (data.message || "Login failed") + "</div>";
                }
            } catch (error) {
                console.error("Login error:", error);
                messageDiv.innerHTML = "<div class=\"error\">Network error. Please try again.</div>";
            }
        });
    </script>
</body>
</html>';

// Write the file
$result = file_put_contents('../admin/index.html', $adminIndexContent);

if ($result !== false) {
    echo "✅ Admin index.html created successfully!<br>";
    echo "File size: " . strlen($adminIndexContent) . " bytes<br>";
    echo "<a href='../admin/' target='_blank'>Test Admin Page</a>";
} else {
    echo "❌ Failed to create admin index.html";
}
?>





















