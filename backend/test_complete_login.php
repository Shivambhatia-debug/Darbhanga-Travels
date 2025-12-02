<?php
/**
 * Complete Login Flow Test
 * Tests the entire login and verify process
 */

echo "🧪 Testing Complete Login Flow...\n\n";

// Step 1: Test Login
echo "1. Testing Login API...\n";

$loginData = json_encode([
    'username' => 'admin',
    'password' => 'admin123'
]);

$ch = curl_init('http://localhost:8000/api/admin/login.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($loginData)
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo "   ❌ Login failed with HTTP code: $httpCode\n";
    echo "   Response: $response\n";
    exit(1);
}

$loginResult = json_decode($response, true);

if (!$loginResult || !$loginResult['success'] || !isset($loginResult['token'])) {
    echo "   ❌ Login failed!\n";
    echo "   Response: $response\n";
    exit(1);
}

$token = $loginResult['token'];
echo "   ✅ Login successful!\n";
echo "   Token: " . substr($token, 0, 50) . "...\n";

// Step 2: Test Verify
echo "\n2. Testing Verify API...\n";

$ch = curl_init('http://localhost:8000/api/admin/verify.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo "   ❌ Verify failed with HTTP code: $httpCode\n";
    echo "   Response: $response\n";
    exit(1);
}

$verifyResult = json_decode($response, true);

if (!$verifyResult || !$verifyResult['success']) {
    echo "   ❌ Verify failed!\n";
    echo "   Response: $response\n";
    exit(1);
}

echo "   ✅ Verify successful!\n";
echo "   Admin: {$verifyResult['admin']['username']}\n";

echo "\n✅ Complete login flow test passed!\n";
echo "\nYou can now login at: http://localhost:3000/admin\n";
echo "Username: admin\n";
echo "Password: admin123\n\n";
?>



