# 🔑 Environment Variables Setup Guide

## Create .env.local File

**Step 1:** Create a new file named `.env.local` in the project root directory

**Step 2:** Copy and paste this content:

```bash
# RailRadar API Configuration
NEXT_PUBLIC_RAILRADAR_API_KEY=
```

**Step 3:** Get your FREE API key:
1. Visit: https://railradar.in/signup
2. Sign up with email (FREE - no credit card!)
3. Verify email
4. Login to: https://railradar.in/dashboard
5. Copy your API key

**Step 4:** Add your API key to `.env.local`:

```bash
# Example:
NEXT_PUBLIC_RAILRADAR_API_KEY=rr_abc123xyz456def
```

**Step 5:** Restart your app:

```bash
# For development
pnpm run dev

# For production
pnpm run build
```

---

## 📊 Current Status

### ✅ WITHOUT API KEY (Current Setup)
Your system is already working with **local database**:
- 📍 Routes: DBG→NDLS, PNBE→NDLS, Mumbai→Delhi, etc.
- 🚂 Trains: 8 trains for DBG-NDLS route (from erail.in)
- ⚡ Speed: Instant (no API calls)
- 💰 Cost: FREE
- 📶 Works: Offline

### 🚀 WITH API KEY (Optional Upgrade)
Enable real-time data:
- 📍 Routes: ALL India (13,334 trains, 10,102 stations)
- 🚂 Trains: Real-time availability & delays
- ⚡ Speed: Fast (cached responses)
- 💰 Cost: FREE up to 51,000 requests/month
- 📶 Requires: Internet connection

---

## 🎯 Quick Command

Create `.env.local` file with one command:

### Windows (PowerShell):
```powershell
@"
# RailRadar API Configuration
NEXT_PUBLIC_RAILRADAR_API_KEY=
"@ | Out-File -FilePath .env.local -Encoding utf8
```

### Linux/Mac:
```bash
cat > .env.local << 'EOF'
# RailRadar API Configuration
NEXT_PUBLIC_RAILRADAR_API_KEY=
EOF
```

---

## 📝 Note

- `.env.local` is git-ignored (secure)
- Add API key only when you need real-time data
- Local database works perfectly without API key
- System auto-falls back to local data if API fails

---

## ✅ Verification

After adding API key, check browser console (F12):
- ✅ With API: "Real-time data fetched from RailRadar API"
- 📊 Without API: "Using local train database"

Both work perfectly! 🎉

















