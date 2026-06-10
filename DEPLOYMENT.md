# 🚀 Deployment Guide - Get Your Shareable Link

## Option 1: Vercel (Recommended - Easiest & Free)

### Step 1: Sign Up/Login to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Login"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub

### Step 2: Import Your Repository
1. Click "Add New..." → "Project"
2. Find and select `student-tracker-dashboard` from your repositories
3. Click "Import"

### Step 3: Configure (Use These Settings)
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 4: Add Environment Variables (Important!)
Click "Environment Variables" and add these:

```
VITE_FIREBASE_API_KEY=demo-key
VITE_FIREBASE_AUTH_DOMAIN=demo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=demo-project
VITE_FIREBASE_STORAGE_BUCKET=demo.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456
VITE_FIREBASE_APP_ID=demo-app-id
```

### Step 5: Deploy!
1. Click "Deploy"
2. Wait 2-3 minutes
3. **You'll get a shareable link like:** `https://student-tracker-dashboard.vercel.app`

---

## Option 2: Netlify (Also Free & Easy)

### Step 1: Sign Up/Login to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "Sign Up" with GitHub
3. Authorize Netlify

### Step 2: Import Repository
1. Click "Add new site" → "Import an existing project"
2. Choose "GitHub"
3. Select `student-tracker-dashboard`

### Step 3: Configure Build Settings
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### Step 4: Add Environment Variables
Go to Site settings → Environment variables → Add:

```
VITE_FIREBASE_API_KEY=demo-key
VITE_FIREBASE_AUTH_DOMAIN=demo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=demo-project
VITE_FIREBASE_STORAGE_BUCKET=demo.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456
VITE_FIREBASE_APP_ID=demo-app-id
```

### Step 5: Deploy!
1. Click "Deploy site"
2. Wait 2-3 minutes
3. **You'll get a shareable link like:** `https://student-tracker-dashboard.netlify.app`

---

## Option 3: GitHub Pages (Free but requires more setup)

### Quick Deploy with GitHub Pages
1. Go to your repository: https://github.com/Anika-007/student-tracker-dashboard
2. Click "Settings" → "Pages"
3. Under "Build and deployment":
   - Source: "GitHub Actions"
4. Create `.github/workflows/deploy.yml` (see below)
5. Push changes
6. **Shareable link:** `https://anika-007.github.io/student-tracker-dashboard/`

---

## 🎯 Quickest Way (5 Minutes):

### Using Vercel CLI (I can do this for you):

Run this command in your terminal:
```bash
cd /Users/AM70864/CascadeProjects/student-tracker
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N**
- Project name? Press Enter (use default)
- Directory? Press Enter (use ./)
- Override settings? **N**

**You'll immediately get a shareable link!**

---

## 📱 After Deployment

Your shareable link will look like:
- **Vercel:** `https://student-tracker-dashboard-xyz.vercel.app`
- **Netlify:** `https://student-tracker-dashboard.netlify.app`
- **GitHub Pages:** `https://anika-007.github.io/student-tracker-dashboard/`

### Share this link with anyone!
- ✅ Works on any device
- ✅ No installation needed
- ✅ Data saves in browser localStorage
- ✅ Free forever

---

## 🔧 Custom Domain (Optional)

Both Vercel and Netlify allow free custom domains:
1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. Add it in Vercel/Netlify settings
3. Update DNS records
4. Your link becomes: `https://yourdomain.com`

---

## ⚡ Which Should You Choose?

| Platform | Speed | Ease | Custom Domain | Recommendation |
|----------|-------|------|---------------|----------------|
| **Vercel** | ⚡⚡⚡ | ⭐⭐⭐ | ✅ Free | **Best Choice** |
| **Netlify** | ⚡⚡⚡ | ⭐⭐⭐ | ✅ Free | Great Alternative |
| **GitHub Pages** | ⚡⚡ | ⭐⭐ | ✅ Free | More Setup |

**I recommend Vercel** - it's the fastest and easiest!
