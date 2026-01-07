# 🚂 Darbhanga Travels - Full-Stack Travel Booking Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PHP](https://img.shields.io/badge/PHP-8.0-777BB4?style=for-the-badge&logo=php)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

**A modern, production-ready travel booking platform supporting Bus, Train, Flight, and Cab bookings**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🎯 Overview

**Darbhanga Travels** is a comprehensive full-stack travel booking platform built with modern web technologies. It provides a seamless booking experience for multiple travel modes including trains, buses, flights, and cabs. The platform features a user-friendly frontend, a powerful admin dashboard, and a robust RESTful API backend.

### Key Highlights

- ✅ **Multi-modal Booking System** - Train, Bus, Flight, and Cab bookings
- ✅ **Admin Dashboard** - Complete booking management, analytics, and reporting
- ✅ **User Authentication** - Secure JWT-based authentication system
- ✅ **Real-time Updates** - Live booking status and availability
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Production Ready** - Deployed and handling 50,000+ bookings

---

## ✨ Features

### 🎫 Booking Features
- **Multi-modal Booking** - Book trains, buses, flights, and cabs from one platform
- **Real-time Availability** - Check availability and book instantly
- **Date Selection** - Easy calendar-based date picker
- **Station/Route Search** - Intelligent search with autocomplete
- **Passenger Management** - Add multiple passengers per booking
- **Ticket PDF Upload** - Upload and manage booking tickets

### 👨‍💼 Admin Dashboard
- **Dashboard Analytics** - Real-time statistics and insights
- **Booking Management** - View, create, update, and delete bookings
- **Customer Management** - Complete customer database and history
- **Payment Tracking** - Track pending, completed, and today's payments
- **User Management** - Admin and user account management
- **Settings** - System configuration and preferences

### 🔐 Security Features
- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Admin and user role separation
- **SQL Injection Prevention** - PDO prepared statements
- **CORS Protection** - Secure cross-origin requests
- **Input Validation** - Comprehensive form and data validation

### 🎨 UI/UX Features
- **Modern Design** - Clean, professional interface with smooth animations
- **Dark Mode Support** - Theme switching capability
- **Responsive Layout** - Works perfectly on mobile, tablet, and desktop
- **Loading States** - Smooth loading indicators and transitions
- **Toast Notifications** - User-friendly feedback system
- **Accessible** - Built with accessibility in mind

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14.2 (App Router)
- **Language:** TypeScript 5
- **UI Library:** React 18
- **Styling:** Tailwind CSS 3.4
- **UI Components:** Radix UI, Shadcn/ui
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Charts:** Recharts

### Backend
- **Language:** PHP 8.0+
- **Database:** MySQL 8.0
- **API:** RESTful API architecture
- **Authentication:** JWT tokens
- **Server:** Apache/Nginx compatible

### Development Tools
- **Package Manager:** npm/pnpm
- **Version Control:** Git
- **Code Editor:** VS Code, Cursor AI
- **API Testing:** Postman

### Deployment
- **Hosting:** Hostinger
- **Build Tool:** Next.js static export
- **Database:** MySQL on Hostinger

---

## 📁 Project Structure

```
darbhanga-travels/
├── app/                          # Next.js app directory
│   ├── admin/                    # Admin dashboard pages
│   │   ├── bookings/            # Booking management
│   │   ├── customers/           # Customer management
│   │   ├── payment/             # Payment tracking
│   │   ├── settings/            # Settings page
│   │   └── users/               # User management
│   ├── api/                     # Next.js API routes
│   ├── book/                    # Booking pages (bus, train, flight, cab)
│   ├── user/                    # User pages (login, dashboard, bookings)
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── backend/                      # PHP backend
│   ├── api/                     # API endpoints
│   │   ├── admin/               # Admin APIs
│   │   └── user/                # User APIs
│   ├── config/                  # Database configuration
│   ├── uploads/                 # File uploads
│   └── README.md                # Backend documentation
├── components/                  # React components
│   ├── ui/                      # UI components (shadcn/ui)
│   ├── booking-section.tsx      # Booking form component
│   └── contact-form.tsx         # Contact form component
├── lib/                         # Utility functions
│   ├── utils.ts                 # Utility functions
│   └── train-service.ts         # Train service logic
├── public/                      # Static assets
│   ├── images/                  # Images
│   └── uploads/                 # Public uploads
├── styles/                      # Global styles
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind config
└── README.md                    # This file
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ and npm/pnpm
- **PHP** 8.0+
- **MySQL** 8.0+
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/darbhanga-travels.git
cd darbhanga-travels
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Or using pnpm (recommended)
pnpm install
```

### Step 3: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Update database credentials in config/database.php
# Then run setup script
php setup.php
```

### Step 4: Configure Environment

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
DATABASE_HOST=localhost
DATABASE_NAME=darbhanga_travels
DATABASE_USER=root
DATABASE_PASSWORD=your_password
```

### Step 5: Start Development Servers

```bash
# Start both frontend and backend concurrently
npm run dev:full

# Or start them separately:

# Terminal 1: Start PHP backend server
npm run php-server

# Terminal 2: Start Next.js frontend
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000

---

## 💻 Usage

### For Users

1. **Browse Services** - Visit the homepage to see available services
2. **Select Travel Mode** - Choose Train, Bus, Flight, or Cab
3. **Enter Details** - Fill in source, destination, date, and passenger details
4. **Book** - Submit booking and receive confirmation
5. **Track Booking** - Login to view booking status and history

### For Admins

1. **Login** - Access admin panel at `/admin`
2. **Dashboard** - View statistics and overview
3. **Manage Bookings** - Create, update, or delete bookings
4. **Customer Management** - View and manage customer data
5. **Payment Tracking** - Monitor payments and generate reports
6. **Settings** - Configure system settings

### API Usage

See [Backend README](./backend/README.md) for detailed API documentation.

---

## 📡 API Documentation

### Authentication Endpoints

```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

```http
GET /api/admin/verify
Authorization: Bearer {token}
```

### Booking Endpoints

```http
GET /api/admin/bookings
GET /api/admin/bookings?id={id}
POST /api/admin/bookings
PUT /api/admin/bookings?id={id}
DELETE /api/admin/bookings?id={id}
```

### Dashboard Endpoints

```http
GET /api/admin/dashboard
Authorization: Bearer {token}
```

For complete API documentation, see [Backend API Documentation](./backend/API_DOCUMENTATION.md).

---

## 🚢 Deployment

### Production Build

```bash
# Build for production
npm run build

# For static export
npm run build:static
```

### Deploy to Hostinger

1. **Upload Files** - Upload `out/` directory contents to `public_html/`
2. **Upload Backend** - Upload `backend/api/` to `public_html/api/`
3. **Configure Database** - Update database credentials in PHP files
4. **Set Permissions** - Ensure proper file permissions for uploads
5. **Configure .htaccess** - Set up URL rewriting if needed

See [Upload Guide](./UPLOAD_FILES_TO_HOSTINGER.md) for detailed instructions.

---

## 📸 Screenshots

> Screenshots will be added here

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Write clean, readable code
- Add comments for complex logic
- Test your changes thoroughly

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Shivam Raj**

- **Email:** shivamraj19v@gmail.com
- **Phone:** 9234868053
- **Location:** Darbhanga, India
- **GitHub:** [@your-username](https://github.com/your-username)
- **LinkedIn:** [Your LinkedIn](https://linkedin.com/in/your-profile)
- **Portfolio:** [Your Portfolio](https://your-portfolio.com)

### About the Developer

AI Automation Software Engineer specializing in automation-driven development and high-productivity workflows. Winner of Smart India Hackathon 2024. Passionate about building scalable, efficient solutions using modern technologies.

---

## 🏆 Achievements

- 🏆 **College Winner** - Smart India Hackathon 2024
- 💻 Built **5+ production-ready** web applications
- 🚀 Successfully deployed full-stack applications
- 📈 Active GitHub contributor

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library

---

## 📊 Project Stats

- **Lines of Code:** 10,000+
- **Components:** 50+
- **API Endpoints:** 15+
- **Database Tables:** 5+
- **Technologies Used:** 20+

---

<div align="center">

**Built with ❤️ by Shivam Raj**

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/your-username/darbhanga-travels/issues) • [Request Feature](https://github.com/your-username/darbhanga-travels/issues) • [Documentation](./backend/README.md)

</div>

