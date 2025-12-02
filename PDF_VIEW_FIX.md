# PDF Ticket View Issue Fixed

## Date: November 8, 2025

## Problem

Uploaded ticket PDFs were showing **404 Not Found** error when trying to view them.

**URL:** `localhost:3000/uploads/tickets/ticket_1762618089_690f6ae964368.pdf`
**Error:** `404 - This page could not be found`

## Root Cause

PDFs were being saved to `backend/uploads/tickets/` directory, but Next.js cannot serve files from the backend directory. Next.js only serves static files from the `public/` directory.

### File Locations

**Before (Not Accessible):**
```
backend/uploads/tickets/ticket_xxx.pdf  ❌ Not accessible via web
```

**After (Accessible):**
```
public/uploads/tickets/ticket_xxx.pdf   ✅ Accessible via web
backend/uploads/tickets/ticket_xxx.pdf  ✅ Backup copy
```

## Solution Applied

### 1. Updated Upload Script

**File:** `backend/api/admin/upload-ticket.php`

**Changes:**
- Save uploaded PDFs to `public/uploads/tickets/` (accessible via web)
- Also save a backup copy to `backend/uploads/tickets/`
- Return URL pointing to public directory

**Before:**
```php
$uploadDir = __DIR__ . '/../../uploads/tickets/';
$filepath = $uploadDir . $filename;
move_uploaded_file($file['tmp_name'], $filepath);
```

**After:**
```php
// Public directory (accessible via web)
$publicUploadDir = __DIR__ . '/../../../public/uploads/tickets/';
$publicFilepath = $publicUploadDir . $filename;

// Backend directory (backup)
$backendUploadDir = __DIR__ . '/../../uploads/tickets/';
$backendFilepath = $backendUploadDir . $filename;

// Save to public
move_uploaded_file($file['tmp_name'], $publicFilepath);

// Backup to backend
copy($publicFilepath, $backendFilepath);
```

### 2. Migrated Existing Files

Copied all existing PDFs from `backend/uploads/tickets/` to `public/uploads/tickets/`:

```
✅ Copied: ticket_1762617970_690f6a7279589.pdf
✅ Copied: ticket_1762618089_690f6ae964368.pdf
```

### 3. Created Directory Structure

```
public/
  └── uploads/
      └── tickets/          ✅ Created
          ├── ticket_xxx.pdf
          └── ticket_yyy.pdf

backend/
  └── uploads/
      └── tickets/          ✅ Already exists (backup)
          ├── ticket_xxx.pdf
          └── ticket_yyy.pdf
```

## How It Works Now

### Upload Flow

```
User uploads PDF
    ↓
Frontend sends to /api/admin/upload-ticket.php
    ↓
Next.js API route forwards to PHP backend
    ↓
PHP receives file
    ↓
Save to public/uploads/tickets/  ✅ Web accessible
    ↓
Copy to backend/uploads/tickets/ ✅ Backup
    ↓
Return URL: /uploads/tickets/filename.pdf
    ↓
Frontend saves URL in database
    ↓
User clicks "View Ticket PDF"
    ↓
Opens: localhost:3000/uploads/tickets/filename.pdf
    ↓
Next.js serves from public/ directory ✅
    ↓
PDF displays successfully! 🎉
```

### Access URLs

**Correct URL (Works):**
```
http://localhost:3000/uploads/tickets/ticket_1762618089_690f6ae964368.pdf ✅
```

**Incorrect URL (404):**
```
http://localhost:3000/backend/uploads/tickets/ticket_xxx.pdf ❌
```

## File Permissions

Both directories have proper permissions:
- `public/uploads/tickets/` - 0777 (read/write/execute)
- `backend/uploads/tickets/` - 0777 (read/write/execute)

## Security Considerations

### Current Setup (Development)
- Files stored in public directory
- Accessible to anyone with the URL
- No authentication required to view

### Production Recommendations
1. **Add authentication check** before serving PDFs
2. **Use signed URLs** with expiration
3. **Store files outside public** and serve via authenticated endpoint
4. **Add access logging** to track who views what
5. **Implement rate limiting** to prevent abuse

## Testing

### Test 1: View Existing PDF
1. Go to bookings page
2. Find booking with PDF
3. Click "View Ticket PDF"
4. **Expected:** PDF opens in new tab ✅

### Test 2: Upload New PDF
1. Create new booking
2. Upload PDF file
3. Save booking
4. Click "View Ticket PDF"
5. **Expected:** PDF opens in new tab ✅

### Test 3: Direct URL Access
1. Copy PDF URL from database
2. Open in browser directly
3. **Expected:** PDF displays ✅

## Troubleshooting

### Issue: Still getting 404
**Solutions:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart Next.js dev server
3. Check file exists: `ls public/uploads/tickets/`
4. Verify URL doesn't have `/backend/` in it

### Issue: File not found in public directory
**Solutions:**
1. Check if upload script was updated
2. Manually copy files: 
   ```bash
   Copy-Item backend/uploads/tickets/* public/uploads/tickets/
   ```
3. Check directory permissions

### Issue: Permission denied
**Solutions:**
1. Check folder permissions (should be 0777)
2. Run: `chmod -R 777 public/uploads/tickets/`
3. Check disk space

## File Management

### View All Uploaded Tickets
```bash
# Windows
dir public\uploads\tickets

# Linux/Mac
ls -lh public/uploads/tickets/
```

### Check File Size
```bash
# Windows
Get-Item public/uploads/tickets/*.pdf | Select Name, Length

# Linux/Mac
du -h public/uploads/tickets/
```

### Clean Old Files
```bash
# Delete files older than 30 days
# Windows PowerShell
Get-ChildItem public/uploads/tickets -File | Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-30)} | Remove-Item

# Linux/Mac
find public/uploads/tickets -type f -mtime +30 -delete
```

## Backup Strategy

Files are automatically backed up to two locations:

1. **Primary:** `public/uploads/tickets/` - Web accessible
2. **Backup:** `backend/uploads/tickets/` - Not web accessible

This ensures:
- If public files are deleted, backup exists
- If Next.js is rebuilt, files are preserved
- Easy migration to different storage solution

## Future Improvements

1. **Cloud Storage Integration**
   - Upload to AWS S3, Google Cloud Storage, or Azure Blob
   - Generate signed URLs for secure access
   - Automatic backups and versioning

2. **Database Storage**
   - Store PDFs as BLOB in database
   - Serve via authenticated endpoint
   - Better access control

3. **CDN Integration**
   - Serve files via CDN for faster access
   - Reduce server load
   - Better global performance

4. **File Compression**
   - Compress PDFs before storage
   - Reduce storage space
   - Faster downloads

## Related Files

- `backend/api/admin/upload-ticket.php` - Upload handler (UPDATED)
- `app/api/admin/upload-ticket.php/route.ts` - Next.js API route
- `public/uploads/tickets/` - Web accessible directory (CREATED)
- `backend/uploads/tickets/` - Backup directory

## Status

✅ **FIXED** - PDFs now accessible via web

---

**Fixed by:** AI Assistant  
**Date:** November 8, 2025  
**Issue:** 404 error when viewing uploaded PDFs  
**Solution:** Save files to public/ directory instead of backend/  
**Impact:** All uploaded PDFs now viewable








