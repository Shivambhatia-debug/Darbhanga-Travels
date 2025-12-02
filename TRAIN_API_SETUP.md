# 🚂 Real-Time Train API Integration Guide

## Overview
Aapki train search system ab **RailRadar API** se integrated hai! Yeh best option hai Indian Railways ke liye - comprehensive data, real-time updates, aur affordable pricing.

## 🎯 Recommended API: RailRadar

### ⭐ RailRadar.in (Currently Integrated)
- **Website**: https://railradar.in
- **Documentation**: https://railradar.in/api/v1/openapi
- **Features**: 
  - ✅ Trains between stations (currently using this!)
  - ✅ Real-time train tracking
  - ✅ Live station boards
  - ✅ Train schedules & routes
  - ✅ Historical delay analytics
  - ✅ Comprehensive station data
- **Pricing**: 
  - **Free Plan**: 51,000 requests/month (FREE!)
  - **Starter**: ₹500/month (50,000 requests)
  - **Pro**: ₹2,000/month (500,000 requests)
  - **Enterprise**: Unlimited (contact support)
- **Why RailRadar?**:
  - Indian company, optimized for Indian Railways
  - Best data accuracy
  - Generous free tier
  - Excellent API documentation
  - Fast response times

## 📋 Setup Instructions

### Step 1: Get FREE RailRadar API Key

1. **Sign Up**: Visit [https://railradar.in/signup](https://railradar.in/signup)
2. **Verify Email**: Check your email and verify your account
3. **Get API Key**: Login to [https://railradar.in/dashboard](https://railradar.in/dashboard)
4. **Copy Key**: Your API key will be displayed on the dashboard

### Step 2: Add API Key to Your Project

Create or edit `.env.local` file in your project root:

```bash
# RailRadar API Configuration
NEXT_PUBLIC_RAILRADAR_API_KEY=your_railradar_api_key_here
```

**Example:**
```bash
NEXT_PUBLIC_RAILRADAR_API_KEY=rr_1234567890abcdef
```

### Step 3: Build & Deploy

```bash
# For development
pnpm run dev

# For production
pnpm run build
```

### Step 4: Verify Integration

1. Go to your website
2. Search for trains (e.g., DBG to NDLS)
3. Open browser console (F12)
4. You should see: `✅ Real-time data fetched from RailRadar API`

**That's it! You're now using real-time train data!** 🎉

## 🔧 Manual API Control (Advanced)

Aap programmatically bhi API enable/disable kar sakte ho:

```typescript
import trainService from '@/lib/train-service'

// Enable real-time API
trainService.setUseRealApi(true)

// Set API keys
trainService.setApiKeys(
  'your_railway_api_key', // RailwayAPI.com key
  'your_rapidapi_key'     // RapidAPI key (optional)
)
```

## 📊 How It Works

### Default Mode (Local Database)
```
User searches → Local train database → Show results
✅ Fast
✅ No API cost
❌ Limited routes
❌ Not real-time
```

### Real-Time API Mode
```
User searches → Try RailwayAPI.com → Success? Show results
                ↓ Failed
                Try RapidAPI → Success? Show results
                ↓ Failed
                Fallback to local database
✅ Real-time data
✅ All routes
✅ Live availability
❌ API costs
❌ API limits
```

## 🎨 Features

### Current Implementation:
- ✅ Dual mode (Local + Real-time)
- ✅ Multiple API fallback
- ✅ Response caching (5 minutes)
- ✅ Automatic error handling
- ✅ Console logging for debugging

### API Response Mapping:
- Train numbers
- Train names
- Departure/Arrival times
- Duration
- Running days
- Classes (SL, 3A, 2A, 1A)
- Availability status
- Fares

## 💰 Cost Comparison

### RailwayAPI.com:
- **Free**: 100 requests/day
- **Basic**: ₹500/month (10,000 requests)
- **Pro**: ₹2,000/month (50,000 requests)

### RapidAPI:
- **Free**: Varies by provider
- **Basic**: Starting ₹300/month
- **Premium**: ₹1,000+/month

## 🚀 Testing

### Check Current Mode:
Console will show:
- `📊 Using local train database` - Local mode
- `✅ Real-time data fetched from API` - API mode
- `⚠️ API failed, using fallback data` - API failed, using local

### Enable Debug Mode:
Open browser console (F12) to see API logs

## 📝 Notes

1. **API Limits**: Free tiers have daily limits. Monitor usage.
2. **Caching**: Results are cached for 5 minutes to reduce API calls.
3. **Fallback**: If API fails, local database is used automatically.
4. **Security**: Never commit API keys to Git!

## 🔐 Security Best Practices

1. Add `.env.local` to `.gitignore`:
```bash
echo ".env.local" >> .gitignore
```

2. Use environment variables in production (Hostinger):
   - Hostinger Control Panel → Advanced → Environment Variables
   - Add: `NEXT_PUBLIC_RAILWAY_API_KEY`

3. Never expose API keys in frontend code

## 📧 Support

- RailwayAPI.com: support@railwayapi.com
- RapidAPI: https://rapidapi.com/hub

## 🎯 Recommendation

**For Production Use:**
1. Start with local database (free, fast)
2. Add RailwayAPI.com for popular routes
3. Monitor API usage and costs
4. Scale based on traffic

**Abhi ke liye:**
- Local database use karo (8 trains DBG-NDLS route ke liye)
- Jab traffic badhe, tab paid API add karo
- Cost effective aur fast!

