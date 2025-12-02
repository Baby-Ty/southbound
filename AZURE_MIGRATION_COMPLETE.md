# Azure Web App Migration - Complete

## Code Changes Completed

All code changes have been implemented successfully:

1. **Deleted GitHub Pages workflow** - `.github/workflows/deploy-website.yml` removed
2. **Updated Azure Web App workflow** - Now deploys everything (removed path filters, updated API URL)
3. **Simplified Next.js config** - Always uses `standalone` mode (removed BUILD_TARGET logic)
4. **Verified middleware** - Correctly restricts `hub.southbnd.co.za` to `/hub/*` routes
5. **Verified API client** - Correctly uses `NEXT_PUBLIC_FUNCTIONS_URL` environment variable

## Manual Steps Required

### 1. Update DNS Records (GoDaddy)

Update the DNS CNAME record for the root domain:

| Record Type | Name | Current Value | New Value |
|-------------|------|---------------|-----------|
| CNAME | @ | `baby-ty.github.io` | `southbound-app.azurewebsites.net` |

**Note:** DNS changes can take 24-48 hours to propagate. Keep the GitHub Pages record until Azure is confirmed working.

### 2. Azure Web App Custom Domain Setup

In Azure Portal:

1. **Add custom domain `southbnd.co.za`:**
   - Go to your Web App → Custom domains
   - Click "Add custom domain"
   - Enter `southbnd.co.za`
   - Verify domain ownership (follow Azure's instructions)

2. **Configure SSL certificate:**
   - After domain is verified, go to "TLS/SSL settings"
   - Click "Add TLS/SSL binding"
   - Select `southbnd.co.za` and choose "App Service Managed Certificate"
   - Click "Add"

3. **Verify `hub.southbnd.co.za` is configured:**
   - Ensure `hub.southbnd.co.za` is still listed in Custom domains
   - Verify SSL certificate is active

### 3. Test Deployment

After DNS propagates and Azure domain is configured:

- [ ] `southbnd.co.za` serves homepage
- [ ] `southbnd.co.za/route-builder` works
- [ ] `southbnd.co.za/hub` works
- [ ] `hub.southbnd.co.za` redirects to `/hub`
- [ ] `hub.southbnd.co.za/hub/routes` works
- [ ] API calls from public site go to `api.southbnd.co.za`
- [ ] Image search/generation in Route Builder works
- [ ] Route saving works

## Architecture After Migration

| Component | Domain | Host | Build Mode |
|-----------|--------|------|------------|
| Public Website + Hub | `southbnd.co.za` | Azure Web App | Standalone server |
| Hub Only | `hub.southbnd.co.za` | Azure Web App | Standalone server |
| API Backend | `api.southbnd.co.za` | Azure Functions | Serverless |

## Rollback Plan

If issues occur:

1. **Revert DNS:** Change CNAME for `@` back to `baby-ty.github.io` in GoDaddy
2. **Restore GitHub Pages workflow:** Restore `.github/workflows/deploy-website.yml` from git history
3. **Revert next.config.ts:** Change `output: 'standalone'` back to conditional logic

## Next Steps

1. Push changes to trigger Azure deployment
2. Wait for deployment to complete (~5 minutes)
3. Update DNS records in GoDaddy
4. Wait for DNS propagation (24-48 hours)
5. Configure custom domain in Azure Portal
6. Test all functionality

