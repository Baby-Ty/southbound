# CORS Fix for Azure Functions

## Problem
When editing highlights in trip options on the live site, API requests to `https://api.southbnd.co.za` fail with CORS errors:
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource
Reason: CORS request did not succeed. Status code: (null)
```

## Root Cause
Azure Functions requires CORS to be configured in **two places**:
1. ✅ **In code** - Functions handle CORS headers (already fixed)
2. ⚠️ **In Azure Portal** - Platform-level CORS configuration (needs to be done)

## Code Changes Made

### ✅ Updated Functions to Read Origin Header
- `functions/images-search/index.ts` - Now reads origin header and uses `getCorsHeaders(origin)`
- `functions/cities/index.ts` - Now reads origin header and uses `getCorsHeaders(origin)`

Both functions now properly:
- Read the `Origin` header from the request
- Use `getCorsHeaders(origin)` to return appropriate CORS headers
- Pass origin to `createCorsResponse()` for all responses

## Required: Azure Portal CORS Configuration

### Step 1: Enable CORS in Azure Functions App

1. **Go to Azure Portal**
   - Navigate to: https://portal.azure.com
   - Search for: `southbound-functions`
   - Click on the Functions App

2. **Open CORS Settings**
   - In the left sidebar, click **API** → **CORS**
   - Or go to **Configuration** → **CORS**

3. **Add Allowed Origins**
   Add these origins (one per line):
   ```
   https://southbnd.co.za
   https://hub.southbnd.co.za
   http://localhost:3000
   http://localhost:3001
   ```

4. **Save Configuration**
   - Click **Save** at the top
   - Wait for the app to restart (may take 1-2 minutes)

### Step 2: Verify CORS is Working

After saving, test the API:

```bash
# Test from command line (should return CORS headers)
curl -H "Origin: https://southbnd.co.za" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://api.southbnd.co.za/api/images-search?query=test

# Should return 204 with CORS headers
```

Or test in browser console:
```javascript
fetch('https://api.southbnd.co.za/api/images-search?query=test', {
  headers: { 'Origin': 'https://southbnd.co.za' }
})
.then(r => r.json())
.then(console.log)
```

## Why Both Are Needed

- **Azure Portal CORS**: Handles preflight OPTIONS requests at the platform level
- **Code CORS Headers**: Handles actual CORS headers in responses

If Azure Portal CORS is not configured, the preflight OPTIONS request fails before reaching your function code, resulting in the "CORS request did not succeed" error with null status code.

## Deployment

Since CORS is already configured in Azure Portal, you just need to deploy the updated function code:

### Option 1: Using Azure CLI (Recommended)

1. **Login to Azure CLI** (if not already logged in)
   ```bash
   az login
   ```

2. **Build and Deploy Functions**
   ```bash
   cd functions
   npm run build
   func azure functionapp publish southbound-functions --resource-group southbound-rg
   ```

### Option 2: Using Publish Profile (If you have one saved)

1. **Get publish profile from Azure Portal**
   - Go to Azure Portal → `southbound-functions` → **Get publish profile**
   - Download the `.PublishSettings` file
   - Save it as `functions-publish-profile.xml` in the project root

2. **Build Functions**
   ```bash
   cd functions
   npm run build
   ```

3. **Deploy using publish profile**
   ```bash
   func azure functionapp publish southbound-functions --publish-profile-path ../functions-publish-profile.xml
   ```

### Option 3: Deploy via Azure Portal (Manual Upload)

1. **Build Functions**
   ```bash
   cd functions
   npm run build
   ```

2. **Zip the deployment package**
   ```bash
   # On Windows PowerShell
   Compress-Archive -Path dist,host.json,package.json,package-lock.json -DestinationPath deploy.zip -Force
   ```

3. **Upload via Azure Portal**
   - Go to Azure Portal → `southbound-functions` → **Deployment Center**
   - Or use **Advanced Tools (Kudu)** → **Zip Push Deploy**

2. **Verify Deployment**
   - Check Functions logs in Azure Portal → `southbound-functions` → **Log stream**
   - Test image search from the live site (`https://southbnd.co.za`)
   - Open browser DevTools → Network tab → Verify no CORS errors
   - Check that requests return proper CORS headers

## What Changed in the Code

The functions now:
- ✅ Read the `Origin` header from incoming requests
- ✅ Use `getCorsHeaders(origin)` to return appropriate CORS headers
- ✅ Pass origin to all `createCorsResponse()` calls
- ✅ Handle OPTIONS preflight requests with proper CORS headers

This ensures that CORS headers match the requesting origin, which works together with Azure Portal CORS configuration.

## Troubleshooting

### Still Getting CORS Errors?

1. **Check Azure Portal CORS Settings**
   - Ensure origins are saved correctly
   - Ensure no typos (trailing slashes, http vs https)
   - Wait 2-3 minutes after saving for changes to propagate

2. **Check Function Logs**
   - Azure Portal → `southbound-functions` → **Log stream**
   - Look for CORS-related errors

3. **Verify Origin Header**
   - Check browser Network tab → Request Headers → `Origin`
   - Ensure it matches exactly what's in Azure Portal CORS settings

4. **Test Preflight Request**
   ```bash
   curl -v -X OPTIONS \
        -H "Origin: https://southbnd.co.za" \
        -H "Access-Control-Request-Method: GET" \
        https://api.southbnd.co.za/api/images-search
   ```
   Should return `204 No Content` with CORS headers

## Additional Notes

- The `host.json` `customHeaders` are not sufficient for CORS preflight requests
- Azure Functions v4 requires CORS to be configured in Azure Portal
- Code-level CORS headers are still needed for actual responses
- Both must be configured for CORS to work properly

