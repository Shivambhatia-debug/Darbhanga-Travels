# Database Clean & Reset Instructions for Production

## Database Information
- **Database Name:** `u363779306_dbg_travels`
- **Host:** `localhost`
- **Username:** `u363779306_localhost`
- **Password:** `Shiva@8053`

## ⚠️ WARNING
**This will DELETE ALL DATA from the database!**
- All bookings will be deleted
- All customers will be deleted
- All users will be deleted (if you uncomment that section)
- All passenger details will be deleted

**Make sure you have a backup if you need any data!**

## Steps to Clean Database

### Option 1: Using phpMyAdmin (Recommended)

1. **Login to Hostinger Control Panel**
   - Go to your Hostinger dashboard
   - Navigate to **Databases** → **phpMyAdmin**

2. **Select Database**
   - Click on database: `u363779306_dbg_travels`
   - Make sure you're in the correct database

3. **Run SQL Script**
   - Click on **SQL** tab at the top
   - Open file: `database_clean_and_reset.sql`
   - Copy the entire content
   - Paste it into the SQL query box
   - Click **Go** or press **Ctrl+Enter**

4. **Verify Results**
   - Check if all tables are recreated
   - Verify admin user exists (username: `admin`, password: `admin123`)
   - Check settings table has default values

### Option 2: Using MySQL Command Line

1. **SSH into server** (if you have access)
2. **Connect to MySQL:**
   ```bash
   mysql -u u363779306_localhost -p u363779306_dbg_travels
   ```
3. **Enter password:** `Shiva@8053`
4. **Run the SQL file:**
   ```bash
   source /path/to/database_clean_and_reset.sql
   ```

## What Gets Deleted

✅ **Deleted:**
- All bookings
- All customers
- All passenger details
- All settings (will be recreated with defaults)

❓ **Optional (commented out):**
- Users (currently NOT deleted - uncomment if needed)
- Admins (currently NOT deleted - uncomment if needed)

## What Gets Created

✅ **Default Admin Account:**
- Username: `admin`
- Password: `admin123`
- Email: `admin@darbhangatravels.com`
- Role: `super_admin`

✅ **Default Settings:**
- Company name, email, phone, address
- Booking email, admin email
- Currency: INR
- Timezone: Asia/Kolkata

## After Cleaning

1. **Test Admin Login:**
   - Go to: `https://darbhangatravels.com/admin/login`
   - Username: `admin`
   - Password: `admin123`
   - Should login successfully

2. **Verify Dashboard:**
   - All stats should show 0 (no bookings, customers, etc.)
   - Dashboard should load without errors

3. **Ready for Production:**
   - Database is clean and ready
   - Start creating new bookings
   - Add new customers
   - Create new users as needed

## Troubleshooting

### If you get "Table doesn't exist" error:
- Make sure you're using the correct database name
- Check if tables were dropped successfully
- Re-run the CREATE TABLE statements

### If admin login doesn't work:
- Verify admin user was created: `SELECT * FROM admins;`
- Check password hash is correct
- Try resetting admin password manually

### If foreign key errors occur:
- Make sure `SET FOREIGN_KEY_CHECKS = 0;` is executed
- Check table order (delete child tables first)

## Backup Before Cleaning (Optional)

If you want to backup data before cleaning:

1. **In phpMyAdmin:**
   - Select database: `u363779306_dbg_travels`
   - Click **Export** tab
   - Select **Quick** export method
   - Format: **SQL**
   - Click **Go** to download backup

2. **Save backup file** for future reference

## Quick Clean (Delete Data Only)

If you only want to delete data but keep table structure:

```sql
USE u363779306_dbg_travels;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE passenger_details;
TRUNCATE TABLE bookings;
TRUNCATE TABLE customers;
TRUNCATE TABLE users;
TRUNCATE TABLE settings;

SET FOREIGN_KEY_CHECKS = 1;
```

Then re-insert default admin and settings:

```sql
INSERT INTO admins (username, password, email, full_name, role) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@darbhangatravels.com', 'Admin User', 'super_admin');

INSERT INTO settings (setting_key, setting_value, description) VALUES 
('company_name', 'Darbhanga Travels', 'Company name'),
('company_email', 'info@darbhangatravels.com', 'Company email'),
('company_phone', '+91 9876543210', 'Company phone'),
('company_address', 'Darbhanga, Bihar', 'Company address'),
('booking_email', 'bookings@darbhangatravels.com', 'Email for booking notifications'),
('admin_email', 'admin@darbhangatravels.com', 'Admin email for notifications'),
('currency', 'INR', 'Default currency'),
('timezone', 'Asia/Kolkata', 'Default timezone');
```

## Notes

- Default admin password: `admin123`
- Change admin password after first login for security
- All tables are recreated with current schema (including train columns, ticket PDF, etc.)
- Foreign keys are properly set up
- Indexes are created for better performance






