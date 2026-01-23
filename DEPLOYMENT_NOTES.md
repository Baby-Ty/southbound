# Deployment Notes - Configuration Fixes Applied

## Summary of Changes

This document outlines the configuration fixes applied to resolve API and image loading issues.

### Issues Fixed

1. **GitHub Workflow Deployment Target** ✓
   - Updated workflow to deploy to correct Static Web App: `victorious-sky-0cd1be11e`
   - Renamed workflow file from `azure-static-web-apps-ambitious-hill-0dfa6ee0f.yml` to `azure-static-web-apps-victorious-sky-0cd1be11e.yml`
   - Updated secret reference to `AZURE_STATIC_WEB_APPS_API_TOKEN_VICTORIOUS_SKY_0CD1BE11E`

2. **Azure Storage Container Name** ✓
   - Standardized to `southbound-images` (with dash) across all configs
   - Fixed `.env.local` to use `southbound-images` instead of `southboundimages`
   - `functions/local.settings.json` already correct

3. **Duplicate API URL Configuration** ✓
   - Removed duplicate `NEXT_PUBLIC_FUNCTIONS_URL` from `.env.local`
   - Single source of truth: `https://southbnd-functions-v3.azurewebsites.net`
   - Added comments for local development override

4. **Routes Function Registration** ✓
   - Created `functions/routes/function.json` for Azure Portal visibility
   - Created `functions/routes-by-id/function.json` for consistency
   - Functions already registered in `functions/index.ts`

## Current Status

### ✅ Completed
- All configuration files updated
- Functions built successfully
- Ready for deployment

### ⚠️ Requires Action

#### 1. Update GitHub Secret
Before deployment will work, update the GitHub secret:
- Go to: https://github.com/[your-repo]/settings/secrets/actions
- Add or update: `AZURE_STATIC_WEB_APPS_API_TOKEN_VICTORIOUS_SKY_0CD1BE11E`
- Get the deployment token from Azure Portal → Static Web App → victorious-sky-0cd1be11e → Manage deployment token

#### 2. Redeploy Azure Functions
The functions need to be redeployed with:
- New `function.json` files for routes endpoints
- Corrected `AZURE_STORAGE_CONTAINER_NAME=southbound-images` environment variable

**Option A: Trigger GitHub Workflow**
```bash
# Push changes to master branch
git add .
git commit -m "Fix API and image configuration"
git push origin master
```

**Option B: Manual Deployment**
```bash
cd functions
npm run build
# Then deploy via Azure Portal or Azure CLI
```

#### 3. Verify Azure Function App Environment Variables
In Azure Portal → Function App → Configuration, ensure:
```
AZURE_STORAGE_CONTAINER_NAME=southbound-images
AZURE_STORAGE_CONNECTION_STRING=[your-connection-string]
COSMOSDB_ENDPOINT=https://southbound-cosmos.documents.azure.com:443/
COSMOSDB_KEY=[your-key]
COSMOSDB_DATABASE_ID=southbound
```

#### 4. Verify Azure Blob Storage Container
Confirm in Azure Portal → Storage Account → Containers:
- Container name is `southbound-images` (with dash)
- Public access level is "Blob (anonymous read access for blobs only)"
- CORS rules allow origin: `https://southbnd.co.za`

## Known Limitations

### Hub Routes (/hub/*)
**Issue**: Static export does not support dynamic routes like `/hub/routes/[id]`

**Current Behavior**:
- `/hub` base routes work with authentication
- Dynamic routes (with `[id]`) return 404 in production
- Works locally when `DISABLE_STATIC_EXPORT=true`

**Solutions**:
- **Short-term**: Use hub for static management pages only
- **Long-term**: Deploy Next.js app to Azure App Service with SSR enabled for full hub functionality

### Image Storage Strategy
**Hybrid Approach** (recommended):
- New uploads → Azure Blob Storage ✓
- Legacy URLs → Keep as-is (Unsplash, TripAdvisor CDN)
- Migrate on-demand when editing content

**Migration Script** (optional):
```bash
# Preview migration
npm run migrate-images:dry

# Run migration (only if needed)
npm run migrate-images
```

## Testing After Deployment

### 1. Test API Endpoints
```bash
# Routes
curl https://southbnd-functions-v3.azurewebsites.net/api/routes

# Cities
curl https://southbnd-functions-v3.azurewebsites.net/api/cities

# Images
curl https://southbnd-functions-v3.azurewebsites.net/api/list-images
```

Expected: 200 OK with JSON data (not 404 or 500)

### 2. Test Static Web App
- Visit: https://southbnd.co.za
- Check browser console for errors
- Verify images load correctly
- Test route builder functionality

### 3. Test Image Upload
- Go to hub → Images
- Upload a test image
- Verify it's stored in Azure Blob Storage at: `https://[storage-account].blob.core.windows.net/southbound-images/[category]/[filename]`

## Deployment Checklist

- [ ] Update GitHub secret `AZURE_STATIC_WEB_APPS_API_TOKEN_VICTORIOUS_SKY_0CD1BE11E`
- [ ] Commit and push configuration changes
- [ ] Verify GitHub Actions workflow runs successfully
- [ ] Update Azure Function App environment variable `AZURE_STORAGE_CONTAINER_NAME`
- [ ] Redeploy Azure Functions (either via GitHub Actions or manual)
- [ ] Test API endpoints (should return 200, not 404/500)
- [ ] Test southbnd.co.za (no console errors)
- [ ] Verify image loading works
- [ ] Test image upload functionality

## Files Modified

1. `.github/workflows/azure-static-web-apps-victorious-sky-0cd1be11e.yml` (renamed and updated)
2. `.env.local` (container name, removed duplicate URL, added comments)
3. `next.config.ts` (added hub limitation documentation)
4. `functions/routes/function.json` (created)
5. `functions/routes-by-id/function.json` (created)

## Support

If issues persist after deployment:
1. Check Azure Function App logs in Azure Portal
2. Verify environment variables are set correctly
3. Check CORS configuration in Azure Functions
4. Verify blob storage container name and permissions
