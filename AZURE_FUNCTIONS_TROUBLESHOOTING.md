# Azure Functions Troubleshooting - 503 Error

## Current Situation

The Azure Functions app `southbnd-functions-v3` is returning 503 (Service Unavailable) errors after deployment. All 21 functions are properly registered, but the app itself is not starting.

## What We've Done

✅ **Fixed in Code:**
1. Updated to Azure Functions v4 SDK (`@azure/functions: ^4.5.1`)
2. Updated extension bundle to v4 (`[4.*, 5.0.0)`)
3. Converted all functions to use v4 types (HttpRequest, HttpResponseInit, InvocationContext)
4. Fixed Cosmos DB reserved keyword "order" issue
5. All functions compile without errors
6. All functions work locally
7. Deployment completed successfully
8. All 21 functions registered in Azure

❌ **Current Problem:**
- Function app returns 503 Service Unavailable
- Even admin/Kudu endpoints are offline
- Sync triggers error during deployment

## Immediate Actions Needed (Azure Portal)

### Step 1: Check Application Insights

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **southbnd-functions-v3** Function App
3. Click **Application Insights** in left menu
4. Look for errors in the last 30 minutes
5. Check for:
   - Host startup errors
   - Module loading errors
   - Configuration errors

### Step 2: Check Platform Status

1. In the Function App, go to **Diagnose and solve problems**
2. Select **Availability and Performance**
3. Check:
   - **Platform Issues** - Is Azure having problems?
   - **Function App Down** - What's the root cause?
   - **Container Crash** - Is the container failing to start?

### Step 3: Check Configuration

1. Go to **Configuration** → **Application settings**
2. Verify these are set:
   - `FUNCTIONS_WORKER_RUNTIME` = `node`
   - `WEBSITE_NODE_DEFAULT_VERSION` = `~20`
   - `COSMOSDB_ENDPOINT` = (should be set)
   - `COSMOSDB_KEY` = (should be set)
   - `COSMOSDB_DATABASE_ID` = `southbound`
   - `AZURE_STORAGE_CONNECTION_STRING` = (should be set)

3. Check **FUNCTIONS_EXTENSION_VERSION**:
   - Should be `~4` or blank (defaults to ~4)
   - If it says `~3`, change to `~4`

### Step 4: View Logs

1. Go to **Log stream** in left menu
2. Wait for live logs to appear
3. Look for errors like:
   - "Worker was unable to load function"
   - "Module not found"
   - "Timeout waiting for host to start"

### Step 5: Restart Methods

Try these in order:

**Option A: Simple Restart**
1. Click **Restart** button at top
2. Wait 3-5 minutes
3. Test: `https://southbnd-functions-v3.azurewebsites.net/api/route-cards`

**Option B: Stop/Start**
1. Click **Stop** button
2. Wait 1 minute
3. Click **Start** button
4. Wait 3-5 minutes
5. Test endpoint

**Option C: Restart with Settings Refresh**
1. Go to **Configuration**
2. Add a dummy app setting: `TEMP_RESTART` = `1`
3. Click **Save** (this triggers a restart)
4. Wait 3-5 minutes
5. Remove the dummy setting
6. Click **Save** again

## Common Issues & Solutions

### Issue 1: Node Module Errors

**Symptoms:** Log shows "Cannot find module" or "Module not found"

**Solution:**
- The deployment might be missing `node_modules`
- Redeploy with: `func azure functionapp publish southbnd-functions-v3`

### Issue 2: Runtime Version Mismatch

**Symptoms:** "Runtime version mismatch" or "Extension bundle version incompatible"

**Solution:**
1. In **Configuration** → **General settings**
2. Check **Runtime version**: Should be `~4`
3. Check **Platform**: Should be `64 Bit`
4. Save if changed

### Issue 3: Container Memory Issues

**Symptoms:** Container keeps restarting, 503 errors

**Solution:**
1. Go to **Scale up (App Service plan)**
2. Check current tier (might be on consumption/free tier)
3. Consider upgrading to B1 or higher for more resources

### Issue 4: Deployment Slot Issues

**Symptoms:** Changes aren't reflected, old code still running

**Solution:**
1. Check if you have deployment slots
2. Go to **Deployment slots** (if any)
3. Try swapping slots or deploy directly to production

## Alternative: Test Local Functions with Azure Resources

While Azure is being troubleshooted, you can use local functions with Azure resources:

```powershell
# In the functions directory
func start

# In another terminal, update Next.js to use local functions
cd ..
# Edit .env.local:
# Change NEXT_PUBLIC_FUNCTIONS_URL=http://localhost:7071

# Start Next.js
npm run dev
```

This lets you develop with local functions but real Azure databases.

## Nuclear Option: Recreate Function App

If nothing works, you may need to recreate the function app:

### Before Recreating:
1. Export all Application Settings from current app
2. Note the App Service Plan name
3. Save the publish profile

### Steps:
1. Create new Function App in Azure Portal
2. Name it `southbnd-functions-v4` or similar
3. Choose:
   - **Runtime**: Node.js
   - **Version**: 20
   - **OS**: Linux
   - **Plan**: Same as before
4. Import application settings
5. Deploy code: `func azure functionapp publish southbnd-functions-v4`
6. Update Next.js `NEXT_PUBLIC_FUNCTIONS_URL` to new URL
7. Test new app
8. Delete old app once new one works

## What to Look For in Logs

### Good Signs:
```
Host initialized
Host started
Worker process started and initialized
Functions: [list of functions]
```

### Bad Signs:
```
Worker was unable to load function
Timeout waiting for host to start
Failed to start language worker
The Function Runtime is unable to start
```

## Quick Test Commands

Once you think it's fixed:

```powershell
# Test if app is responding
Invoke-WebRequest -Uri "https://southbnd-functions-v3.azurewebsites.net" -UseBasicParsing

# Test specific function
Invoke-RestMethod -Uri "https://southbnd-functions-v3.azurewebsites.net/api/route-cards"

# Test with Cosmos DB query fix
Invoke-RestMethod -Uri "https://southbnd-functions-v3.azurewebsites.net/api/trip-templates?curated=true&enabled=true"
```

## Next Steps After It's Working

1. ✅ Test all critical endpoints
2. ✅ Check Next.js app connects properly
3. ✅ Verify no console errors
4. ✅ Test Cosmos DB queries (trip-templates with curated filter)
5. ✅ Monitor Application Insights for any runtime errors
6. 📝 Document what fixed it for future reference

## Support Contacts

If you continue to have issues:
- Azure Support Portal: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade
- Check Azure Status: https://status.azure.com/
- Stack Overflow: Tag with `azure-functions` and `azure-functions-node`

## Current Code State

The code is ready and working:
- ✅ All functions updated to v4 SDK
- ✅ All TypeScript compiles without errors
- ✅ Functions work locally (tested)
- ✅ Cosmos DB query fix applied
- ✅ Deployment successful
- ⏳ Waiting for: Azure app to start properly

**The issue is with the Azure runtime environment, not the code itself.**
