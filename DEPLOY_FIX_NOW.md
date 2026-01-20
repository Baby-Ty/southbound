# Deploy Fix for "Failed to fetch curated templates" Error

## Root Cause
The error occurs because `api.southbnd.co.za` has an **invalid SSL certificate** (`NET::ERR_CERT_COMMON_NAME_INVALID`).

### Why Some APIs Work and Others Don't
- ✅ **Countries API** uses local Next.js routes (`/api/countries`) - same domain, valid SSL
- ❌ **Trip Templates API** tries to use `api.southbnd.co.za` - custom domain with invalid SSL cert

## What I've Fixed

### 1. ✅ Fixed CORS Headers in Azure Functions
Updated `functions/trip-templates/index.ts` to properly handle CORS with origin parameter.

### 2. ✅ Fixed API URL Routing  
Updated `src/lib/api.ts` to use direct Azure Functions URL instead of custom domain:
- **Old**: `https://api.southbnd.co.za` (❌ invalid SSL)
- **New**: `https://southbnd-functions.azurewebsites.net` (✅ valid SSL)

### 3. ✅ Built Everything
- Functions compiled: `functions/dist/`
- Frontend built: `out/` directory

## Deploy Steps

### Step 1: Deploy Azure Functions

**Option A - Azure CLI (Fastest)**
```powershell
# Login first
az login

# Deploy functions
cd functions
func azure functionapp publish southbnd-functions
```

**Option B - Get Fresh Publish Profile**
1. Go to Azure Portal: https://portal.azure.com
2. Open **southbnd-functions** Function App
3. Click **Get publish profile** (top toolbar)
4. Replace `functions-publish-profile-new.xml` with downloaded file
5. Run from project root:
   ```powershell
   .\deploy-now.ps1
   ```

### Step 2: Deploy Frontend

Your frontend is already built in the `out/` directory. Deploy using your existing process:

**If using Azure Static Web Apps:**
```bash
# Check if you have SWA CLI
swa deploy

# Or use your GitHub Actions workflow
git add .
git commit -m "Fix curated templates SSL error"
git push
```

**If using Azure App Service:**
```powershell
# Use your existing deployment method
# The built static files are in ./out/
```

### Step 3: Test

After both deployments complete (wait 1-2 minutes):

1. **Test API directly:**
   ```bash
   https://southbnd-functions.azurewebsites.net/api/trip-templates?curated=true&enabled=true
   ```
   Should return JSON with curated templates.

2. **Test live site:**
   ```bash
   https://southbnd.co.za
   ```
   Should show 4 curated template cards without console errors!

## Files Changed

### Functions:
- `functions/trip-templates/index.ts` - Fixed CORS headers
- `functions/dist/trip-templates/index.js` - Compiled output

### Frontend:
- `src/lib/api.ts` - Changed API URL from `api.southbnd.co.za` to `southbnd-functions.azurewebsites.net`
- `out/` - Built static site

## Optional: Fix SSL for Custom Domain (Future)

If you want to use `api.southbnd.co.za` in the future:

1. **Add Custom Domain in Azure Functions:**
   - Azure Portal → southbnd-functions → Settings → Custom domains
   - Add: `api.southbnd.co.za`
   - Validate DNS (already points correctly)

2. **Enable SSL:**
   - Use **Azure managed certificate** (free)
   - Or upload your own SSL certificate

3. **Update API code:**
   - Change back to `api.southbnd.co.za` in `src/lib/api.ts`
   - Redeploy frontend

But for now, using the direct `.azurewebsites.net` URL will work perfectly!

## Quick Deployment Checklist

- [ ] Deploy Functions (Azure CLI or publish profile)
- [ ] Deploy Frontend (your existing method)
- [ ] Wait 1-2 minutes for deployment
- [ ] Test API endpoint directly
- [ ] Test live site homepage
- [ ] Verify no console errors
- [ ] Verify 4 curated cards display

## Summary

The issue was **SSL certificate mismatch** on the custom domain. I've fixed it by:
1. Using the direct Azure Functions URL (valid SSL)
2. Fixed CORS headers in the trip-templates function
3. Built both functions and frontend

You just need to deploy both using your existing deployment methods!
