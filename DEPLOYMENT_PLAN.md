# 🎯 Deployment Plan - Current Status & Next Steps

## 📊 Where We Are

### ✅ Completed
1. **Azure Resources** - Created and configured
2. **GitHub Secrets** - All 4 secrets set
3. **Environment Variables** - Configured in Azure Portal
4. **Functions Code** - All 9 functions created and migrated
5. **Frontend Updates** - Updated to call Functions

### ❌ Current Issues

#### Issue 1: Build Failure (Web App)
- **Error**: TypeScript error in `src/app/api/cities/route.ts`
- **Cause**: Old API routes still exist, causing build conflicts
- **Impact**: Web App build fails
- **Priority**: HIGH - Blocks deployment

#### Issue 2: Deployment Failure (Functions)
- **Error**: 401 Unauthorized when deploying Functions
- **Cause**: Publish profile authentication issue
- **Impact**: Functions deployment fails
- **Priority**: HIGH - Blocks deployment

## 🎯 Where We Need to Be

### Immediate Goals
1. ✅ Remove old API routes (they're migrated to Functions)
2. ✅ Fix Functions publish profile authentication
3. ✅ Successful builds for both Web App and Functions
4. ✅ Successful deployments
5. ✅ Working endpoints

### Success Criteria
- [ ] Web App builds without errors
- [ ] Functions builds without errors
- [ ] Web App deploys successfully
- [ ] Functions deploys successfully
- [ ] Web App accessible at https://southbound-app.azurewebsites.net
- [ ] Functions accessible at https://southbound-functions.azurewebsites.net/api/cities
- [ ] Frontend can call Functions (CORS working)
- [ ] All features working (Hub, Route Builder)

## 🔧 Action Plan

### Step 1: Remove Old API Routes
**Why**: We've migrated all API routes to Azure Functions. Old routes cause build errors.

**Action**: Delete or move old API routes:
```
src/app/api/cities/route.ts          → DELETE (migrated to functions/cities)
src/app/api/cities/[id]/route.ts     → DELETE (migrated to functions/cities-by-id)
src/app/api/routes/route.ts          → DELETE (migrated to functions/routes)
src/app/api/routes/[id]/route.ts     → DELETE (migrated to functions/routes-by-id)
src/app/api/images/generate/route.ts → DELETE (migrated to functions/images-generate)
src/app/api/images/search/route.ts   → DELETE (migrated to functions/images-search)
src/app/api/upload-image/route.ts    → DELETE (migrated to functions/upload-image)
src/app/api/migrate-images/route.ts → DELETE (migrated to functions/migrate-images)
```

**Alternative**: If we want to keep them as fallback, we can:
- Move to `src/app/api/_deprecated/` 
- Or add them to `tsconfig.json` exclude

### Step 2: Fix Functions Publish Profile
**Why**: Authentication is failing, likely expired or invalid credentials.

**Action**:
1. Regenerate publish profile from Azure Portal
2. Update GitHub secret `AZURE_FUNCTIONS_PUBLISH_PROFILE`
3. Verify secret is correct

### Step 3: Test Deployment
**After fixes**:
1. Push changes
2. Monitor GitHub Actions
3. Verify both workflows succeed
4. Test endpoints

## 📋 Detailed Checklist

### Phase 1: Fix Build Issues
- [ ] Remove old API routes from `src/app/api/`
- [ ] Verify `tsconfig.json` excludes functions and scripts
- [ ] Test local build: `npm run build`
- [ ] Commit and push changes
- [ ] Verify Web App build succeeds in GitHub Actions

### Phase 2: Fix Deployment Issues
- [ ] Regenerate Functions publish profile
- [ ] Update GitHub secret `AZURE_FUNCTIONS_PUBLISH_PROFILE`
- [ ] Verify Web App publish profile is still valid
- [ ] Push to trigger deployment
- [ ] Verify Functions deployment succeeds

### Phase 3: Verify Deployment
- [ ] Test Web App: https://southbound-app.azurewebsites.net
- [ ] Test Functions: https://southbound-functions.azurewebsites.net/api/cities
- [ ] Test CORS (frontend calling Functions)
- [ ] Test Hub features (image search, generation)
- [ ] Test Route Builder (save/load routes)

### Phase 4: Custom Domains (After deployment works)
- [ ] Add `southbnd.co.za` to Web App
- [ ] Add `api.southbnd.co.za` to Functions App
- [ ] Configure DNS in GoDaddy
- [ ] Enable SSL certificates
- [ ] Update `NEXT_PUBLIC_FUNCTIONS_URL` to use custom domain

## 🐛 Troubleshooting Guide

### If Build Still Fails
1. Check TypeScript errors in GitHub Actions logs
2. Verify all old API routes are removed
3. Check `tsconfig.json` excludes are correct
4. Test local build to catch errors early

### If Deployment Still Fails
1. Verify publish profiles are valid
2. Check Azure Portal → Functions App → Deployment Center
3. Try regenerating publish profiles
4. Verify GitHub secrets are correct

### If Endpoints Don't Work
1. Check Functions App logs in Azure Portal
2. Verify environment variables are set
3. Test Functions directly (not through frontend)
4. Check CORS settings

## 📚 Key Files Reference

- `.github/workflows/azure-webapp-deploy.yml` - Web App deployment
- `.github/workflows/azure-functions-deploy.yml` - Functions deployment
- `tsconfig.json` - TypeScript config (should exclude functions & scripts)
- `functions/` - All Azure Functions code
- `src/lib/api.ts` - Functions URL helper
- `src/app/api/` - **OLD API routes (should be removed)**

## 🎯 Success Metrics

- ✅ Zero build errors
- ✅ Zero deployment errors
- ✅ Web App loads successfully
- ✅ Functions respond correctly
- ✅ CORS working
- ✅ All features functional


