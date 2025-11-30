# Azure Web App + Functions Deployment Guide

This guide explains how to deploy your Next.js app to Azure Web App and migrate API routes to Azure Functions.

## Architecture Overview

- **Azure Web App**: Hosts Next.js frontend at `southbnd.co.za`
- **Azure Functions**: Hosts all API routes at `api.southbnd.co.za`
- **Frontend**: Calls Functions directly (no Next.js API routes in production)

## Current Setup

Your app is currently deployed to **GitHub Pages** (static export). The new architecture uses:
- Azure Web App for the frontend
- Azure Functions for all backend APIs (serverless, auto-scaling)

## Prerequisites

1. Azure account with an active subscription
2. Azure Web App created (or create one via Azure Portal)
3. Your code pushed to GitHub

## Step 1: Create Azure Web App

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **Create a resource** → **Web App**
3. Fill in:
   - **Name**: `southbound-app` (or your preferred name)
   - **Runtime stack**: Node.js 20 LTS
   - **Operating System**: Linux (recommended) or Windows
   - **Region**: Choose closest to your users
4. Click **Review + create** → **Create**

## Step 2: Create Azure Functions App

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **Create a resource** → **Function App**
3. Fill in:
   - **Name**: `southbound-functions` (or your preferred name)
   - **Runtime stack**: Node.js 20 LTS
   - **Operating System**: Linux (recommended)
   - **Region**: Same as Web App
   - **Plan**: Consumption (serverless) or App Service Plan
   - **Storage Account**: Use existing or create new
4. Click **Review + create** → **Create**

## Step 3: Configure Environment Variables

### Azure Web App (Frontend Only)

1. In Azure Portal, go to your **Web App**
2. Navigate to **Configuration** → **Application settings**
3. Add these variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID = your-project-id
NEXT_PUBLIC_SANITY_DATASET = production
NEXT_PUBLIC_FUNCTIONS_URL = https://api.southbnd.co.za
```

### Azure Functions App (Backend APIs)

1. In Azure Portal, go to your **Functions App**
2. Navigate to **Configuration** → **Application settings**
3. Add these variables:

```
COSMOSDB_ENDPOINT = https://southbound-cosmos-1183.documents.azure.com:443/
COSMOSDB_KEY = your-cosmosdb-key-here
COSMOSDB_DATABASE_ID = southbound
AZURE_STORAGE_CONNECTION_STRING = your-connection-string-here
AZURE_STORAGE_CONTAINER_NAME = southbound-images
OPENAI_API_KEY = your-openai-api-key-here
UNSPLASH_ACCESS_KEY = your-unsplash-access-key-here
```

**Important Notes:**
- Variable names are **case-sensitive**
- No spaces around the `=` sign
- Click **Save** after adding all variables
- Azure will restart your apps automatically
- **Functions App** needs all backend secrets, **Web App** only needs public vars

## Step 3: Get Your Credentials

### CosmosDB Credentials
1. Azure Portal → **Cosmos DB** → Your account (`southbound-cosmos-1183`)
2. **Keys** section
3. Copy **URI** and **Primary Key**

### Azure Storage Credentials
1. Azure Portal → **Storage Account** → Your account
2. **Access Keys** section
3. Copy **Connection String** (from key1 or key2)

### OpenAI API Key
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create or copy your API key

### Unsplash Access Key
1. Go to [unsplash.com/developers](https://unsplash.com/developers)
2. Copy your Access Key

## Step 4: Configure CORS in Functions App

1. Azure Portal → Your Functions App → **CORS**
2. Add allowed origins:
   - `https://southbnd.co.za`
   - `https://www.southbnd.co.za`
   - `http://localhost:3000` (for local testing)
3. Remove wildcard `*` for production security
4. Click **Save**

## Step 5: Configure Custom Domains

### Web App Domain (southbnd.co.za)

1. Azure Portal → Your Web App → **Custom domains**
2. Click **Add custom domain**
3. Enter: `southbnd.co.za`
4. Follow DNS verification steps
5. Note the IP addresses for A records

### Functions App Domain (api.southbnd.co.za)

1. Azure Portal → Your Functions App → **Custom domains**
2. Click **Add custom domain**
3. Enter: `api.southbnd.co.za`
4. Follow DNS verification steps
5. Note the CNAME target

## Step 6: Configure DNS in GoDaddy

1. GoDaddy → DNS Management for southbnd.co.za
2. Add/Update records:
   - **A Record**: `@` → Azure Web App IP addresses (2 IPs)
   - **CNAME**: `www` → `southbound-app.azurewebsites.net`
   - **CNAME**: `api` → `southbound-functions.azurewebsites.net`
   - **TXT Records**: Azure verification records
3. Wait for DNS propagation (15 minutes to 48 hours)

## Step 7: Enable SSL Certificates

### Web App SSL
1. Azure Portal → Web App → **Custom domains** → **SSL bindings**
2. Click **Add SSL binding**
3. Select: `southbnd.co.za`
4. Certificate: **Create App Service Managed Certificate** (free)
5. Enable **HTTPS Only**

### Functions App SSL
1. Azure Portal → Functions App → **Custom domains** → **SSL bindings**
2. Click **Add SSL binding**
3. Select: `api.southbnd.co.za`
4. Certificate: **Create App Service Managed Certificate** (free)
5. Enable **HTTPS Only**

## Step 8: Deployment Options

### Option A: GitHub Actions (Recommended)

Two workflows are already created:
- `.github/workflows/azure-webapp-deploy.yml` - Deploys Web App
- `.github/workflows/azure-functions-deploy.yml` - Deploys Functions

**To configure GitHub Secrets:**

```yaml
name: Deploy to Azure Web App

on:
  push:
    branches: [ master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Azure Web App
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'your-app-name'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: .
```

**To get the publish profiles:**
1. Azure Portal → Your Web App → **Get publish profile** → Copy XML
2. Azure Portal → Your Functions App → **Get publish profile** → Copy XML
3. GitHub → Your repo → **Settings** → **Secrets and variables** → **Actions**
4. Add secrets:
   - `AZURE_WEBAPP_PUBLISH_PROFILE` (Web App publish profile XML)
   - `AZURE_FUNCTIONS_PUBLISH_PROFILE` (Functions App publish profile XML)
   - `AZURE_WEBAPP_NAME` (your Web App name, e.g., `southbound-app`)
   - `AZURE_FUNCTIONS_NAME` (your Functions App name, e.g., `southbound-functions`)

### Option B: Azure CLI

```bash
# Login to Azure
az login

# Deploy from local
az webapp up --name your-app-name --resource-group your-resource-group
```

### Option C: VS Code Azure Extension

1. Install **Azure App Service** extension in VS Code
2. Right-click your project → **Deploy to Web App**
3. Select your Azure Web App

## Step 9: Verify Deployment

1. Visit your Azure Web App URL: `https://your-app-name.azurewebsites.net`
2. Visit your Functions App URL: `https://your-functions-name.azurewebsites.net/api/cities`
3. Test custom domains:
   - `https://southbnd.co.za` (Web App)
   - `https://api.southbnd.co.za/api/cities` (Functions)
4. Test features that require API keys:
   - Hub image search (Unsplash) - calls Functions
   - Image generation (OpenAI) - calls Functions
   - City data loading (CosmosDB) - calls Functions
   - Image uploads (Azure Storage) - calls Functions
   - Route builder save/load - calls Functions
5. Check browser console for CORS errors (should be none)

## Important Differences from GitHub Pages

### GitHub Pages (Current)
- Static export only (`next export`)
- No server-side features
- No API routes
- Environment variables set in GitHub Actions secrets (if needed)

### Azure Web App + Functions (New)
- **Web App**: Full Next.js server support, SSR, static pages
- **Functions**: All API routes run serverless (`/api/*`)
- **Benefits**: Independent scaling, cost optimization, true serverless
- **Environment Variables**: Split between Web App (frontend) and Functions (backend)
- **Custom Domains**: Web App at `southbnd.co.za`, Functions at `api.southbnd.co.za`

## Troubleshooting

### Environment Variables Not Working
- Check variable names match exactly (case-sensitive)
- Restart the Web App after adding variables
- Check **Log stream** in Azure Portal for errors
- Verify variables are in **Application settings**, not **Connection strings**

### Build Failures
- Check **Deployment Center** → **Logs** for build errors
- Ensure `package.json` has correct build script
- Verify Node.js version matches (20 LTS)

### API Routes Not Working
- Check Functions App is deployed and running
- Verify `NEXT_PUBLIC_FUNCTIONS_URL` is set correctly in Web App
- Check Functions App logs for errors
- Verify CORS is configured in Functions App
- Test Functions endpoint directly: `https://api.southbnd.co.za/api/cities`

### Functions Not Deploying
- Check GitHub Actions logs for Functions workflow
- Verify `AZURE_FUNCTIONS_PUBLISH_PROFILE` secret is correct
- Ensure Functions code is in `functions/` directory
- Check Functions App → **Deployment Center** → **Logs**

## Security Best Practices

1. **Never commit secrets** to GitHub
2. **Use Azure Key Vault** for sensitive credentials (optional but recommended)
3. **Rotate keys regularly**
4. **Use separate keys** for development and production
5. **Enable HTTPS only** in Azure Web App settings

## Next Steps

1. Create Azure Web App and Functions App
2. Set up environment variables in both Azure resources
3. Configure GitHub Secrets for deployment
4. Configure CORS in Functions App
5. Set up custom domains (southbnd.co.za and api.southbnd.co.za)
6. Configure DNS in GoDaddy
7. Enable SSL certificates for both domains
8. Test deployment and all features
9. Monitor Functions usage and costs

## Architecture Benefits

- **Serverless Functions**: Pay only for execution time, auto-scales
- **Independent Scaling**: Web App and Functions scale separately
- **Cost Optimization**: Can use cheaper Web App tier (Basic) since no API processing
- **Better Performance**: Functions can be deployed closer to users
- **Separation of Concerns**: Frontend and backend clearly separated

## Additional Resources

- [Azure Web App Documentation](https://docs.microsoft.com/azure/app-service/)
- [Next.js on Azure](https://learn.microsoft.com/azure/developer/javascript/how-to/with-web-app/nextjs/overview)
- [Environment Variables in Azure](https://docs.microsoft.com/azure/app-service/configure-common)

