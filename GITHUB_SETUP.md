# GitHub Setup Instructions

## Quick Setup (Manual)

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Repository name: `student-tracker-dashboard`
3. Description: `Full-stack student tracking dashboard with Firebase, React, and AI insights`
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

### 2. Push to GitHub

After creating the repository, run these commands:

```bash
cd /Users/AM70864/CascadeProjects/student-tracker

# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/student-tracker-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Alternative: Using SSH

If you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/student-tracker-dashboard.git
git branch -M main
git push -u origin main
```

## Repository is Ready!

Your local Git repository is initialized and committed. Just need to:
1. Create the GitHub repo
2. Add the remote
3. Push

---

## Troubleshooting Application Issues

If you're unable to open the application, try these steps:

### Check if server is running:
```bash
cd /Users/AM70864/CascadeProjects/student-tracker
npm run dev
```

### Common Issues:

1. **Port 3000 already in use:**
   ```bash
   # Kill the process using port 3000
   lsof -ti:3000 | xargs kill -9
   # Then restart
   npm run dev
   ```

2. **Module errors:**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

3. **Browser not opening:**
   - Manually open: http://localhost:3000
   - Try different browser
   - Check browser console (F12) for errors

4. **Firebase errors (can be ignored for now):**
   - App works without Firebase in guest mode
   - Set up Firebase later using README.md instructions

### Check Application Status:

```bash
# See if Vite is running
curl http://localhost:3000
```

If you see HTML output, the server is working!
