# Troubleshooting: Activity Modal Not Showing Descriptions

## Quick Fix Steps

### 1. Clear Browser Cache
The browser is likely showing the old JavaScript code. Do a **hard refresh**:

**Windows/Linux:**
- `Ctrl + Shift + R` or
- `Ctrl + F5`

**Mac:**
- `Cmd + Shift + R`

**Or use DevTools:**
1. Press `F12` to open DevTools
2. Right-click the refresh button in your browser
3. Select "Empty Cache and Hard Reload"

### 2. Check Server Port
The dev server restarted on **port 3001** (not 3000).

Make sure you're visiting: **http://localhost:3001**

### 3. Check Console for Errors

Open browser DevTools (F12) and look at the Console tab. When you click an activity, you should see:

**Expected logs:**
```
[ActivityModal] Starting fetch for: Anne Frank's Story
[ActivityModal] Current description length: 0
[ActivityModal] Description missing or too short, fetching full TripAdvisor details...
[ActivityModal] TripAdvisor API response status: 200
[ActivityModal] Received TripAdvisor data, description length: 450
[ActivityModal] ✅ Successfully merged TripAdvisor details with description
```

**If you see errors:**
- API not found (404) → Server needs restart
- CORS errors → Check server is running
- TripAdvisor API errors → Check API key in `.env.local`

### 4. Verify TripAdvisor API Key

Make sure your `.env.local` has:
```bash
TRIPADVISOR_API_KEY=your_actual_key_here
```

Then restart the dev server.

### 5. Test the API Directly

Open this URL in your browser (replace with actual locationId):
```
http://localhost:3001/api/tripadvisor/location/d2292910
```

You should see JSON with a `description` field.

## Common Issues

### Issue: Still seeing "Description Not Available"

**Causes:**
1. ❌ Browser cache not cleared
2. ❌ Wrong port (using 3000 instead of 3001)
3. ❌ Server hasn't restarted with new code
4. ❌ TripAdvisor API key missing or invalid

**Solution:**
1. Hard refresh: `Ctrl + Shift + R`
2. Check URL: Should be `localhost:3001`
3. Restart server: Kill terminal and run `npm run dev`
4. Check `.env.local` file exists and has valid API key

### Issue: Console shows API errors

**If you see:**
```
TripAdvisor API key not configured
```

**Fix:**
1. Create/edit `.env.local`
2. Add: `TRIPADVISOR_API_KEY=your_key`
3. Restart dev server
4. Hard refresh browser

### Issue: Modal loads but no description appears

**Check console for:**
- `description length: 0` → TripAdvisor API not returning data
- `TripAdvisor API request failed` → Network error
- No logs at all → Modal not calling fetch function

**Fix:**
- Verify API key is valid on TripAdvisor developer portal
- Check internet connection
- Try different activity

## Verification Checklist

- [ ] Dev server running on port 3001
- [ ] Browser opened to http://localhost:3001
- [ ] Hard refresh done (Ctrl + Shift + R)
- [ ] DevTools console open (F12)
- [ ] .env.local file exists with TRIPADVISOR_API_KEY
- [ ] Activity modal opened by clicking an activity
- [ ] Console shows "[ActivityModal]" logs

## If Still Not Working

### Debug Steps:

1. **Check activity has locationId:**
   - Open console
   - Look for log: `Starting fetch for: [activity name]`
   - If missing → activity object doesn't have locationId

2. **Test API directly:**
   ```bash
   curl http://localhost:3001/api/tripadvisor/location/d2292910
   ```
   Should return JSON with description

3. **Check Network tab:**
   - Open DevTools → Network tab
   - Open activity modal
   - Look for request to `/api/tripadvisor/location/...`
   - Check if it returns 200 and has data

4. **Verify code changes were applied:**
   - Look at console, should see new detailed logs
   - If logs are minimal → code didn't update, rebuild needed

### Nuclear Option - Complete Refresh:

```bash
# Kill all node processes
# Then:
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

Then hard refresh browser: `Ctrl + Shift + R`

## Expected Behavior

When working correctly:

1. Click activity → Modal opens
2. Console shows: "Starting fetch..."
3. Within 1-2 seconds: "Successfully merged TripAdvisor details"
4. Modal shows full description with rich formatting
5. Description is multiple paragraphs about the activity

## Still Having Issues?

Check:
1. Terminal output for server errors
2. Browser console for JavaScript errors
3. Network tab for API call status codes
4. Make sure you're on the right port (3001, not 3000)

---

**Remember:** The most common issue is browser cache. Always do a hard refresh first!

