# Verify CORS Fix - Step by Step Checklist

## Current Issue
Still getting: `CORS request did not succeed. Status code: (null)`

This means the **preflight OPTIONS request** is being blocked by Azure Functions platform-level CORS.

## Step-by-Step Verification

### Step 1: Check What Origin Your Browser Sends

1. Open your live site: `https://southbnd.co.za` (or `https://www.southbnd.co.za`)
2. Open **Browser DevTools** (F12)
3. Go to **Network** tab
4. Try to search for an image (trigger the API call)
5. Find the failed `images-search` request
6. Click on it → **Headers** tab → **Request Headers**
7. **Look for `Origin:` header** - Note the EXACT value:
   - Is it `https://southbnd.co.za`?
   - Or `https://www.southbnd.co.za`?
   - Or something else?

### Step 2: Verify Azure Portal CORS Settings

1. Go to **Azure Portal** → `southbound-functions`
2. Click **CORS** (in left sidebar under API section)
3. **Check the allowed origins list:**
   - Does it include the EXACT origin from Step 1?
   - Check for typos, trailing slashes, http vs https
   - Make sure both www and non-www are listed if needed

4. **If missing, add it:**
   - Click **+ Add** or the input field
   - Enter the exact origin (e.g., `https://southbnd.co.za`)
   - Click **Save**
   - **Wait 2-3 minutes** for changes to propagate

### Step 3: Verify Function Deployment

1. Go to **Azure Portal** → `southbound-functions` → **Functions**
2. Verify `images-search` function exists and is enabled
3. Click on `images-search` → **Code + Test**
4. Check if the code shows the updated version (should read `origin` header)

### Step 4: Check Function Logs

1. Go to **Azure Portal** → `southbound-functions` → **Log stream**
2. Try the image search again from your live site
3. Look for any errors in the logs
4. Check if requests are reaching the function at all

### Step 5: Test OPTIONS Request Directly

In your browser console (on the live site), run:

```javascript
// Test OPTIONS preflight
fetch('https://api.southbnd.co.za/api/images-search?query=test', {
  method: 'OPTIONS',
  headers: {
    'Origin': window.location.origin,
    'Access-Control-Request-Method': 'GET'
  }
})
.then(r => {
  console.log('✅ OPTIONS Success!');
  console.log('Status:', r.status);
  console.log('CORS Headers:', {
    'Access-Control-Allow-Origin': r.headers.get('Access-Control-Allow-Origin'),
    'Access-Control-Allow-Methods': r.headers.get('Access-Control-Allow-Methods')
  });
})
.catch(e => {
  console.error('❌ OPTIONS Failed:', e);
});
```

**Expected Result:**
- Status: `204` (success)
- CORS headers present

**If this fails:** Azure Portal CORS is blocking it - go back to Step 2

### Step 6: Test Actual GET Request

```javascript
// Test actual GET request
fetch('https://api.southbnd.co.za/api/images-search?query=test', {
  headers: {
    'Origin': window.location.origin
  }
})
.then(r => r.json())
.then(data => {
  console.log('✅ GET Success!', data);
})
.catch(e => {
  console.error('❌ GET Failed:', e);
});
```

## Common Fixes

### Fix 1: Add Both www and non-www

In Azure Portal CORS, add BOTH:
```
https://southbnd.co.za
https://www.southbnd.co.za
```

### Fix 2: Clear Browser Cache

1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Or clear cache completely
3. Try again

### Fix 3: Wait for CORS Propagation

After changing CORS settings:
- Wait **2-5 minutes**
- Try again
- CORS changes can take time to propagate

### Fix 4: Verify Deployment

If function code wasn't deployed:
1. Go to **Deployment Center** → **Logs** tab
2. Check if deployment succeeded
3. If failed, redeploy using `functions-deploy.zip`

## Quick Diagnostic Script

Run this in your browser console on the live site:

```javascript
(async () => {
  const origin = window.location.origin;
  console.log('📍 Current Origin:', origin);
  
  console.log('\n🧪 Testing OPTIONS...');
  try {
    const optRes = await fetch('https://api.southbnd.co.za/api/images-search?query=test', {
      method: 'OPTIONS',
      headers: {
        'Origin': origin,
        'Access-Control-Request-Method': 'GET'
      }
    });
    console.log('✅ OPTIONS Status:', optRes.status);
    console.log('✅ CORS Headers:', {
      allowOrigin: optRes.headers.get('Access-Control-Allow-Origin'),
      allowMethods: optRes.headers.get('Access-Control-Allow-Methods')
    });
  } catch (e) {
    console.error('❌ OPTIONS Failed:', e.message);
  }
  
  console.log('\n🧪 Testing GET...');
  try {
    const getRes = await fetch('https://api.southbnd.co.za/api/images-search?query=test', {
      headers: { 'Origin': origin }
    });
    const data = await getRes.json();
    console.log('✅ GET Success!', data.length, 'images');
  } catch (e) {
    console.error('❌ GET Failed:', e.message);
  }
})();
```

This will tell you exactly what's failing and why.

## Still Not Working?

If all steps pass but still getting errors:

1. **Check SSL certificate** - Azure Portal → `southbound-functions` → **Custom domains** → Verify SSL is valid
2. **Check function runtime** - Make sure Functions runtime is up to date
3. **Try Azure Functions direct URL** - Test with `https://southbound-functions.azurewebsites.net/api/images-search?query=test` to isolate custom domain issues

