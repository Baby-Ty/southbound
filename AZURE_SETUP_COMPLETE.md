# ✅ Azure Setup Complete!

## What Was Done

### 1. Azure Resources Created ✅
- ✅ **Resource Group**: `southbound-rg`
- ✅ **App Service Plan**: `southbound-plan` (Basic B1)
- ✅ **Web App**: `southbound-app`
  - URL: https://southbound-app.azurewebsites.net
  - Runtime: Node.js 20 LTS
- ✅ **Functions App**: `southbound-functions`
  - URL: https://southbound-functions.azurewebsites.net
  - Runtime: Node.js 20 LTS
- ✅ **Storage Account**: Using existing `southboundimages214153`

### 2. CORS Configured ✅
- ✅ Functions App CORS configured to allow:
  - `https://southbnd.co.za`
  - `https://www.southbnd.co.za`
  - `http://localhost:3000` (for local testing)

### 3. Publish Profiles Generated ✅
- ✅ `webapp-publish-profile.xml` - Saved locally
- ✅ `functions-publish-profile.xml` - Saved locally

## Next Steps

### Step 1: Configure GitHub Secrets (REQUIRED)

You need to add 4 secrets to your GitHub repository:

1. **Go to GitHub**: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions
2. **Add these secrets**:

   **AZURE_WEBAPP_PUBLISH_PROFILE**
   - Open `webapp-publish-profile.xml` in your project
   - Copy the **entire XML content** (all of it)
   - Paste as secret value

   **AZURE_FUNCTIONS_PUBLISH_PROFILE**
   - Open `functions-publish-profile.xml` in your project
   - Copy the **entire XML content** (all of it)
   - Paste as secret value

   **AZURE_WEBAPP_NAME**
   - Value: `southbound-app`

   **AZURE_FUNCTIONS_NAME**
   - Value: `southbound-functions`

**Quick helper**: Run `.\scripts\get-github-secrets.ps1` to see the content to copy

### Step 2: Configure Environment Variables

#### Web App (Azure Portal → southbound-app → Configuration → Application settings)

Add these variables:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_FUNCTIONS_URL=https://southbound-functions.azurewebsites.net
```

#### Functions App (Azure Portal → southbound-functions → Configuration → Application settings)

Add these variables:
```
COSMOSDB_ENDPOINT=https://southbound-cosmos-1183.documents.azure.com:443/
COSMOSDB_KEY=your-cosmosdb-key-here
COSMOSDB_DATABASE_ID=southbound
AZURE_STORAGE_CONNECTION_STRING=your-storage-connection-string
AZURE_STORAGE_CONTAINER_NAME=southbound-images
OPENAI_API_KEY=your-openai-api-key
UNSPLASH_ACCESS_KEY=your-unsplash-access-key
```

**Quick helper**: Run `.\scripts\configure-azure-env-vars.ps1` for interactive setup

### Step 3: Test Deployment

After GitHub secrets are configured:

```powershell
git add .
git commit -m "Configure Azure deployment"
git push origin master
```

Check GitHub Actions:
- Go to your repository → **Actions** tab
- Watch both workflows:
  - `Deploy to Azure Web App`
  - `Deploy to Azure Functions`

### Step 4: Configure Custom Domains (After Initial Deployment)

1. **Web App Domain** (`southbnd.co.za`)
   - Azure Portal → `southbound-app` → Custom domains
   - Add domain → `southbnd.co.za`
   - Follow DNS verification steps

2. **Functions App Domain** (`api.southbnd.co.za`)
   - Azure Portal → `southbound-functions` → Custom domains
   - Add domain → `api.southbnd.co.za`
   - Follow DNS verification steps

3. **Configure DNS in GoDaddy**
   - Add A records for `southbnd.co.za` (from Web App)
   - Add CNAME for `api` → `southbound-functions.azurewebsites.net`
   - Add TXT records for verification

4. **Enable SSL Certificates**
   - Both apps → Custom domains → SSL bindings
   - Create App Service Managed Certificate (free)
   - Enable HTTPS Only

## Current Status

✅ Azure resources created  
✅ CORS configured  
✅ GitHub workflows ready  
✅ Frontend code updated  
⏳ GitHub secrets need to be configured (manual step)  
⏳ Environment variables need to be set (manual step)  
⏳ Custom domains need to be configured (after deployment)

## Quick Reference

**Azure Portal Links**:
- Web App: https://portal.azure.com/#@/resource/subscriptions/19dcc571-9b58-4829-8f65-b38bf023f4f9/resourceGroups/southbound-rg/providers/Microsoft.Web/sites/southbound-app
- Functions App: https://portal.azure.com/#@/resource/subscriptions/19dcc571-9b58-4829-8f65-b38bf023f4f9/resourceGroups/southbound-rg/providers/Microsoft.Web/sites/southbound-functions

**Test URLs** (after deployment):
- Web App: https://southbound-app.azurewebsites.net
- Functions: https://southbound-functions.azurewebsites.net/api/cities

## Helpful Scripts

- `.\scripts\create-azure-resources.ps1` - Create Azure resources
- `.\scripts\configure-github-secrets.ps1` - Configure GitHub secrets (requires GitHub CLI)
- `.\scripts\get-github-secrets.ps1` - Display secrets to copy manually
- `.\scripts\configure-azure-env-vars.ps1` - Configure environment variables interactively

## Documentation

- `GITHUB_SECRETS_SETUP.md` - Detailed GitHub secrets setup
- `QUICK_START.md` - Quick start guide
- `AZURE_WEBAPP_DEPLOYMENT.md` - Complete deployment guide
- `ENV_SETUP.md` - Environment variables guide


