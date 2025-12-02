<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Database connection
$host = 'localhost';
$dbname = 'u363779306_dbg_travels';
$username = 'u363779306_localhost';
$password = 'Shiva@8053';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if customers table exists and has the right structure
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    
    $result = [
        'success' => true,
        'tables' => $tables,
        'customers_table_exists' => in_array('customers', $tables),
        'bookings_table_exists' => in_array('bookings', $tables),
        'passenger_details_table_exists' => in_array('passenger_details', $tables)
    ];
    
    if (in_array('customers', $tables)) {
        $customersStructure = $pdo->query("DESCRIBE customers")->fetchAll(PDO::FETCH_ASSOC);
        $result['customers_structure'] = $customersStructure;
    }
    
    if (in_array('bookings', $tables)) {
        $bookingsStructure = $pdo->query("DESCRIBE bookings")->fetchAll(PDO::FETCH_ASSOC);
        $result['bookings_structure'] = $bookingsStructure;
    }
    
    echo json_encode($result, JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
















