# Custom Domain Setup Guide for Azure

## Prerequisites
- ✅ DNS records already configured in GoDaddy
- ✅ Azure Web App: `southbound-app` (for Hub)
- ✅ Azure Functions App: `southbound-functions` (for API)

## Step-by-Step: Add Custom Domains

### Part 1: Add Domain to Azure Functions App (`api.southbnd.co.za`)

#### Step 1: Navigate to Functions App
1. Go to **Azure Portal**: https://portal.azure.com
2. Search for: `southbound-functions`
3. Click on the Functions App

#### Step 2: Open Custom Domains
1. In the left sidebar, click **Custom domains** (under Settings)
2. Click **+ Add custom domain** button at the top

#### Step 3: Enter Domain Name
1. **Domain name**: Enter `api.southbnd.co.za`
2. Click **Validate**

#### Step 4: DNS Verification
Azure will show you what DNS records to add:

**If you see "Add a CNAME record":**
- **Type**: CNAME
- **Name**: `api`
- **Value**: `southbound-functions.azurewebsites.net`
- **TTL**: 3600 (or default)

**If you see "Add a TXT record" (for verification):**
- **Type**: TXT
- **Name**: `asuid.api` (or just `api` depending on GoDaddy)
- **Value**: Copy the exact value Azure provides (looks like: `abc123...`)
- **TTL**: 3600

#### Step 5: Add Records in GoDaddy
1. Go to GoDaddy: https://dcc.godaddy.com/manage/southbnd.co.za/dns
2. Click **Add** to add new record
3. Add the CNAME record:
   - **Type**: CNAME
   - **Name**: `api`
   - **Value**: `southbound-functions.azurewebsites.net`
   - **TTL**: 1 Hour
4. If Azure provided a TXT record, add that too:
   - **Type**: TXT
   - **Name**: `asuid.api` (or `api`)
   - **Value**: (paste the value from Azure)
   - **TTL**: 1 Hour
5. Click **Save**

#### Step 6: Verify in Azure
1. Wait 1-2 minutes for DNS propagation
2. Back in Azure Portal, click **Validate** again
3. If validation succeeds, click **Add** to add the domain

#### Step 7: Enable SSL Certificate
1. After domain is added, go to **SSL bindings** tab (next to Custom domains)
2. Click **+ Add SSL binding**
3. Select your domain: `api.southbnd.co.za`
4. **Certificate source**: Select **Create App Service Managed Certificate** (free)
5. Click **Add**
6. Wait 2-5 minutes for certificate to be issued
7. Go back to **Custom domains** tab
8. Find your domain and toggle **HTTPS Only** to **On**

---

### Part 2: Add Domain to Azure Web App (`hub.southbnd.co.za`)

#### Step 1: Navigate to Web App
1. In Azure Portal, search for: `southbound-app`
2. Click on the Web App

#### Step 2: Open Custom Domains
1. In the left sidebar, click **Custom domains** (under Settings)
2. Click **+ Add custom domain** button at the top

#### Step 3: Enter Domain Name
1. **Domain name**: Enter `hub.southbnd.co.za`
2. Click **Validate**

#### Step 4: DNS Verification
Azure will show you what DNS records to add:

**If you see "Add a CNAME record":**
- **Type**: CNAME
- **Name**: `hub`
- **Value**: `southbound-app.azurewebsites.net`
- **TTL**: 3600

**If you see "Add a TXT record" (for verification):**
- **Type**: TXT
- **Name**: `asuid.hub` (or just `hub`)
- **Value**: Copy the exact value Azure provides
- **TTL**: 3600

**If you see "Add A records" (IP addresses):**
- Azure will show 2 IP addresses
- Add 2 A records:
  - **Type**: A
  - **Name**: `hub` (or `@` if using root domain)
  - **Value**: First IP address
  - **TTL**: 1 Hour
- Add second A record with second IP address

#### Step 5: Add Records in GoDaddy
1. Go to GoDaddy DNS management
2. Add the CNAME or A records as shown by Azure
3. If TXT record needed, add that too
4. Click **Save**

#### Step 6: Verify in Azure
1. Wait 1-2 minutes for DNS propagation
2. Back in Azure Portal, click **Validate** again
3. If validation succeeds, click **Add** to add the domain

#### Step 7: Enable SSL Certificate
1. After domain is added, go to **SSL bindings** tab
2. Click **+ Add SSL binding**
3. Select your domain: `hub.southbnd.co.za`
4. **Certificate source**: Select **Create App Service Managed Certificate** (free)
5. Click **Add**
6. Wait 2-5 minutes for certificate to be issued
7. Go back to **Custom domains** tab
8. Find your domain and toggle **HTTPS Only** to **On**

---

## Expected DNS Records in GoDaddy

After setup, you should have these records:

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| CNAME | `api` | `southbound-functions.azurewebsites.net` | API Functions |
| CNAME | `hub` | `southbound-app.azurewebsites.net` | Hub Web App |
| CNAME | `@` | `baby-ty.github.io` | Website (GitHub Pages) |
| TXT | `asuid.api` | (Azure verification value) | API verification |
| TXT | `asuid.hub` | (Azure verification value) | Hub verification |

**Note:** If Azure shows A records instead of CNAME for the Web App, use those IP addresses instead.

---

## Troubleshooting

### Domain Validation Fails

**Issue:** Azure says "Domain validation failed"

**Solutions:**
1. **Wait longer**: DNS can take 15 minutes to 48 hours to propagate
2. **Check DNS records**: Verify records are exactly as Azure specified
3. **Check record names**: 
   - In GoDaddy, make sure the name is just `api` or `hub` (not `api.southbnd.co.za`)
   - For TXT records, might need `asuid.api` or just `api`
4. **Use DNS checker**: Visit https://dnschecker.org to verify DNS propagation globally

### SSL Certificate Fails

**Issue:** "Failed to create certificate"

**Solutions:**
1. **Wait**: Certificate creation can take 5-10 minutes
2. **Verify domain**: Make sure domain validation passed first
3. **Check DNS**: Ensure DNS records are correct
4. **Retry**: Delete and re-add the SSL binding

### HTTPS Not Working

**Issue:** Site loads on HTTP but not HTTPS

**Solutions:**
1. **Wait for certificate**: SSL certificates take time to issue
2. **Check SSL binding**: Verify SSL binding is active (green checkmark)
3. **Enable HTTPS Only**: Toggle should be "On"
4. **Clear browser cache**: Try incognito/private window

### CORS Errors After Adding Domain

**Issue:** Website can't call API after switching to custom domain

**Solutions:**
1. **Update CORS in Functions App**:
   - Azure Portal → `southbound-functions` → **CORS**
   - Add: `https://southbnd.co.za`
   - Add: `https://hub.southbnd.co.za`
   - Remove wildcard `*` if present
   - Click **Save**

2. **Update NEXT_PUBLIC_FUNCTIONS_URL**:
   - In GitHub Pages workflow: Change to `https://api.southbnd.co.za`
   - In Azure Web App: Add/update environment variable

---

## After Setup Checklist

- [ ] `api.southbnd.co.za` validates in Azure Functions App
- [ ] `hub.southbnd.co.za` validates in Azure Web App
- [ ] SSL certificates created for both domains
- [ ] HTTPS Only enabled for both domains
- [ ] Test `https://api.southbnd.co.za/api/cities` works
- [ ] Test `https://hub.southbnd.co.za` loads
- [ ] Update CORS in Functions App to include new domains
- [ ] Update `NEXT_PUBLIC_FUNCTIONS_URL` in GitHub Pages workflow to use `https://api.southbnd.co.za`

---

## Quick Reference Links

- **Azure Portal**: https://portal.azure.com
- **GoDaddy DNS**: https://dcc.godaddy.com/manage/southbnd.co.za/dns
- **Functions App**: https://portal.azure.com/#@/resource/subscriptions/19dcc571-9b58-4829-8f65-b38bf023f4f9/resourceGroups/southbound-rg/providers/Microsoft.Web/sites/southbound-functions
- **Web App**: https://portal.azure.com/#@/resource/subscriptions/19dcc571-9b58-4829-8f65-b38bf023f4f9/resourceGroups/southbound-rg/providers/Microsoft.Web/sites/southbound-app
- **DNS Checker**: https://dnschecker.org

