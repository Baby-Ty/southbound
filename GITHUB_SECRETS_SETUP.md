# GitHub Secrets Setup Guide

The Azure resources have been created successfully! Now you need to configure GitHub secrets for automated deployment.

## Azure Resources Created

✅ **Resource Group**: `southbound-rg`  
✅ **Web App**: `southbound-app` (https://southbound-app.azurewebsites.net)  
✅ **Functions App**: `southbound-functions` (https://southbound-functions.azurewebsites.net)  
✅ **Publish Profiles**: Saved to `webapp-publish-profile.xml` and `functions-publish-profile.xml`

## Step 1: Get Publish Profiles

The publish profiles have been saved to your project directory. You can also get them from Azure Portal:

### Web App Publish Profile
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **southbound-app** → **Get publish profile**
3. Download the file (or copy XML content)

### Functions App Publish Profile
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **southbound-functions** → **Get publish profile**
3. Download the file (or copy XML content)

## Step 2: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of the following:

### Secret 1: AZURE_WEBAPP_PUBLISH_PROFILE
- **Name**: `AZURE_WEBAPP_PUBLISH_PROFILE`
- **Value**: Open `webapp-publish-profile.xml` and copy the **entire XML content** (all of it)
- Click **Add secret**

### Secret 2: AZURE_FUNCTIONS_PUBLISH_PROFILE
- **Name**: `AZURE_FUNCTIONS_PUBLISH_PROFILE`
- **Value**: Open `functions-publish-profile.xml` and copy the **entire XML content** (all of it)
- Click **Add secret**

### Secret 3: AZURE_WEBAPP_NAME
- **Name**: `AZURE_WEBAPP_NAME`
- **Value**: `southbound-app`
- Click **Add secret**

### Secret 4: AZURE_FUNCTIONS_NAME
- **Name**: `AZURE_FUNCTIONS_NAME`
- **Value**: `southbound-functions`
- Click **Add secret**

## Step 3: Verify Secrets

After adding all secrets, you should see 4 secrets listed:
- ✅ AZURE_WEBAPP_PUBLISH_PROFILE
- ✅ AZURE_FUNCTIONS_PUBLISH_PROFILE
- ✅ AZURE_WEBAPP_NAME
- ✅ AZURE_FUNCTIONS_NAME

## Next Steps

After GitHub secrets are configured:

1. **Configure Environment Variables** in Azure Portal (see `scripts/configure-azure-env-vars.ps1` or Azure Portal)
2. **Configure CORS** in Functions App
3. **Push to master** to trigger deployment
4. **Configure custom domains** (southbnd.co.za and api.southbnd.co.za)

## Troubleshooting

### Can't find publish profile files?
Run this command to regenerate them:
```powershell
az webapp deployment list-publishing-profiles --name southbound-app --resource-group southbound-rg --xml > webapp-publish-profile.xml
az functionapp deployment list-publishing-profiles --name southbound-functions --resource-group southbound-rg --xml > functions-publish-profile.xml
```

### Secrets not working?
- Make sure you copied the **entire XML content** (including `<publishData>` tags)
- Verify secret names match exactly (case-sensitive)
- Check GitHub Actions logs for specific errors

