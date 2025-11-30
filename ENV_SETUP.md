# Environment Variables Setup Guide

This guide explains where to set up API keys and credentials for the Southbnd application.

## Architecture Overview

The application uses a split architecture:
- **Azure Web App**: Hosts the Next.js frontend (southbnd.co.za)
- **Azure Functions**: Hosts all API routes (api.southbnd.co.za)

## Required Environment Variables

### For Local Development (.env.local)

Create a `.env.local` file in the project root directory:

```env
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production

# Azure Functions URL (for local dev, use /api; for production, use https://api.southbnd.co.za)
NEXT_PUBLIC_FUNCTIONS_URL=/api

# CosmosDB Configuration (used by Functions)
COSMOSDB_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOSDB_KEY=your-cosmosdb-key-here
COSMOSDB_DATABASE_ID=southbound

# Azure Blob Storage Configuration (used by Functions)
AZURE_STORAGE_CONNECTION_STRING=your-connection-string-here
AZURE_STORAGE_CONTAINER_NAME=southbound-images

# OpenAI Configuration (used by Functions)
OPENAI_API_KEY=your-openai-api-key-here

# Unsplash Configuration (used by Functions)
UNSPLASH_ACCESS_KEY=your-unsplash-access-key-here
```

**Note**: For local development, API routes still work via Next.js `/api` routes. Set `NEXT_PUBLIC_FUNCTIONS_URL=/api` to use local routes.

## Quick Setup Scripts

We provide PowerShell scripts to help you set up these variables:

### CosmosDB Setup
```powershell
.\get-cosmos-credentials.ps1
```
This will output your CosmosDB credentials. Copy them to `.env.local`.

### Azure Storage Setup
```powershell
.\scripts\add-azure-env.ps1
```
This will prompt you for your Azure Storage connection string and add it to `.env.local`.

### Unsplash Setup
```powershell
.\scripts\add-unsplash-env.ps1
```
This will prompt you for your Unsplash access key and add it to `.env.local`.

## Detailed Setup Instructions

### 1. Sanity CMS

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project (or create a new one)
3. Copy the **Project ID** from the project settings
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

### 2. CosmosDB (Azure)

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Cosmos DB account
3. Go to **Keys** section
4. Copy:
   - **URI** → This is your `COSMOSDB_ENDPOINT`
   - **Primary Key** → This is your `COSMOSDB_KEY`
5. Add to `.env.local`:
   ```
   COSMOSDB_ENDPOINT=https://your-account.documents.azure.com:443/
   COSMOSDB_KEY=your-primary-key-here
   COSMOSDB_DATABASE_ID=southbound
   ```

### 3. Azure Blob Storage

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Storage Account
3. Go to **Access Keys** section
4. Copy the **Connection String** (from key1 or key2)
5. Add to `.env.local`:
   ```
   AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
   AZURE_STORAGE_CONTAINER_NAME=southbound-images
   ```

### 4. OpenAI API

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click **Create new secret key**
4. Copy the key (you won't be able to see it again!)
5. Add to `.env.local`:
   ```
   OPENAI_API_KEY=sk-...
   ```

**Note**: This is used for DALL-E image generation in the Hub. The app will show an error if missing, but will continue to work for other features.

### 5. Unsplash API

1. Go to [unsplash.com/developers](https://unsplash.com/developers)
2. Sign in or create an account
3. Click **New Application**
4. Fill out the application form
5. Accept the API use terms
6. Copy your **Access Key**
7. Add to `.env.local`:
   ```
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your-access-key-here
   ```

**Note**: The app will use default images if this key is not configured. The free tier includes 50 requests per hour.

## Important Notes

- **Never commit `.env.local` to git** - it's already in `.gitignore`
- **Restart your development server** after adding/changing environment variables
- **No spaces** around the `=` sign in `.env.local`
- **No quotes** around values (unless the value itself contains spaces)
- Variable names are **case-sensitive**

## Local vs Production (Azure Web App + Functions)

### Local Development
- Set environment variables in `.env.local` file on your machine
- API routes run via Next.js `/api` routes (no Functions needed locally)
- Set `NEXT_PUBLIC_FUNCTIONS_URL=/api` to use local routes
- `.env.local` is ignored by git and won't be committed

### Azure Web App (Production - Frontend Only)
- **Minimal environment variables** - only frontend/public vars
- Go to: Azure Portal → Your Web App → **Configuration** → **Application settings**
- Required variables:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET=production`
  - `NEXT_PUBLIC_FUNCTIONS_URL=https://api.southbnd.co.za` (or your Functions App URL)

### Azure Functions App (Production - Backend APIs)
- **All backend/secret variables** go here
- Go to: Azure Portal → Your Functions App → **Configuration** → **Application settings**
- Required variables:
  - `COSMOSDB_ENDPOINT`
  - `COSMOSDB_KEY`
  - `COSMOSDB_DATABASE_ID=southbound`
  - `AZURE_STORAGE_CONNECTION_STRING`
  - `AZURE_STORAGE_CONTAINER_NAME=southbound-images`
  - `OPENAI_API_KEY`
  - `UNSPLASH_ACCESS_KEY` (note: NOT `NEXT_PUBLIC_` prefix)
  - Email service credentials (if using SendGrid/Azure Communication Services)

**Important**: Your local `.env.local` file does NOT automatically sync to Azure. You need to manually add them in Azure Portal for both Web App and Functions App!

## Verifying Your Setup

After setting up your environment variables:

1. **Restart your dev server**: `npm run dev`
2. **Test CosmosDB**: Visit `/hub/destinations/cities` - cities should load
3. **Test Unsplash**: Try searching for images in the Hub - should show Unsplash results
4. **Test OpenAI**: Try generating an image in the Hub - should create DALL-E images
5. **Test Azure Storage**: Upload an image - should save to Azure Blob Storage

## Troubleshooting

### Variables not loading?
- Make sure the file is named exactly `.env.local` (not `.env.local.txt`)
- Check for typos in variable names
- Restart your terminal and dev server
- Make sure there are no spaces around `=`

### Still having issues?
- Check the console for specific error messages
- Verify your credentials are correct
- See `FIX_ENV.md` for more troubleshooting tips

