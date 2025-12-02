# Fix Root Domain DNS (southbnd.co.za)

## Problem
GoDaddy doesn't allow CNAME records on the root domain (`@`). You're seeing "Record data is invalid" when trying to add a CNAME for `@`.

## Solution Options

### Option 1: Use A Record (Recommended)
Azure Web Apps support A records. You need to get Azure's IP addresses:

1. **Get Azure IP addresses:**
   - Go to Azure Portal → Your Web App (`southbound-app`)
   - Navigate to **Custom domains** → **Add custom domain**
   - When you add `southbnd.co.za`, Azure will show you the IP addresses to use
   - Or check Azure documentation for App Service outbound IPs

2. **Add A record in GoDaddy:**
   - Type: **A**
   - Name: `@` (or leave blank for root)
   - Value: Azure's IP address (Azure will provide this)
   - TTL: 1 Hour

**Note:** Azure App Service IPs can change. If they do, you'll need to update the A record.

### Option 2: Use www as Primary (Simpler)
Since you already have `www` → `southbound-app.azurewebsites.net` working:

1. **Keep current setup:**
   - `www.southbnd.co.za` → Works ✅
   - `hub.southbnd.co.za` → Works ✅
   - `api.southbnd.co.za` → Works ✅

2. **Configure Azure to redirect root to www:**
   - In Azure Portal → Web App → Configuration
   - Add URL rewrite rule to redirect `southbnd.co.za` → `www.southbnd.co.za`
   - Or handle this in Next.js middleware

3. **Add A record for root (if needed):**
   - Type: **A**
   - Name: `@`
   - Value: Azure's IP (get from Azure Portal)
   - This allows `southbnd.co.za` to resolve, then Azure redirects to `www`

### Option 3: Use Azure's Domain Verification
Azure can help configure DNS automatically:

1. Go to Azure Portal → Web App → Custom domains
2. Click "Add custom domain"
3. Enter `southbnd.co.za`
4. Azure will provide DNS records to add (may include A records)

## Recommended Approach

**Use Option 2** (www as primary) because:
- ✅ You already have `www` configured
- ✅ No CNAME conflicts
- ✅ Easier to manage
- ✅ Works reliably

Then configure Azure/Next.js to redirect `southbnd.co.za` → `www.southbnd.co.za` if users visit the root domain.

## Current Status

Your DNS is **almost perfect**:
- ✅ `api` → Functions (working)
- ✅ `hub` → Web App (working)
- ✅ `www` → Web App (working)
- ⚠️ `@` (root) → Needs A record or redirect setup

The site will work fine with `www.southbnd.co.za` as the primary domain!

