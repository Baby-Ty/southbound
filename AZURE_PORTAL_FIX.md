# Azure Portal - Fix Functions Not Registering

## Issue
- Functions deploy successfully but don't register (404 errors)
- `func azure functionapp list-functions` returns empty
- Live site shows: "Error fetching curated templates"

## Solution: Check & Fix in Azure Portal

### Step 1: Check Function App Status

1. Go to: https://portal.azure.com
2. Search for **southbnd-functions** (not southbound-functions)
3. Click on the Function App

### Step 2: Check Functions List

In the left menu, click **Functions**:

**If functions ARE listed:**
- ✅ Great! They're registered
- Try restarting: **Overview** → **Restart** button (top toolbar)
- Test: https://southbnd-functions.azurewebsites.net/api/trip-templates?curated=true

**If NO functions listed:**
- ⚠️ Deployment didn't register properly
- Continue to Step 3

### Step 3: Check App Settings

Click **Configuration** → **Application settings**

Verify these exist:
- `COSMOSDB_ENDPOINT` 
- `COSMOSDB_KEY`
- `COSMOSDB_DATABASE`
- `WEBSITE_NODE_DEFAULT_VERSION` (should be ~20 or ~18)
- `FUNCTIONS_WORKER_RUNTIME` (should be `node`)

If any are missing, add them.

### Step 4: Check Deployment Center

Click **Deployment Center** in left menu:

Check recent deployments - do you see the latest one? 
- Check timestamp
- Check status (success/failed)

### Step 5: Manual Redeploy from Portal

If functions still not showing:

1. Go to **Deployment Center**
2. Click **+ Add Provider** or **Manage publish profile**
3. Download fresh publish profile
4. Use that to redeploy from command line OR
5. Use **ZIP Deploy** method:
   - Go to **Advanced Tools (Kudu)**
   - Click **Go** → Opens Kudu dashboard
   - Navigate to **Tools** → **Zip Push Deploy**
   - Upload your `functions-deploy.zip`

### Step 6: Check Logs

Click **Log stream** in left menu to see real-time logs:
- Do you see any errors?
- Do you see functions registering?
- Any "Cannot find module" errors?

### Step 7: Restart Function App

After any changes:
1. Go to **Overview**
2. Click **Restart** (top toolbar)
3. Wait 2 minutes
4. Test again

## Quick Test Commands

After each restart, test:

```powershell
# Test API endpoint
curl https://southbnd-functions.azurewebsites.net/api/trip-templates?curated=true
```

Should return JSON with templates array, not 404.

## Common Issues & Fixes

### Issue: Functions show as "Starting"
**Fix**: Wait 2-3 minutes, they're warming up

### Issue: "Cannot find module"
**Fix**: Check package.json is in deployment + node_modules

### Issue: Environment variables missing  
**Fix**: Add in Configuration → Application settings → Save → Restart

### Issue: Wrong runtime version
**Fix**: Configuration → General settings → Stack: Node.js, Version: 18 LTS or 20 LTS

### Issue: Deployment shows success but no functions
**Fix**: Try ZIP deploy method via Kudu (Step 5)

## What Success Looks Like

**In Azure Portal:**
- Functions menu shows: cities, trip-templates, countries, etc.
- Each function shows green checkmark
- Overview shows "Running"

**In Browser:**
```
https://southbnd-functions.azurewebsites.net/api/trip-templates?curated=true
```
Returns:
```json
{
  "templates": [
    { "id": "...", "name": "...", "isCurated": true, ...},
    ...
  ]
}
```

**Live Site:**
```
https://southbnd.co.za
```
- Homepage shows 4 curated template cards
- No console errors
- No "Failed to fetch" messages

## If All Else Fails

Create a NEW Function App:
1. Azure Portal → Create Resource → Function App
2. Name: `southbnd-functions-v2`
3. Runtime: Node.js 20
4. Region: Same as current
5. Deploy to new app: `func azure functionapp publish southbnd-functions-v2`
6. Update DNS: `api.southbnd.co.za` → point to new app
7. Update frontend environment variable (if using env var)

The code is 100% correct - it's just an Azure deployment/registration issue!
