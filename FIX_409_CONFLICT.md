# Fix 409 Conflict Error in Azure Functions Deployment

## Error Details
- **Error Code:** 409 Conflict
- **Location:** ZipDeploy step
- **Cause:** Azure Functions app is locked or previous deployment still in progress

## Quick Fixes

### Option 1: Restart Functions App (Recommended)
1. Go to Azure Portal: https://portal.azure.com
2. Navigate to: `southbound-functions` → **Overview**
3. Click **Restart** button
4. Wait 1-2 minutes for restart to complete
5. Re-run the GitHub Actions workflow

### Option 2: Wait and Retry
Sometimes deployments conflict if run too quickly:
1. Wait 5-10 minutes
2. Re-run the failed workflow in GitHub Actions

### Option 3: Check Deployment Status
1. Azure Portal → `southbound-functions` → **Deployment Center**
2. Check if any deployment is "In Progress"
3. Wait for it to complete before retrying

### Option 4: Add Retry Logic to Workflow
We can add retry logic to the deployment step (see below)

## Long-term Fix: Add Retry Logic

Update the workflow to retry on 409 errors automatically.

