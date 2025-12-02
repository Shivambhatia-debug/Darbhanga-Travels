#!/bin/bash
echo "Starting Darbhanga Travels Admin Panel..."
echo

echo "Step 1: Setting up database..."
php backend/quick_setup.php
echo

echo "Step 2: Starting PHP server on port 8000..."
php -S localhost:8000 -t backend &
PHP_PID=$!

echo "Step 3: Starting Next.js server on port 3000..."
npm run dev &
NEXT_PID=$!

echo
echo "✅ Both servers are starting..."
echo
echo "🌐 Admin Panel: http://localhost:3000/admin"
echo "🔧 Backend API: http://localhost:8000/api/admin/"
echo
echo "Login credentials:"
echo "Username: admin"
echo "Password: admin123"
echo
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $PHP_PID 2>/dev/null
    kill $NEXT_PID 2>/dev/null
    exit
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for user to stop
wait




































