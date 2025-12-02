# Troubleshooting GitHub Actions Deployment Failures

## Common Azure Functions Deployment Failures

### Issue 1: Build Failure
**Symptoms:** TypeScript compilation errors

**Check:**
```bash
cd functions
npm run build
```

**Fix:** Ensure all imports are correct and types are properly exported.

### Issue 2: Authentication Failure (401 Unauthorized)
**Symptoms:** `Failed to acquire app settings... Unauthorized (CODE: 401)`

**Cause:** Publish profile expired or invalid

**Fix:**
1. Regenerate publish profile in Azure Portal:
   - Go to Azure Portal → `southbound-functions` → **Get publish profile**
   - Copy the XML content
2. Update GitHub secret:
   - Go to GitHub → Settings → Secrets → Actions
   - Update `AZURE_FUNCTIONS_PUBLISH_PROFILE` with new XML

### Issue 3: Missing Dependencies
**Symptoms:** Runtime errors about missing modules

**Check:** Verify `functions/dist/package.json` has correct dependencies after build

**Fix:** The workflow should handle this, but verify:
```bash
cd functions/dist
npm ci --omit=dev
```

### Issue 4: Package Structure Issues
**Symptoms:** Functions not found or not registered

**Check:** Verify `functions/dist/index.js` imports all functions:
- Should include `require("./leads/index")`
- Should include `require("./leads-by-id/index")`

### Issue 5: TypeScript Errors
**Symptoms:** Build step fails with type errors

**Common fixes:**
- Ensure all types are exported from shared modules
- Check import paths are correct
- Verify `tsconfig.json` includes all files

## How to Check GitHub Actions Logs

1. Go to: https://github.com/Baby-Ty/southbound/actions
2. Click on the failed workflow run (#23)
3. Expand the failed job
4. Look for error messages in red
5. Check the "Build Functions" step output
6. Check the "Deploy to Azure Functions" step output

## Quick Fixes

### Regenerate Publish Profile (PowerShell)
```powershell
az functionapp deployment list-publishing-profiles `
  --name southbound-functions `
  --resource-group southbound-rg `
  --xml > functions-publish-profile.xml

Get-Content functions-publish-profile.xml | gh secret set AZURE_FUNCTIONS_PUBLISH_PROFILE
```

### Test Build Locally
```bash
cd functions
npm ci
npm run build
cd dist
npm ci --omit=dev
```

### Verify Functions Are Registered
Check `functions/dist/index.js` should have:
```javascript
require("./leads/index");
require("./leads-by-id/index");
```

## Next Steps

1. **Check the actual error** from GitHub Actions run #23
2. **Share the error message** so we can provide specific fix
3. **Try re-running** the workflow if it was a transient issue

