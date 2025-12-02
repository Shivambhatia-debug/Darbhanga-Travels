# Darbhanga Travels Backend API

This is the PHP backend API for the Darbhanga Travels admin panel.

## 📁 Structure

```
backend/
├── api/admin/           # API endpoints
│   ├── login.php       # Admin authentication
│   ├── verify.php      # Token verification
│   ├── dashboard.php   # Dashboard statistics
│   ├── bookings.php    # Booking CRUD operations
│   ├── customers.php   # Customer management
│   └── settings.php    # Settings management
├── database/           # Database files
│   └── schema.sql     # Database schema
├── setup.php          # Database setup script
└── .htaccess          # Apache configuration
```

## 🚀 Quick Start

### 1. Setup Database
```bash
php setup.php
```

### 2. Start PHP Server
```bash
# From project root
php -S localhost:8000 -t backend

# Or using npm script
npm run php-server
```

### 3. Test API
```bash
# Test login endpoint
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 🔧 Configuration

### Database Settings
Update database credentials in each PHP file:

```php
$host = 'localhost';
$dbname = 'darbhanga_travels';
$username = 'root';
$password = 'your_password';
```

### CORS Settings
The API includes CORS headers for cross-origin requests from the Next.js frontend.

## 📡 API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify JWT token

### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

### Bookings
- `GET /api/admin/bookings` - List all bookings
- `POST /api/admin/bookings` - Create new booking
- `PUT /api/admin/bookings?id={id}` - Update booking
- `DELETE /api/admin/bookings?id={id}` - Delete booking

### Customers
- `GET /api/admin/customers` - List all customers

### Settings
- `GET /api/admin/settings` - Get all settings
- `PUT /api/admin/settings` - Update settings

## 🔒 Security Features

- JWT token authentication
- SQL injection prevention (PDO prepared statements)
- CORS protection
- Input validation
- Admin role-based access

## 🗄️ Database

The backend uses MySQL with the following main tables:
- `admins` - Admin users
- `customers` - Customer information
- `bookings` - Booking records
- `passenger_details` - Passenger information
- `settings` - System configuration

## 🛠️ Development

### Adding New Endpoints

1. Create new PHP file in `api/admin/`
2. Add CORS headers
3. Implement authentication check
4. Add database operations
5. Return JSON response

### Error Handling

All endpoints return JSON responses with appropriate HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 405: Method Not Allowed
- 500: Internal Server Error

## 📝 Notes

- Uses MD5 for password hashing (upgrade to bcrypt for production)
- JWT tokens are base64 encoded (use proper JWT library for production)
- Database connection is configured per file (use config file for production)




































