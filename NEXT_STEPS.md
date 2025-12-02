# Next Steps - Post Deployment

## ✅ What's Complete

- ✅ Azure Functions deployed successfully (including new leads endpoint)
- ✅ Code fixes applied (Hub API calls, endpoint names)
- ✅ Deployment workflows configured
- ✅ GitHub Pages website deployment ready

## 🎯 Immediate Next Steps

### 1. Test Azure Functions Endpoints

Verify all endpoints are working:

```bash
# Test Cities endpoint
curl https://southbound-functions.azurewebsites.net/api/cities

# Test Routes endpoint  
curl https://southbound-functions.azurewebsites.net/api/routes

# Test Leads endpoint (new!)
curl https://southbound-functions.azurewebsites.net/api/leads

# Test Images Search
curl "https://southbound-functions.azurewebsites.net/api/images-search?query=bali"
```

**Expected:** JSON responses (may be empty arrays if no data yet)

### 2. Verify Environment Variables

#### Azure Functions App (`southbound-functions`)

Go to: Azure Portal → `southbound-functions` → **Configuration** → **Application settings**

**Required variables:**
- ✅ `COSMOSDB_ENDPOINT` - Should be set
- ✅ `COSMOSDB_KEY` - Should be set  
- ✅ `COSMOSDB_DATABASE_ID` - Should be `southbound`
- ✅ `AZURE_STORAGE_CONNECTION_STRING` - For image uploads
- ✅ `AZURE_STORAGE_CONTAINER_NAME` - Should be `southbound-images`
- ✅ `OPENAI_API_KEY` - For image generation
- ✅ `UNSPLASH_ACCESS_KEY` - For image search

**If any are missing:** Add them in Azure Portal → Configuration → Application settings → + New application setting

#### Azure Web App (`southbound-app`) - For Hub

Go to: Azure Portal → `southbound-app` → **Configuration** → **Application settings**

**Required variables:**
- ⚠️ `NEXT_PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
- ⚠️ `NEXT_PUBLIC_SANITY_DATASET` - Usually `production`
- ✅ `NEXT_PUBLIC_FUNCTIONS_URL` - Set to `https://southbound-functions.azurewebsites.net` (or `https://api.southbnd.co.za` if custom domain configured)

**Note:** The Hub won't work fully without Sanity variables, but API calls will work.

### 3. Test Website (GitHub Pages)

Visit: **https://southbnd.co.za**

**Test these features:**
- ✅ Homepage loads
- ✅ Route Builder loads: `https://southbnd.co.za/route-builder`
- ✅ Image search in Route Builder (edit a stop → search images)
- ✅ Image generation in Route Builder
- ✅ Save route functionality

**Expected:** All should work by calling Azure Functions at `https://api.southbnd.co.za`

### 4. Deploy Hub to Azure Web App

The Hub deployment only triggers when Hub files change. To deploy it:

**Option A: Make a small change to trigger deployment**
```bash
# Make a small change to trigger Hub deployment
# Edit any file in src/app/hub/ or src/components/
git commit --allow-empty -m "Trigger Hub deployment"
git push origin master
```

**Option B: Manual trigger**
1. Go to GitHub Actions: https://github.com/Baby-Ty/southbound/actions
2. Find "Deploy to Azure Web App" workflow
3. Click "Run workflow" → "Run workflow"

**After deployment, test Hub:**
- Visit: `https://southbound-app.azurewebsites.net/hub`
- Test Routes page: `/hub/routes`
- Test Cities page: `/hub/destinations/cities`
- Test Leads page: `/hub/leads`

### 5. Configure Custom Domains

#### For Hub (`hub.southbnd.co.za`)

1. **Azure Portal:**
   - Go to `southbound-app` → **Custom domains**
   - Click **Add custom domain**
   - Enter: `hub.southbnd.co.za`
   - Follow DNS verification steps

2. **GoDaddy DNS:**
   - Add CNAME record:
     - **Name:** `hub`
     - **Value:** `southbound-app.azurewebsites.net`
   - Add TXT record for verification (Azure will provide)

3. **Enable SSL:**
   - Azure Portal → `southbound-app` → **Custom domains** → **SSL bindings**
   - Create App Service Managed Certificate (free)
   - Enable HTTPS Only

#### For API (`api.southbnd.co.za`)

1. **Azure Portal:**
   - Go to `southbound-functions` → **Custom domains**
   - Click **Add custom domain**
   - Enter: `api.southbnd.co.za`
   - Follow DNS verification steps

2. **GoDaddy DNS:**
   - Add CNAME record:
     - **Name:** `api`
     - **Value:** `southbound-functions.azurewebsites.net`
   - Add TXT record for verification

3. **Enable SSL:**
   - Azure Portal → `southbound-functions` → **Custom domains** → **SSL bindings**
   - Create App Service Managed Certificate (free)

4. **Update Website:**
   - After SSL is active, update `NEXT_PUBLIC_FUNCTIONS_URL` in GitHub Pages workflow to use `https://api.southbnd.co.za`
   - Redeploy website

### 6. Test Complete Flow

**Website Flow:**
1. User visits `southbnd.co.za/route-builder`
2. Builds a route
3. Adds images (searches Unsplash, generates AI images)
4. Saves route → Calls `api.southbnd.co.za/api/routes`

**Hub Flow:**
1. Admin visits `hub.southbnd.co.za`
2. Views routes → Calls `api.southbnd.co.za/api/routes`
3. Manages cities → Calls `api.southbnd.co.za/api/cities`
4. Manages leads → Calls `api.southbnd.co.za/api/leads`
5. Uploads images → Calls `api.southbnd.co.za/api/upload-image`

## 📋 Checklist

### Immediate (Do Now)
- [ ] Test Azure Functions endpoints (step 1)
- [ ] Verify environment variables are set (step 2)
- [ ] Test website Route Builder (step 3)

### Short-term (This Week)
- [ ] Deploy Hub to Azure Web App (step 4)
- [ ] Test Hub features
- [ ] Configure custom domain for API (`api.southbnd.co.za`)
- [ ] Configure custom domain for Hub (`hub.southbnd.co.za`)

### Medium-term (Next Week)
- [ ] Set up SSL certificates for custom domains
- [ ] Update website to use `api.southbnd.co.za` instead of Azure URL
- [ ] Test end-to-end user flow
- [ ] Monitor Azure costs and usage

## 🔍 Troubleshooting

### Functions endpoints return errors
- Check environment variables in Azure Portal
- Check Functions logs: Azure Portal → `southbound-functions` → **Log stream**

### Hub doesn't load
- Verify Web App is deployed: Check GitHub Actions
- Check environment variables in Web App
- Check Web App logs: Azure Portal → `southbound-app` → **Log stream**

### Website can't call API
- Check CORS settings in Functions App
- Verify `NEXT_PUBLIC_FUNCTIONS_URL` is set correctly
- Check browser console for CORS errors

## 🔗 Quick Links

- **Azure Portal**: https://portal.azure.com
- **GitHub Actions**: https://github.com/Baby-Ty/southbound/actions
- **Website**: https://southbnd.co.za
- **Hub (Azure URL)**: https://southbound-app.azurewebsites.net/hub
- **API (Azure URL)**: https://southbound-functions.azurewebsites.net/api/cities

## 📝 Notes

- The leads endpoint is now deployed and ready to use
- All Hub pages now use `apiUrl()` correctly
- Website Route Builder should work with image editing
- Custom domains will take 15 minutes to 48 hours for DNS propagation

