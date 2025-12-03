# Deploy Updated Functions Code

The CORS fixes have been made to the function code. Here are several ways to deploy:

## ✅ Code Changes Made

- ✅ `functions/images-search/index.ts` - Now reads origin header and uses `getCorsHeaders(origin)`
- ✅ `functions/cities/index.ts` - Now reads origin header and uses `getCorsHeaders(origin)`
- ✅ Functions built successfully (`functions/dist/` contains compiled code)

## Deployment Options

### Option 1: Azure Portal Zip Deploy (Easiest)

**Method A: Direct API Endpoint (Recommended)**

1. **Go to Kudu** (you're already there!)
   - You should be at: `https://southbound-functions.scm.azurewebsites.net`

2. **Navigate to Zip Deploy**
   - In the URL bar, go to: `https://southbound-functions.scm.azurewebsites.net/api/zipdeploy`
   - Or click on **REST API** section → look for deployment endpoints

3. **Get credentials from publish profile**
   - Open `functions-publish-profile.xml` in a text editor
   - Find the profile with `publishMethod="ZipDeploy"`
   - Copy the `userName` and `userPWD` values

4. **Deploy using PowerShell** (run this from project root):
   ```powershell
   $publishProfile = [xml](Get-Content functions-publish-profile.xml)
   $zipProfile = $publishProfile.publishData.publishProfile | Where-Object { $_.publishMethod -eq "ZipDeploy" }
   $username = $zipProfile.userName
   $password = $zipProfile.userPWD
   $base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
   
   $headers = @{
       Authorization = "Basic $base64Auth"
   }
   
   Invoke-WebRequest -Uri "https://southbound-functions.scm.azurewebsites.net/api/zipdeploy" `
                     -Method POST `
                     -Headers $headers `
                     -InFile functions-deploy.zip `
                     -ContentType "application/zip"
   ```

**Method B: Via Azure Portal Deployment Center**

1. **Go to Azure Portal** → `southbound-functions` → **Deployment Center**
2. **Click "Manual deploy"** or **"OneDrive deploy"**
3. **Upload** `functions-deploy.zip`

3. **Verify Deployment**
   - Go back to Functions App → **Functions**
   - Check that `images-search` and `cities` functions are listed
   - Test: `https://api.southbnd.co.za/api/images-search?query=test`

### Option 2: Azure Portal Deployment Center

1. **Go to Azure Portal** → `southbound-functions` → **Deployment Center**

2. **Use External Git or Local Git**
   - If you have GitHub Actions set up, push your changes
   - Or use **Local Git** to push directly

### Option 3: Azure CLI Zip Deploy

If you have proper permissions:

```powershell
# Extract credentials from publish profile (or use Azure CLI login)
$publishProfile = [xml](Get-Content functions-publish-profile.xml)
$zipProfile = $publishProfile.publishData.publishProfile | Where-Object { $_.publishMethod -eq "ZipDeploy" }
$username = $zipProfile.userName
$password = $zipProfile.userPWD

# Deploy using curl or Invoke-WebRequest
$headers = @{
    Authorization = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
}
Invoke-WebRequest -Uri "https://southbound-functions.scm.azurewebsites.net/api/zipdeploy" -Method POST -Headers $headers -InFile functions-deploy.zip -ContentType "application/zip"
```

### Option 4: Manual File Upload via FTP

1. **Get FTP credentials** from Azure Portal → `southbound-functions` → **Get publish profile**
2. **Upload files** using an FTP client:
   - Upload `dist/` folder contents to `/site/wwwroot/`
   - Upload `host.json` to `/site/wwwroot/`
   - Upload `package.json` to `/site/wwwroot/`

## After Deployment

1. **Test the API**
   ```bash
   curl "https://api.southbnd.co.za/api/images-search?query=test"
   ```

2. **Check Function Logs**
   - Azure Portal → `southbound-functions` → **Log stream**
   - Look for any errors

3. **Test from Live Site**
   - Go to `https://southbnd.co.za`
   - Try editing a highlight in trip options
   - Check browser console for CORS errors (should be gone!)

## Troubleshooting

### Still Getting CORS Errors?

1. **Wait 2-3 minutes** after deployment for changes to propagate
2. **Clear browser cache** and hard refresh (Ctrl+Shift+R)
3. **Check Function Logs** in Azure Portal for errors
4. **Verify CORS origins** in Azure Portal → `southbound-functions` → **CORS**
   - Should include: `https://southbnd.co.za`, `https://www.southbnd.co.za`, `http://localhost:3000`

### Deployment Failed?

- Check that `functions-deploy.zip` contains:
  - `dist/` folder with compiled JavaScript
  - `host.json`
  - `package.json`
- Verify you have write permissions to the Functions App
- Try Option 1 (Azure Portal Zip Deploy) - it's the most reliable

