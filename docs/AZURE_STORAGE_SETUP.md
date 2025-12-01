# Azure Blob Storage Setup Guide

This guide will help you set up Azure Blob Storage for storing DALL-E generated images.

## Prerequisites

- Azure account (free tier works)
- Azure CLI installed ([Download](https://docs.microsoft.com/cli/azure/install-azure-cli))

## Quick Setup (Automated)

### Windows (PowerShell)
```powershell
.\scripts\setup-azure-storage.ps1
```

### Mac/Linux (Bash)
```bash
chmod +x scripts/setup-azure-storage.sh
./scripts/setup-azure-storage.sh
```

## Manual Setup via Azure Portal

1. **Sign in to Azure Portal**
   - Go to [portal.azure.com](https://portal.azure.com)

2. **Create Resource Group**
   - Click "Create a resource" → Search "Resource group"
   - Name: `southbound-rg`
   - Region: Choose closest to you (e.g., East US)
   - Click "Create"

3. **Create Storage Account**
   - In your resource group, click "Create"
   - Search "Storage account"
   - Fill in:
     - **Name**: `southboundimages` + random numbers (must be globally unique, lowercase, 3-24 chars)
     - **Region**: Same as resource group
     - **Performance**: Standard
     - **Redundancy**: Locally-redundant storage (LRS)
   - Click "Review + create" → "Create"

4. **Create Container**
   - Go to your storage account
   - Click "Containers" in the left menu
   - Click "+ Container"
   - Name: `southbound-images`
   - Public access level: **Blob** (allows public read access)
   - Click "Create"

5. **Get Connection String**
   - In your storage account, go to "Access keys" in the left menu
   - Click "Show" next to "key1"
   - Copy the "Connection string" value

## Configure Environment Variables

Add these to your `.env.local` file:

```env
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=..."
AZURE_STORAGE_CONTAINER_NAME="southbound-images"
```

## Verify Setup

After setup, you can verify by:

1. Running the app: `npm run dev`
2. Going to `/hub/destinations/cities/[any-city]`
3. Using the "AI Image Generator" section
4. Generating and saving an image

The image should appear in your Azure Blob Storage container.

## Troubleshooting

### "Storage account name already exists"
- Storage account names must be globally unique
- Try adding random numbers: `southboundimages12345`

### "Container not found"
- Make sure the container name matches exactly: `southbound-images`
- Check it's set to "Blob" public access level

### Connection string issues
- Ensure you copied the full connection string (starts with `DefaultEndpointsProtocol=`)
- Check there are no extra spaces or quotes

### Images not uploading
- Verify `AZURE_STORAGE_CONNECTION_STRING` is set correctly
- Check Azure Portal → Storage Account → Containers to see if files appear
- Check browser console for errors

## Cost Estimate

Azure Blob Storage pricing (approximate):
- **Storage**: ~$0.0184 per GB/month (Hot tier)
- **Transactions**: First 10,000 free, then ~$0.004 per 10,000
- **Data transfer**: First 5GB free/month

For typical usage (hundreds of images), expect **<$1/month**.

## Security Notes

- The connection string gives full access to your storage account
- Keep `.env.local` in `.gitignore` (already done)
- Consider using Azure Key Vault for production
- Container is set to "Blob" public access - images will be publicly accessible via URL



