# SSL Certificate Fix for api.southbnd.co.za

## Current Issue
```
ERR_CERT_COMMON_NAME_INVALID
Failed to fetch
```

This means the SSL certificate for `api.southbnd.co.za` is either:
- Not configured
- Not issued yet
- Configured incorrectly
- Doesn't match the domain name

## Solution: Configure SSL Certificate in Azure Portal

### Step 1: Go to Custom Domains

1. **Azure Portal** → `southbound-functions`
2. In left sidebar, click **Custom domains**
3. Find `api.southbnd.co.za` in the list
4. Check the **SSL/TLS status** column

### Step 2: Configure SSL Binding

**Option A: App Service Managed Certificate (Recommended - Free)**

1. Click on `api.southbnd.co.za` domain
2. Under **SSL bindings**, click **Add SSL binding**
3. Select:
   - **Certificate type**: App Service Managed Certificate
   - **Hostname**: `api.southbnd.co.za`
   - **SSL type**: SNI SSL (free)
4. Click **Add**
5. **Wait 5-10 minutes** for certificate to be issued

**Option B: Upload Your Own Certificate**

If you have a certificate:
1. Go to **TLS/SSL settings** → **Private Key Certificates (.pfx)**
2. Upload your certificate
3. Go back to **Custom domains** → `api.southbnd.co.za`
4. Add SSL binding using your uploaded certificate

### Step 3: Verify Certificate

After adding SSL binding:
1. Wait 5-10 minutes for certificate to be issued
2. Check **Custom domains** → SSL/TLS status should show "Secure" or "Valid"
3. Test in browser: `https://api.southbnd.co.za/api/images-search?query=test`

### Step 4: Test SSL Certificate

In browser, visit: `https://api.southbnd.co.za`

**Expected:**
- ✅ Green padlock icon
- ✅ No certificate warnings
- ✅ Certificate shows `api.southbnd.co.za` as the subject

**If still showing error:**
- Wait longer (can take up to 30 minutes)
- Check certificate status in Azure Portal
- Verify DNS is pointing correctly

## Alternative: Use Azure Functions Direct URL Temporarily

While waiting for SSL certificate:

1. **Update frontend to use Azure URL temporarily:**
   - Change `apiUrl()` to return `https://southbound-functions.azurewebsites.net` instead of `https://api.southbnd.co.za`
   - This will work immediately (Azure URL has valid SSL)

2. **After SSL certificate is ready:**
   - Switch back to `https://api.southbnd.co.za`

## Verify DNS Configuration

Make sure DNS is correct:

1. **GoDaddy DNS** → Check CNAME record:
   - **Name**: `api`
   - **Value**: `southbound-functions.azurewebsites.net`
   - **TTL**: 3600 (or default)

2. **Verify DNS propagation:**
   ```bash
   nslookup api.southbnd.co.za
   ```
   Should resolve to Azure Functions IP

## Troubleshooting

### Certificate Still Not Working After 30 Minutes?

1. **Check certificate status:**
   - Azure Portal → `southbound-functions` → **TLS/SSL settings**
   - Look for App Service Managed Certificates
   - Check if certificate is "Issued" or "Pending"

2. **Remove and re-add SSL binding:**
   - Remove existing SSL binding
   - Wait 5 minutes
   - Add new SSL binding

3. **Verify domain validation:**
   - Azure Portal → **Custom domains**
   - Make sure domain shows as "Validated"
   - If not validated, follow validation steps

### Still Getting Certificate Error?

1. **Clear browser cache** - Old certificate might be cached
2. **Try incognito/private window** - Bypass cache
3. **Check certificate in browser:**
   - Click padlock icon → Certificate
   - Verify it shows `api.southbnd.co.za`
   - Check expiration date

4. **Test with curl:**
   ```bash
   curl -v https://api.southbnd.co.za/api/images-search?query=test
   ```
   Look for certificate details in output

## Quick Fix: Temporary Workaround

If you need it working immediately while SSL certificate is being issued:

**Option 1: Use Azure Functions URL**
- Update `src/lib/api.ts` to temporarily use `https://southbound-functions.azurewebsites.net`
- This has valid SSL and will work immediately

**Option 2: Use HTTP (NOT RECOMMENDED)**
- Only for testing - browsers will block mixed content
- Not suitable for production

## Expected Timeline

- **SSL Certificate Issuance**: 5-30 minutes
- **DNS Propagation**: Usually instant (already configured)
- **Total Time**: Usually 10-15 minutes after adding SSL binding

After SSL certificate is issued and validated, the CORS errors should be resolved and the API should work properly.

