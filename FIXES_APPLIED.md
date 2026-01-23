# Configuration Fixes Applied - Summary

## ✅ All Configuration Issues Fixed

### 1. GitHub Workflow - Deployment Target
**Problem**: Workflow was deploying to wrong Static Web App  
**Fixed**: 
- Renamed workflow file to `azure-static-web-apps-victorious-sky-0cd1be11e.yml`
- Updated deployment token reference to `AZURE_STATIC_WEB_APPS_API_TOKEN_VICTORIOUS_SKY_0CD1BE11E`
- Will now deploy to correct app when GitHub secret is updated

### 2. Azure Storage Container Name
**Problem**: Inconsistent container names causing 404 on images  
**Fixed**:
- Standardized to `southbound-images` across all configs
- Updated `.env.local` from `southboundimages` → `southbound-images`
- Removed leading spaces in `.env.local` storage config

### 3. Duplicate API URL
**Problem**: Two conflicting `NEXT_PUBLIC_FUNCTIONS_URL` values  
**Fixed**:
- Removed duplicate from line 30
- Single URL: `https://southbnd-functions-v3.azurewebsites.net`
- Added helpful comments for local dev override

### 4. Routes Functions
**Problem**: Missing function.json files for routes endpoints  
**Fixed**:
- Created `functions/routes/function.json`
- Created `functions/routes-by-id/function.json`
- Functions built successfully

### 5. Hub Routes Documentation
**Problem**: Hub routes returning 404 in production  
**Root Cause**: Static export doesn't support dynamic routes  
**Documented**: Added clear explanation in `next.config.ts` and deployment notes

## 🚀 Next Steps (Required for Production)

### Step 1: Update GitHub Secret
**You need to do this manually in GitHub:**

1. Go to your repository settings
2. Navigate to Secrets and variables → Actions
3. Add new secret named: `AZURE_STATIC_WEB_APPS_API_TOKEN_VICTORIOUS_SKY_0CD1BE11E`
4. Get value from: Azure Portal → Static Web Apps → victorious-sky-0cd1be11e → Manage deployment token

### Step 2: Update Azure Function App Environment Variable
**In Azure Portal:**

1. Go to Function App: `southbnd-functions-v3`
2. Settings → Configuration → Application settings
3. Find `AZURE_STORAGE_CONTAINER_NAME`
4. Change value from `southboundimages` to `southbound-images`
5. Click Save and restart the function app

### Step 3: Deploy Changes

**Option A - Automatic (Recommended):**
```bash
git add .
git commit -m "Fix: Update deployment workflow and storage config"
git push origin master
```
This will trigger both workflows:
- Static Web App deployment (after GitHub secret is added)
- Azure Functions deployment (if functions/ folder changed)

**Option B - Manual Function Deployment:**
```bash
cd functions
npm run build
# Then deploy via Azure Functions Core Tools or Azure Portal
```

### Step 4: Verify Everything Works

After deployment, test these endpoints:
```bash
# Should return routes data
curl https://southbnd-functions-v3.azurewebsites.net/api/routes

# Should return cities data  
curl https://southbnd-functions-v3.azurewebsites.net/api/cities

# Should return images list
curl https://southbnd-functions-v3.azurewebsites.net/api/list-images
```

Then visit: https://southbnd.co.za
- Check browser console (should have no errors)
- Verify images load correctly
- Test route builder functionality

## 📋 Files Changed

### Configuration Files
- `.github/workflows/azure-static-web-apps-victorious-sky-0cd1be11e.yml` (renamed & updated)
- `.env.local` (container name, API URL cleanup)
- `next.config.ts` (added documentation)

### New Files Created
- `functions/routes/function.json`
- `functions/routes-by-id/function.json`
- `DEPLOYMENT_NOTES.md` (detailed deployment guide)
- `FIXES_APPLIED.md` (this file)

### Build Artifacts
- `functions/dist/` (TypeScript compiled successfully)

## 🔍 What Was Wrong?

### Root Causes Identified:

1. **Deployment to wrong Azure resource** → Code wasn't reaching production site
2. **Container name typo** → Functions couldn't find images (404/500 errors)
3. **Conflicting API URLs** → Unpredictable routing behavior
4. **Missing function.json** → Azure Portal couldn't see routes endpoints
5. **Static export + dynamic routes** → Hub pages returning 404

All configuration issues are now resolved. The functions just need to be redeployed with the corrected settings.

## 💡 Recommendations

### Images Strategy
✅ **Current approach is good**: Hybrid storage (Azure Blob + external URLs)
- New uploads go to Azure Blob Storage
- Keep legacy Unsplash/TripAdvisor URLs
- Migrate images only when editing content

### Hub Routes
⚠️ **Current limitation**: Dynamic hub routes won't work with static export
- Options documented in `DEPLOYMENT_NOTES.md`
- Can migrate to Azure App Service later if needed
- Static hub pages work fine

### Environment Variables
📝 **Remember to sync**:
- `.env.local` (local dev)
- `functions/local.settings.json` (local functions)
- Azure Static Web App config (production frontend)
- Azure Function App config (production backend)

## ✅ Ready to Deploy!

All configuration issues are fixed. Follow steps 1-4 above to get everything working in production.
