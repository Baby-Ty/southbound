# How to Redeploy Functions with Fresh Credentials

## Problem
The deployment script failed with `401 Unauthorized` because the publish credentials are expired.

## Solution

### Option 1: Download Fresh Publish Profile (Recommended)

1. Go to **Azure Portal**: https://portal.azure.com
2. Navigate to **southbnd-functions** Function App
3. Click **Get publish profile** (top menu)
4. Save the downloaded file as `functions-publish-profile-new.xml` in the project root
5. Run the deployment script:
   ```powershell
   .\deploy-now.ps1
   ```

### Option 2: Deploy via VS Code Extension

1. Install **Azure Functions** extension in VS Code
2. Sign in to Azure
3. Right-click `functions` folder
4. Select **Deploy to Function App**
5. Choose **southbnd-functions**

### Option 3: Deploy via Azure CLI

```bash
# Login to Azure
az login

# Deploy the functions
cd functions
func azure functionapp publish southbnd-functions
```

### Option 4: Manual Zip Deploy via Azure Portal

1. Ensure functions are built:
   ```powershell
   cd functions
   npm run build
   ```

2. Create a zip of the functions folder (excluding node_modules and .ts files):
   - Include: `dist/`, `host.json`, `package.json`, `package-lock.json`
   - Exclude: `node_modules/`, `*.ts`, `tsconfig.json`

3. Go to **Azure Portal** → **southbnd-functions** → **Development Tools** → **Advanced Tools (Kudu)**

4. Navigate to **Tools** → **Zip Push Deploy**

5. Drag and drop your zip file

## What I've Already Fixed

✅ Updated `functions/trip-templates/index.ts` with proper CORS headers
✅ Built the functions (compiled TypeScript to JavaScript)
✅ Verified DNS is pointing to correct Functions App

## After Successful Deployment

Test the endpoint:
```bash
# Test directly
curl https://api.southbnd.co.za/api/trip-templates?curated=true&enabled=true

# Or visit in browser
https://api.southbnd.co.za/api/trip-templates?curated=true&enabled=true
```

Then test your live site:
```
https://southbnd.co.za
```

The homepage should now display the 4 curated templates without errors!

## Files Changed
- `functions/trip-templates/index.ts` - Fixed CORS to properly handle origin parameter
- `functions/dist/trip-templates/index.js` - Compiled output (ready to deploy)
