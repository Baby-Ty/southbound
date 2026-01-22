# Deployment Status - Curated Templates Fix

## ✅ Completed

### 1. Root Cause Identified
- **SSL certificate error** on `api.southbnd.co.za` was blocking trip-templates API calls
- Other APIs work because they use local Next.js routes (same domain)

### 2. Code Fixes Made
- ✅ Fixed CORS headers in `functions/trip-templates/index.ts`
- ✅ Updated `src/lib/api.ts` to use direct Azure URL: `southbnd-functions.azurewebsites.net`
- ✅ Fixed `.funcignore` to not exclude `dist/` folder
- ✅ Built functions (`functions/dist/`)
- ✅ Built frontend (`out/`)
- ✅ Committed and pushed to GitHub

### 3. Deployments
- ✅ Functions deployment command executed successfully
- ✅ Frontend pushed to GitHub (should auto-deploy via GitHub Actions)
- ❌ Functions not registering in Azure (404 errors)

## ⚠️ Current Issue

**Functions deployed but not registering:**
- Deployment says "successful" but `func azure functionapp list-functions` returns empty
- API endpoints return 404
- Functions App homepage loads (200) but no functions are available

## 🔧 Possible Solutions

### Option 1: Azure Portal Manual Check
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **southbnd-functions** Function App
3. Check **Functions** menu → See if any functions are listed
4. If not, try **Restart** the Function App
5. Check **Configuration** → Ensure runtime is set to Node.js

### Option 2: Fix Package Structure
The issue might be with the `dist/` folder structure. Try:
```powershell
cd functions
# Update package.json main to point to dist/index.js (already done)
# Redeploy
func azure functionapp publish southbnd-functions
```

### Option 3: Use Azure Portal Deployment
1. Zip the `functions/dist/` folder contents
2. Go to Azure Portal → southbnd-functions → Deployment Center
3. Upload ZIP directly

### Option 4: Verify App Settings
Ensure environment variables are set in Azure:
- `COSMOSDB_ENDPOINT`
- `COSMOSDB_KEY`
- `COSMOSDB_DATABASE`
- `UNSPLASH_ACCESS_KEY` (optional)

## 📋 Testing Once Functions Work

Once functions are properly deployed and registered:

### Test API Directly:
```bash
https://southbnd-functions.azurewebsites.net/api/trip-templates?curated=true&enabled=true
```

Should return JSON with templates array.

### Test Live Site:
```bash
https://southbnd.co.za
```

Homepage should display 4 curated template cards without SSL errors!

## 🎯 What the Fix Will Do

Once deployed:
1. ✅ **No more SSL errors** - Using direct Azure Functions URL with valid certificate
2. ✅ **Curated templates load** - trip-templates endpoint will work
3. ✅ **Homepage displays cards** - No more "Failed to fetch curated templates" error
4. ✅ **Proper CORS** - All origins handled correctly

## Files Changed (Already Committed)

```
functions/trip-templates/index.ts   - CORS fix
functions/.funcignore                - Removed dist exclusion  
src/lib/api.ts                       - SSL fix (use direct Azure URL)
DEPLOY_FIX_NOW.md                    - Deployment instructions
DNS_FIX_INSTRUCTIONS.md              - DNS configuration guide
REDEPLOY_INSTRUCTIONS.md             - Alternative deployment methods
```

## Next Steps

1. **Check Azure Portal** to see function status
2. **Restart Functions App** if needed
3. **Wait for GitHub Actions** to deploy frontend (check Actions tab)
4. **Test** live site once both are deployed

## Support

If functions still don't register after restart:
- Check Azure Portal logs: southbnd-functions → Log stream
- Verify App Settings have required environment variables
- Consider redeploying from portal directly

The frontend fix is solid and will work as soon as the Functions App is running properly!
