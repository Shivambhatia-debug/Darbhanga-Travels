# Hostinger Deployment - Step by Step Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Build Your Website
```bash
# Run this in your project folder
deploy.bat
```
Or manually:
```bash
npm install
npm run build
```

**Note:** The `dist` folder will be created after running the build command. This folder contains all the static files ready for upload to Hostinger.

### Step 2: Login to Hostinger
1. Go to https://hpanel.hostinger.com
2. Login with your credentials
3. You should see "darbhangatravels.com" in your dashboard

### Step 3: Upload Files
1. **Click "Files" in the left menu**
2. **Click "File Manager"**
3. **Navigate to `public_html` folder**
4. **Delete any existing files** (if this is a fresh setup)
5. **Upload all contents from `dist` folder** to `public_html`

### Step 4: Connect Domain
1. **Click "Domains" in left menu**
2. **Click on "darbhangatravels.com"**
3. **Click "Manage"**
4. **Set DNS to point to Hostinger** (usually automatic)

### Step 5: Test Website
Visit: https://darbhangatravels.com

---

## 🔧 Detailed Setup (If you need database functionality)

### Database Setup:
1. **In hPanel, go to "Databases"**
2. **Click "Create Database"**
3. **Note down:**
   - Database name
   - Username
   - Password
   - Host (usually localhost)

### Upload PHP Backend:
1. **Upload `backend` folder to `public_html/api`**
2. **Edit `backend/setup_production.php`** with your database details
3. **Visit `https://darbhangatravels.com/api/setup_production.php`** to test

---

## ⚠️ Important Notes

### File Structure on Hostinger:
```
public_html/
├── index.html (from dist folder)
├── _next/ (from dist folder)
├── images/ (from dist folder)
├── api/ (PHP backend files)
└── .htaccess (routing rules)
```

### Common Issues & Solutions:

1. **404 Errors**
   - Make sure all files are in `public_html`
   - Check `.htaccess` file is uploaded

2. **CSS/JS Not Loading**
   - Verify `_next` folder is uploaded
   - Check file permissions (should be 644)

3. **Domain Not Working**
   - Wait 24-48 hours for DNS propagation
   - Check domain settings in hPanel

4. **API Not Working**
   - Upload PHP files to `public_html/api`
   - Check database connection
   - Verify file permissions

---

## 📞 Need Help?

1. **Check Hostinger Documentation**
2. **Contact Hostinger Support**
3. **Verify all files are uploaded correctly**

---

## ✅ Final Checklist

- [ ] Website builds without errors
- [ ] All files uploaded to `public_html`
- [ ] Domain connected and pointing to Hostinger
- [ ] Website loads at https://darbhangatravels.com
- [ ] All pages work correctly
- [ ] Database setup (if needed)
- [ ] API endpoints working (if needed)

**🎉 Your Darbhanga Travels website is now live!**
