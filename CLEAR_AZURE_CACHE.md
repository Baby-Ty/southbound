# Clear Azure Web App Cache

If you're seeing an older version of the site on Azure, try these steps:

## Option 1: Restart Azure Web App (Recommended)

1. Go to Azure Portal: https://portal.azure.com
2. Navigate to your Web App: `southbound-app`
3. In the left sidebar, click **"Overview"**
4. Click **"Restart"** button at the top
5. Wait 1-2 minutes for the app to restart
6. Clear your browser cache and reload

## Option 2: Clear Browser Cache

1. **Chrome/Edge:**
   - Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Select "Cached images and files"
   - Click "Clear data"
   - Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`

2. **Firefox:**
   - Press `Ctrl+Shift+Delete`
   - Select "Cache"
   - Click "Clear Now"
   - Hard refresh: `Ctrl+F5`

## Option 3: Force Deployment

If restart doesn't work, trigger a new deployment:

1. Go to GitHub Actions: https://github.com/Baby-Ty/southbound/actions
2. Find "Deploy to Azure Web App" workflow
3. Click "Run workflow" → "Run workflow" again
4. Wait for deployment to complete (~5 minutes)

## Verify Fix

After clearing cache, check:
- `southbound-app.azurewebsites.net/route-builder` → Step 5 should show "🚀 Build My Trip" button (not "See Your Matches")

