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

// Check if file was uploaded (accept both 'ticket' and 'ticket_pdf')
$fileKey = isset($_FILES['ticket_pdf']) ? 'ticket_pdf' : 'ticket';

if (!isset($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    $errorMsg = 'No file uploaded';
    if (isset($_FILES[$fileKey])) {
        $errorMsg .= ' (Error code: ' . $_FILES[$fileKey]['error'] . ')';
    }
    echo json_encode(['success' => false, 'message' => $errorMsg, 'debug' => $_FILES]);
    exit();
}

$file = $_FILES[$fileKey];

// Validate file type (PDF only)
$allowedTypes = ['application/pdf'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Only PDF files are allowed']);
    exit();
}

// Validate file size (max 5MB)
$maxSize = 5 * 1024 * 1024; // 5MB
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'File size exceeds 5MB limit']);
    exit();
}

// Create uploads directory in public folder (accessible via web)
$publicUploadDir = __DIR__ . '/../../../public/uploads/tickets/';
if (!file_exists($publicUploadDir)) {
    mkdir($publicUploadDir, 0777, true);
}

// Also keep a backup in backend
$backendUploadDir = __DIR__ . '/../../uploads/tickets/';
if (!file_exists($backendUploadDir)) {
    mkdir($backendUploadDir, 0777, true);
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'ticket_' . time() . '_' . uniqid() . '.' . $extension;
$publicFilepath = $publicUploadDir . $filename;
$backendFilepath = $backendUploadDir . $filename;

// Move uploaded file to public directory
if (move_uploaded_file($file['tmp_name'], $publicFilepath)) {
    // Also copy to backend for backup
    copy($publicFilepath, $backendFilepath);
    
    // Return the URL to access the file (from public directory)
    $fileUrl = '/uploads/tickets/' . $filename;
    
    echo json_encode([
        'success' => true,
        'message' => 'File uploaded successfully',
        'url' => $fileUrl,
        'filename' => $filename
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save file']);
}


