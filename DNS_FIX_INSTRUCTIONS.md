# DNS Fix for api.southbnd.co.za

## Problem
The live site is getting errors: `Failed to fetch curated templates` because the DNS CNAME record for `api.southbnd.co.za` is pointing to the wrong Azure Functions App.

## Solution

### Step 1: Update DNS CNAME Record (GoDaddy)

1. Go to **GoDaddy DNS Management** for southbnd.co.za
2. Find the CNAME record for `api` subdomain
3. Update it to point to the **NEW** Functions App:

**Current (incorrect):**
```
api.southbnd.co.za → southbound-functions.azurewebsites.net
```

**New (correct):**
```
api.southbnd.co.za → southbnd-functions.azurewebsites.net
```

**DNS Record Details:**
- **Type**: CNAME
- **Name**: api
- **Value**: southbnd-functions.azurewebsites.net
- **TTL**: 600 (or default)

### Step 2: Add Custom Domain in Azure Functions

After updating DNS, you need to configure the custom domain in Azure:

1. Go to **Azure Portal** → **southbnd-functions** Function App
2. Navigate to **Settings** → **Custom domains**
3. Click **+ Add custom domain**
4. Enter: `api.southbnd.co.za`
5. Click **Validate**
6. Once validated, click **Add custom domain**
7. Enable **HTTPS** (use Azure managed certificate)

### Step 3: Deploy the Fixed Functions

Once DNS propagates (5-30 minutes), deploy the updated functions:

```powershell
# From project root
.\deploy-now.ps1
```

### Step 4: Test the Endpoint

Test the API endpoint directly:

```bash
# Test curated templates endpoint
curl https://api.southbnd.co.za/api/trip-templates?curated=true&enabled=true

# Should return JSON with templates array
```

### Step 5: Test the Live Site

1. Visit: https://southbnd.co.za
2. Check browser console for errors
3. Verify the 4 curated template cards display correctly
4. Click a card to test deep linking

## Quick DNS Verification

Check current DNS configuration:

```bash
nslookup api.southbnd.co.za
```

Should return:
```
Name:    southbnd-functions.azurewebsites.net
Address:  [Azure IP]
Aliases:  api.southbnd.co.za
```

## Functions Apps Comparison

| App Name | URL | Status |
|----------|-----|--------|
| southbound-functions | southbound-functions.azurewebsites.net | ❌ Old (wrong) |
| southbnd-functions | southbnd-functions.azurewebsites.net | ✅ New (correct) |

## Files Updated
- `functions/trip-templates/index.ts` - Fixed CORS headers to properly handle origin

## Next Steps After DNS Fix

1. ✅ DNS updated in GoDaddy
2. ✅ Custom domain added in Azure Functions
3. ✅ Functions deployed with `deploy-now.ps1`
4. ✅ Test endpoint: `https://api.southbnd.co.za/api/trip-templates?curated=true`
5. ✅ Test live site: `https://southbnd.co.za`

## Troubleshooting

If you still see errors after DNS update:

1. **Clear DNS cache** (wait 5-30 minutes for propagation)
2. **Check Azure Functions logs** in Azure Portal
3. **Verify environment variables** are set in Azure Functions App:
   - `COSMOSDB_ENDPOINT`
   - `COSMOSDB_KEY`
   - `COSMOSDB_DATABASE`
4. **Test direct Functions URL**: `https://southbnd-functions.azurewebsites.net/api/trip-templates?curated=true`
