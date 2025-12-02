# Testing Checklist - Post Migration

## Prerequisites
- Wait for Azure deployment to complete (~5 minutes)
- Check: https://github.com/Baby-Ty/southbound/actions
- Clear browser cache or use incognito/private window

---

## 1. Website (www.southbnd.co.za or southbound-app.azurewebsites.net)

### Homepage
- [ ] Visit: `https://www.southbnd.co.za` or `https://southbound-app.azurewebsites.net`
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] No console errors (F12 → Console tab)

### Route Builder
- [ ] Visit: `https://www.southbnd.co.za/route-builder` or `https://southbound-app.azurewebsites.net/route-builder`
- [ ] Wizard steps work (1-5)
- [ ] **Step 5 (Summary):** Button shows "🚀 Build My Trip" (NOT "See Your Matches")
- [ ] Can select duration (3, 6, 9 months)
- [ ] Clicking "Build My Trip" navigates to trip-options page

### Trip Options Page
- [ ] Visit: `https://www.southbnd.co.za/trip-options?region=latin-america&...`
- [ ] Cities load from API (check Network tab for `/api/cities` call)
- [ ] Can edit stops
- [ ] **Image Search:** Click edit on a highlight → Search tab → Search for images
  - [ ] API call goes to: `https://api.southbnd.co.za/api/images-search?query=...`
  - [ ] Images load successfully
  - [ ] Can select an image
- [ ] **Image Generation:** Click Generate tab → Enter prompt → Generate
  - [ ] API call goes to: `https://api.southbnd.co.za/api/images-generate`
  - [ ] Image generates successfully
- [ ] Can save route

### API Calls Check
Open Browser DevTools (F12) → Network tab:
- [ ] All API calls go to `api.southbnd.co.za` (not `/api/...`)
- [ ] No 404 errors
- [ ] Cities API: `GET https://api.southbnd.co.za/api/cities?region=...` → 200 OK
- [ ] Images Search API: `GET https://api.southbnd.co.za/api/images-search?query=...` → 200 OK
- [ ] Images Generate API: `POST https://api.southbnd.co.za/api/images-generate` → 200 OK

---

## 2. Hub (hub.southbnd.co.za)

### Hub Homepage
- [ ] Visit: `https://hub.southbnd.co.za`
- [ ] Redirects to `/hub` automatically
- [ ] Hub dashboard loads

### Hub Routes Page
- [ ] Visit: `https://hub.southbnd.co.za/hub/routes`
- [ ] Routes list loads from API
- [ ] API call: `GET https://api.southbnd.co.za/api/routes` → 200 OK
- [ ] Can view/edit routes

### Hub Leads Page
- [ ] Visit: `https://hub.southbnd.co.za/hub/leads`
- [ ] Leads list loads from API
- [ ] API call: `GET https://api.southbnd.co.za/api/leads` → 200 OK
- [ ] Can view/edit leads

### Hub Destinations/Cities Page
- [ ] Visit: `https://hub.southbnd.co.za/hub/destinations/cities`
- [ ] Cities load from API
- [ ] Can manage cities

### Middleware Test (Hub Domain Restriction)
- [ ] Visit: `https://hub.southbnd.co.za/`
  - [ ] Should redirect to `/hub` ✅
- [ ] Visit: `https://hub.southbnd.co.za/route-builder`
  - [ ] Should redirect to `/hub` ✅
- [ ] Visit: `https://hub.southbnd.co.za/hub/routes`
  - [ ] Should work (not redirect) ✅

---

## 3. API Endpoints (api.southbnd.co.za)

### Direct API Tests
Open browser and test these URLs directly:

- [ ] `https://api.southbnd.co.za/api/cities?region=latin-america`
  - [ ] Returns JSON with cities array
  - [ ] CORS headers present (check Network → Headers)
- [ ] `https://api.southbnd.co.za/api/cities?region=europe`
  - [ ] Returns European cities
- [ ] `https://api.southbnd.co.za/api/cities?region=southeast-asia`
  - [ ] Returns Southeast Asia cities

---

## 4. Console Checks

Open Browser DevTools (F12) → Console tab, look for:

### API URL Detection Logs
- [ ] Should see: `[API] Hostname: www.southbnd.co.za` (or similar)
- [ ] Should see: `[API] Using custom domain Functions URL: https://api.southbnd.co.za`
- [ ] Should see: `[apiUrl] Using external API URL: https://api.southbnd.co.za/api/...`

### No Errors
- [ ] No red errors in console
- [ ] No 404 errors for API calls
- [ ] No CORS errors

---

## 5. Common Issues & Fixes

### Issue: Still seeing "See Your Matches" button
**Fix:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear cache: `Ctrl+Shift+Delete` → Clear cached images/files
3. Test in incognito window

### Issue: API calls going to `/api/...` instead of `api.southbnd.co.za`
**Fix:**
1. Check browser console for `[API]` logs
2. Verify deployment completed
3. Restart Azure Web App (Azure Portal → Restart)

### Issue: 404 errors on API calls
**Fix:**
1. Verify `api.southbnd.co.za` DNS is pointing to `southbound-functions.azurewebsites.net`
2. Check Azure Functions are deployed and running
3. Verify CORS is configured in Functions

### Issue: Hub domain showing full website
**Fix:**
1. Verify middleware is deployed (check deployment logs)
2. Restart Azure Web App
3. Clear browser cache

---

## 6. Performance Check

- [ ] Page load times are reasonable (< 3 seconds)
- [ ] Images load properly
- [ ] No excessive API calls
- [ ] Smooth navigation between pages

---

## Test Results Summary

After completing all tests, note:
- ✅ What works
- ❌ What doesn't work
- ⚠️ Any warnings or issues

Share results and we'll fix any issues!

