-- =====================================================
-- QUICK FIX: Insert Admin User (Without full_name)
-- =====================================================
-- Run this if you got "Unknown column 'full_name'" error
-- =====================================================

USE u363779306_dbg_travels;

-- Insert default admin user (without full_name column)
-- Password: admin123
INSERT INTO admins (username, password, email, role) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@darbhangatravels.com', 'super_admin')
ON DUPLICATE KEY UPDATE 
    username=VALUES(username), 
    password=VALUES(password), 
    email=VALUES(email), 
    role=VALUES(role);

-- Verify admin was created
SELECT '✅ Admin user created/updated successfully!' as status;
SELECT id, username, email, role FROM admins WHERE username = 'admin';

-- Test: You can now login with:
-- Username: admin
-- Password: admin123






