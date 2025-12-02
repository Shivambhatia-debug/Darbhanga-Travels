# Darbhanga Travels Admin Panel

A comprehensive admin panel for managing the Darbhanga Travels website, built with Next.js frontend and PHP backend.

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: PHP 8+ with MySQL database
- **Authentication**: JWT-based token authentication
- **API**: RESTful API with CORS support

## 📁 Project Structure

```
├── app/
│   ├── admin/                 # Admin panel pages
│   │   ├── layout.tsx        # Admin layout with authentication
│   │   ├── page.tsx          # Dashboard
│   │   ├── bookings/         # Booking management
│   │   ├── users/            # Customer management
│   │   └── settings/         # System settings
│   └── api/admin/            # Next.js API routes (proxy to PHP)
├── api/                      # PHP backend API
│   └── admin/
│       ├── login.php         # Admin authentication
│       ├── verify.php        # Token verification
│       ├── dashboard.php     # Dashboard data
│       ├── bookings.php      # Booking CRUD operations
│       ├── customers.php     # Customer management
│       └── settings.php      # Settings management
├── database/
│   └── schema.sql           # Database schema
└── setup.php               # Setup script
```

## 🚀 Quick Start

### Prerequisites

- PHP 8.0 or higher
- MySQL 5.7 or higher
- Node.js 18 or higher
- npm or yarn

### 1. Database Setup

```bash
# Run the setup script
php setup.php
```

This will:
- Create the database
- Set up all tables
- Insert default admin user
- Configure initial settings

### 2. Start PHP Server

```bash
# Start PHP development server
php -S localhost:8000
```

### 3. Start Next.js Development Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access Admin Panel

1. Open http://localhost:3000/admin
2. Login with:
   - Username: `admin`
   - Password: `admin123`

## 🔐 Authentication

The admin panel uses JWT-based authentication:

1. **Login**: POST to `/api/admin/login` with username/password
2. **Token**: JWT token stored in localStorage
3. **Verification**: All API calls include `Authorization: Bearer <token>`
4. **Expiration**: Tokens expire after 24 hours

## 📊 Features

### Dashboard
- Overview statistics (total bookings, users, revenue)
- Recent bookings display
- Quick action buttons
- Monthly statistics charts

### Booking Management
- View all bookings with filters
- Search by customer name, phone, or location
- Filter by status and service type
- Update booking status
- Delete bookings
- Export functionality

### Customer Management
- View all customers
- Customer details and booking history
- Total spending statistics
- Search and filter customers

### Settings
- Company information management
- Booking notification settings
- System configuration
- Maintenance mode toggle

## 🗄️ Database Schema

### Core Tables

- **admins**: Admin user accounts
- **customers**: Customer information
- **bookings**: Main booking records
- **passenger_details**: Individual passenger information
- **settings**: System configuration

### Service-Specific Tables

- **train_bookings**: Train-specific details
- **bus_bookings**: Bus-specific details
- **flight_bookings**: Flight-specific details
- **cab_bookings**: Cab-specific details

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
PHP_API_URL=http://localhost:8000/api
```

### Database Configuration

Update database credentials in PHP files:

```php
$host = 'localhost';
$dbname = 'darbhanga_travels';
$username = 'root';
$password = 'your_password';
```

## 🛠️ API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify token

### Dashboard
- `GET /api/admin/dashboard` - Dashboard statistics

### Bookings
- `GET /api/admin/bookings` - List all bookings
- `POST /api/admin/bookings` - Create new booking
- `PUT /api/admin/bookings/{id}` - Update booking
- `DELETE /api/admin/bookings/{id}` - Delete booking

### Customers
- `GET /api/admin/customers` - List all customers

### Settings
- `GET /api/admin/settings` - Get all settings
- `PUT /api/admin/settings` - Update settings

## 🔒 Security Features

- JWT token authentication
- CORS protection
- SQL injection prevention (PDO prepared statements)
- Input validation
- Admin role-based access

## 📱 Responsive Design

The admin panel is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 UI Components

Built with shadcn/ui components:
- Cards, Buttons, Inputs
- Tables and Forms
- Modals and Dialogs
- Toast notifications
- Loading states

## 🚀 Deployment

### Production Setup

1. **Database**: Set up MySQL database
2. **PHP**: Configure web server (Apache/Nginx)
3. **Next.js**: Deploy to Vercel, Netlify, or similar
4. **Environment**: Set production environment variables

### Security Considerations

- Change default admin password
- Use HTTPS in production
- Implement proper JWT secret
- Regular database backups
- Monitor access logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: admin@darbhangatravels.com
- Phone: +91 9876543210

---

**Darbhanga Travels Admin Panel** - Built with ❤️ for efficient travel management




































