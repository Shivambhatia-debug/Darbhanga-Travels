# Darbhanga Travels - Hostinger Deployment Guide

## Prerequisites
- Node.js installed on your system
- Hostinger account with domain `darbhangatravels.com`
- FileZilla or any FTP client

## Step 1: Build the Application

1. Open terminal/command prompt in your project directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the static version:
   ```bash
   npm run build
   ```

## Step 2: Upload to Hostinger

1. **Login to Hostinger hPanel**
   - Go to https://hpanel.hostinger.com
   - Login with your credentials

2. **Access File Manager**
   - In your hPanel, go to "Files" section
   - Click on "File Manager"

3. **Navigate to public_html**
   - Go to `public_html` folder (this is your website root)

4. **Upload Files**
   - Upload all contents from the `dist` folder to `public_html`
   - Make sure to upload all files and folders from `dist` directory

## Step 3: Connect Domain

1. **In hPanel, go to "Domains" section**
2. **Click on "darbhangatravels.com"**
3. **Set DNS settings:**
   - Point A record to Hostinger's IP address
   - Set CNAME for www to your domain

## Step 4: Database and Backend Setup

### Database Setup:
1. **Create Database in hPanel**
   - Go to "Databases" section
   - Create new MySQL database
   - Note down database credentials

2. **Upload PHP Backend**
   - Upload `backend` folder to `public_html/api`
   - Update database connection settings in PHP files

### API Configuration:
Since your app uses API routes that forward to PHP backend:
1. **Upload PHP Backend Files**
   - Copy all files from `backend/api/` to `public_html/api/`
   - Make sure PHP files have proper permissions (644)

2. **Update API URLs**
   - The frontend will automatically use your domain for API calls
   - No changes needed in the frontend code

3. **Test API Endpoints**
   - Visit `https://darbhangatravels.com/api/test_connection.php`
   - Verify database connection is working

## Step 5: Test Your Website

1. Visit `https://darbhangatravels.com`
2. Check all pages are loading correctly
3. Test booking functionality

## Troubleshooting

### Common Issues:
1. **404 Errors**: Make sure all files are in `public_html`
2. **CSS/JS not loading**: Check file permissions (should be 644)
3. **Images not showing**: Verify image paths are correct

### File Permissions:
- Files: 644
- Folders: 755

## Important Notes

- The site is configured for static export
- All API routes will need to be converted to PHP for backend functionality
- Make sure to backup your files before deployment
- Test thoroughly before going live

## Support

If you encounter any issues:
1. Check Hostinger's documentation
2. Contact Hostinger support
3. Verify all file uploads are complete
