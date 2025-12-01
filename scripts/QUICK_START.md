# Quick Start Guide - Azure Deployment

This guide will help you quickly set up Azure resources and configure GitHub for automated deployment.

## Prerequisites

1. **Azure CLI** installed and logged in
   ```powershell
   az login
   ```

2. **GitHub CLI** installed and authenticated (optional, for automated secret setup)
   ```powershell
   gh auth login
   ```

## Step 1: Create Azure Resources

Run the PowerShell script to create all Azure resources:

```powershell
.\scripts\create-azure-resources.ps1
```

This will create:
- Resource Group: `southbound-rg`
- App Service Plan: `southbound-plan`
- Web App: `southbound-app`
- Functions App: `southbound-functions`
- Storage Account (if needed)

**Note**: The script will save publish profiles to:
- `webapp-publish-profile.xml`
- `functions-publish-profile.xml`

## Step 2: Configure GitHub Secrets

### Option A: Automated (with GitHub CLI)

```powershell
.\scripts\configure-github-secrets.ps1
```

This will automatically:
- Get publish profiles from Azure
- Set GitHub secrets:
  - `AZURE_WEBAPP_PUBLISH_PROFILE`
  - `AZURE_FUNCTIONS_PUBLISH_PROFILE`
  - `AZURE_WEBAPP_NAME`
  - `AZURE_FUNCTIONS_NAME`

### Option B: Manual

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each:

   **AZURE_WEBAPP_PUBLISH_PROFILE**
   - Get from Azure Portal → Web App → **Get publish profile**
   - Copy entire XML content
   - Paste as secret value

   **AZURE_FUNCTIONS_PUBLISH_PROFILE**
   - Get from Azure Portal → Functions App → **Get publish profile**
   - Copy entire XML content
   - Paste as secret value

   **AZURE_WEBAPP_NAME**
   - Value: `southbound-app` (or your Web App name)

   **AZURE_FUNCTIONS_NAME**
   - Value: `southbound-functions` (or your Functions App name)

## Step 3: Configure Environment Variables

### Option A: Interactive Script

```powershell
.\scripts\configure-azure-env-vars.ps1
```

### Option B: Manual in Azure Portal

**Web App** (Azure Portal → Web App → Configuration → Application settings):
- `NEXT_PUBLIC_SANITY_PROJECT_ID` = your-project-id
- `NEXT_PUBLIC_SANITY_DATASET` = production
- `NEXT_PUBLIC_FUNCTIONS_URL` = https://southbound-functions.azurewebsites.net

**Functions App** (Azure Portal → Functions App → Configuration → Application settings):
- `COSMOSDB_ENDPOINT` = https://southbound-cosmos-1183.documents.azure.com:443/
- `COSMOSDB_KEY` = your-cosmosdb-key
- `COSMOSDB_DATABASE_ID` = southbound
- `AZURE_STORAGE_CONNECTION_STRING` = your-storage-connection-string
- `AZURE_STORAGE_CONTAINER_NAME` = southbound-images
- `OPENAI_API_KEY` = your-openai-key
- `UNSPLASH_ACCESS_KEY` = your-unsplash-key

## Step 4: Configure CORS

Azure Portal → Functions App → **CORS**
- Add allowed origins:
  - `https://southbnd.co.za`
  - `https://www.southbnd.co.za`
  - `http://localhost:3000` (for local testing)
- Remove wildcard `*`
- Click **Save**

## Step 5: Test Deployment

Push to master branch:

```powershell
git add .
git commit -m "Configure Azure deployment"
git push origin master
```

Check GitHub Actions:
- Go to your repository → **Actions** tab
- Watch both workflows run:
  - `Deploy to Azure Web App`
  - `Deploy to Azure Functions`

## Step 6: Configure Custom Domains (After Initial Deployment)

See `AZURE_WEBAPP_DEPLOYMENT.md` for detailed custom domain setup.

## Troubleshooting

### Scripts fail with "not found" errors
- Make sure Azure CLI is installed: `az --version`
- Make sure you're logged in: `az account show`
- Verify resource names match your Azure resources

### GitHub secrets not setting
- Make sure GitHub CLI is installed: `gh --version`
- Make sure you're authenticated: `gh auth status`
- Or set secrets manually in GitHub web interface

### Deployment fails
- Check GitHub Actions logs for errors
- Verify publish profiles are correct
- Verify environment variables are set in Azure Portal

## Next Steps

After resources are created and configured:
1. Configure custom domains (southbnd.co.za and api.southbnd.co.za)
2. Set up DNS in GoDaddy
3. Enable SSL certificates
4. Test all features

See `AZURE_WEBAPP_DEPLOYMENT.md` for complete deployment guide.


