# Azure Hub Setup Checklist

## ✅ What's Configured

### Infrastructure
- ✅ Azure Web App: `southbound-app` 
- ✅ Azure Functions App: `southbound-functions`
- ✅ GitHub Secrets: All 4 secrets configured
- ✅ Deployment Workflow: `.github/workflows/azure-webapp-deploy.yml`

### Code Fixes
- ✅ Hub routes page now uses `apiUrl('routes')`
- ✅ Hub leads page now uses `apiUrl('leads')`
- ✅ All other Hub pages already use `apiUrl()`

### Azure Functions
- ✅ Cities endpoint created and deployed
- ✅ Leads endpoint created and deployed (GET, POST, PATCH, DELETE)
- ✅ All endpoints registered and working

## ⚠️ Required Environment Variables

### Azure Web App (`southbound-app`) - Hub Frontend

**Required:**
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_FUNCTIONS_URL=https://southbound-functions.azurewebsites.net
```

**Note:** `NEXT_PUBLIC_FUNCTIONS_URL` is set in the GitHub Actions workflow, but should also be set in Azure Portal for consistency.

### Azure Functions App (`southbound-functions`) - Backend APIs

**Required:**
```
COSMOSDB_ENDPOINT=https://southbound-cosmos-1183.documents.azure.com:443/
COSMOSDB_KEY=your-cosmosdb-primary-key
COSMOSDB_DATABASE_ID=southbound
AZURE_STORAGE_CONNECTION_STRING=your-storage-connection-string
AZURE_STORAGE_CONTAINER_NAME=southbound-images
OPENAI_API_KEY=your-openai-api-key
UNSPLASH_ACCESS_KEY=your-unsplash-access-key
```

## 📋 How to Verify Setup

### 1. Check Environment Variables in Azure Portal

**Web App:**
1. Go to Azure Portal → `southbound-app` → **Configuration** → **Application settings**
2. Verify these exist:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_FUNCTIONS_URL`

**Functions App:**
1. Go to Azure Portal → `southbound-functions` → **Configuration** → **Application settings**
2. Verify these exist:
   - `COSMOSDB_ENDPOINT`
   - `COSMOSDB_KEY`
   - `COSMOSDB_DATABASE_ID`
   - `AZURE_STORAGE_CONNECTION_STRING`
   - `AZURE_STORAGE_CONTAINER_NAME`
   - `OPENAI_API_KEY`
   - `UNSPLASH_ACCESS_KEY`

### 2. Test Hub Deployment

After pushing changes to `master`:
1. Check GitHub Actions: https://github.com/Baby-Ty/southbound/actions
2. Verify `Deploy to Azure Web App` workflow runs (only triggers on hub changes)
3. Visit Hub: `https://hub.southbnd.co.za` or `https://southbound-app.azurewebsites.net/hub`

### 3. Test Hub Features

- ✅ **Routes Page** (`/hub/routes`) - Should load routes from CosmosDB
- ✅ **Cities Page** (`/hub/destinations/cities`) - Should load cities from CosmosDB
- ✅ **Leads Page** (`/hub/leads`) - Full CRUD support via Azure Functions

## 🔧 Quick Setup Script

Use PowerShell script to configure environment variables:

```powershell
.\scripts\configure-azure-env-vars.ps1
```

Or manually set in Azure Portal (see steps above).

## 📝 Next Steps

1. ✅ Verify environment variables are set in Azure Portal
2. ✅ Push Hub code changes (already done)
3. ✅ Create leads Azure Function (completed!)
4. ✅ Deploy Azure Functions (completed!)
5. ⏳ Deploy Hub to Azure Web App (trigger deployment)
6. ⏳ Configure custom domain `hub.southbnd.co.za` in Azure Portal
7. ⏳ Test all Hub features after deployment

**See `NEXT_STEPS.md` for detailed instructions**

## 🔗 Useful Links

- **Azure Portal**: https://portal.azure.com
- **Web App**: https://portal.azure.com/#@/resource/subscriptions/19dcc571-9b58-4829-8f65-b38bf023f4f9/resourceGroups/southbound-rg/providers/Microsoft.Web/sites/southbound-app
- **Functions App**: https://portal.azure.com/#@/resource/subscriptions/19dcc571-9b58-4829-8f65-b38bf023f4f9/resourceGroups/southbound-rg/providers/Microsoft.Web/sites/southbound-functions
- **GitHub Actions**: https://github.com/Baby-Ty/southbound/actions

