# MySQL Aria Error Fix Instructions

## Problem
Your MySQL is failing with these errors:
- `Aria recovery failed`
- `Could not open mysql.plugin table`
- `Failed to initialize plugins`

## Solution (Choose One Method)

### Method 1: Quick Fix (Recommended)
1. **Close XAMPP Control Panel completely**
2. **Run**: `QUICK_FIX_MYSQL.bat` (double-click)
3. **Open XAMPP Control Panel**
4. **Start MySQL**

If this works, you're done! ✅

---

### Method 2: Manual Fix

#### Step 1: Stop MySQL
- Close XAMPP Control Panel
- Or run: `taskkill /F /IM mysqld.exe`

#### Step 2: Delete Corrupted Files
Open File Explorer and go to: `C:\xampp\mysql\data\`

Delete these files (if they exist):
- `aria_log.*` (all files starting with aria_log)
- `aria_log_control`
- `aria_log_control.*`

#### Step 3: Repair Aria Tables
Open Command Prompt as Administrator and run:
```cmd
cd C:\xampp\mysql\bin
aria_chk.exe -r C:\xampp\mysql\data\mysql\*.MAI
aria_chk.exe -r C:\xampp\mysql\data\mysql\*.MAD
```

#### Step 4: Start MySQL
- Open XAMPP Control Panel
- Start MySQL

---

### Method 3: If MySQL Still Doesn't Start

#### Fix mysql.plugin Table

1. **Start MySQL in safe mode** (if possible):
   ```cmd
   cd C:\xampp\mysql\bin
   mysqld.exe --skip-grant-tables --skip-networking
   ```

2. **In a new Command Prompt**, run:
   ```cmd
   cd C:\xampp\mysql\bin
   mysql.exe -u root
   ```

3. **In MySQL prompt**, run:
   ```sql
   USE mysql;
   DROP TABLE IF EXISTS plugin;
   CREATE TABLE plugin (
     name VARCHAR(64) NOT NULL DEFAULT '',
     dl VARCHAR(128) NOT NULL DEFAULT '',
     PRIMARY KEY (name)
   ) ENGINE=Aria DEFAULT CHARSET=utf8mb4;
   EXIT;
   ```

4. **Stop MySQL** (Ctrl+C in the first command prompt)

5. **Start MySQL normally** from XAMPP

---

### Method 4: Nuclear Option (Last Resort)

If nothing works, you may need to:

1. **Backup your database**:
   ```cmd
   cd C:\xampp\mysql\bin
   mysqldump.exe -u root darbhangatravels_db > backup.sql
   ```

2. **Reinstall MySQL** (preserve data):
   - Backup `C:\xampp\mysql\data\` folder
   - Reinstall XAMPP
   - Restore your `data` folder

---

## After Fix - Test Database

Once MySQL starts successfully:

1. **Test connection**: Run `test_db_after_mysql.php` in browser
2. **Check bookings**: Go to admin bookings page
3. **Verify "Booking By User"** shows actual user names

---

## Need Help?

If MySQL still doesn't start after all methods:
- Share the complete error log from XAMPP
- Check Windows Event Viewer for MySQL errors
- Try starting MySQL manually to see exact error

