# Azure Blob Storage Setup Guide

## 🔧 Enable Public Access on Storage Account

The error `409 Public access is not permitted on this storage account` means you need to enable public blob access at the **storage account level**.

### Step 1: Enable Public Blob Access (Azure Portal)

1. **Go to Azure Portal**: https://portal.azure.com
2. **Navigate to your Storage Account**:
   - Search for `southboundimages214153` (or your storage account name)
   - Click on the storage account
3. **Open Configuration**:
   - In the left menu, under **Settings**, click **Configuration**
4. **Enable Public Access**:
   - Find **"Allow Blob public access"** setting
   - Change it from **"Disabled"** to **"Enabled"**
   - Click **"Save"** at the top

### Step 2: Set Container Access Level

1. **Go to Containers**:
   - In the left menu, under **Data storage**, click **Containers**
   - Click on `southbound-images` container
2. **Change Access Level**:
   - Click **"Change access level"** button at the top
   - Select **"Blob (anonymous read access for blobs only)"**
   - Click **"OK"**

### Step 3: Verify CORS Configuration

Run the CORS configuration script:

```bash
npm run configure-blob-cors
```

This will ensure CORS headers are properly configured for web browser access.

## ✅ Verification

After completing these steps, test by accessing a blob URL directly:

```
https://southboundimages214153.blob.core.windows.net/southbound-images/cities/amsterdam-1764449087299.jpg
```

You should be able to access the image without authentication.

## 🔒 Security Notes

- **Public blob access** allows anonymous read access to individual blobs via their URLs
- This is safe for public images (like city photos)
- Container listing remains private (users can't list all files)
- Consider restricting CORS origins in production to your domain(s)

## 🆘 Troubleshooting

### Still getting 409 error?
- Wait a few minutes after enabling public access (propagation delay)
- Verify the setting is actually saved in Azure Portal
- Check that you're using the correct storage account

### Images still not loading?
- Verify container access level is set to "Blob"
- Check CORS configuration: `npm run configure-blob-cors`
- Clear browser cache and try again

### Alternative: Azure CLI

If you have Azure CLI installed:

```bash
# Enable public blob access
az storage account update \
  --name southboundimages214153 \
  --resource-group <your-resource-group> \
  --allow-blob-public-access true

# Set container access level
az storage container set-permission \
  --name southbound-images \
  --public-access blob \
  --account-name southboundimages214153
```







