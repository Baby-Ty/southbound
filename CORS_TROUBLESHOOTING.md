# CORS Troubleshooting - Still Getting Errors

## Current Issue
Even after deploying updated code, still getting:
```
Cross-Origin Request Blocked: CORS request did not succeed. Status code: (null)
```

This means the **preflight OPTIONS request** is failing before reaching your function code.

## Critical Checks

### 1. Verify CORS Origins in Azure Portal

Go to Azure Portal → `southbound-functions` → **CORS**

**Make sure these EXACT origins are listed:**
- `https://southbnd.co.za` ✅
- `https://www.southbnd.co.za` ✅ (if users access via www)
- `http://localhost:3000` ✅

**Important:** 
- No trailing slashes (`/`)
- Exact match required (http vs https matters)
- Check if you're accessing from `www.southbnd.co.za` vs `southbnd.co.za`

### 2. Check What Origin Your Browser is Sending

Open browser DevTools → Network tab → Find the failed request → Check **Request Headers** → Look for `Origin:` header

The origin MUST match exactly what's in Azure Portal CORS settings.

### 3. Verify Deployment Actually Worked

Check Azure Portal → `southbound-functions` → **Functions** → Verify `images-search` function exists

Check **Log stream** for any errors.

### 4. Test OPTIONS Request Directly

In browser console, run:
```javascript
fetch('https://api.southbnd.co.za/api/images-search?query=test', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://southbnd.co.za',
    'Access-Control-Request-Method': 'GET'
  }
}).then(r => console.log('Status:', r.status, r.headers))
```

If this fails, Azure Portal CORS is blocking it.

## Common Issues

### Issue 1: www vs non-www Mismatch
- If site redirects `www.southbnd.co.za` → `southbnd.co.za`
- Browser might send `www` origin but Azure Portal only has non-www
- **Fix:** Add BOTH to Azure Portal CORS

### Issue 2: Deployment Didn't Include All Files
- Check that `dist/` folder was deployed
- Verify `host.json` was deployed
- Check function logs for "Function not found" errors

### Issue 3: Azure Functions CORS Cache
- CORS settings can take 2-5 minutes to propagate
- Try clearing browser cache
- Wait a few minutes after changing CORS settings

### Issue 4: Custom Domain SSL Issues
- If `api.southbnd.co.za` SSL certificate has issues, CORS preflight fails
- Check SSL certificate status in Azure Portal

## Quick Fix: Add All Possible Origins

In Azure Portal CORS, add:
```
https://southbnd.co.za
https://www.southbnd.co.za
http://southbnd.co.za
http://www.southbnd.co.za
http://localhost:3000
http://localhost:3001
```

Then test again.

## Nuclear Option: Temporary Wildcard (NOT RECOMMENDED FOR PRODUCTION)

If nothing else works, temporarily add `*` to Azure Portal CORS to test:
1. Add `*` to allowed origins
2. Test if it works
3. If it works, the issue is origin mismatch - fix the exact origins
4. Remove `*` and add correct origins

## Next Steps

1. **Check browser Network tab** - What exact Origin header is being sent?
2. **Verify Azure Portal CORS** - Do origins match exactly?
3. **Check function logs** - Are requests reaching the function?
4. **Test with curl/Postman** - Bypass browser to isolate issue

