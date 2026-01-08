# Testing Activity Modal Updates - Step by Step

## Current Status
- ✅ Server running on **http://localhost:3001**
- ✅ Cache cleared
- ✅ Fresh build
- ✅ Version marker added to modal

## IMPORTANT: Follow These Steps EXACTLY

### Step 1: Close ALL Browser Windows
Close all browser windows/tabs completely. This ensures no cached code is running.

### Step 2: Open Fresh Browser Window
1. Open a **NEW** browser window (not a tab in an existing window)
2. Navigate to: **http://localhost:3001**
3. Press `F12` to open DevTools **BEFORE** you do anything else

### Step 3: Clear Browser Cache (Critical!)
In DevTools:
1. Go to the **Application** tab (Chrome) or **Storage** tab (Firefox)
2. Click "Clear site data" or "Clear storage"
3. Check ALL boxes
4. Click "Clear data"

### Step 4: Hard Reload
With DevTools still open:
1. Right-click the browser refresh button
2. Select **"Empty Cache and Hard Reload"**

OR use keyboard shortcut:
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### Step 5: Navigate to Trip Options
1. Go to the itinerary/trip builder page
2. Click on any activity card

### Step 6: Check for Version Marker
When the modal opens, you should see:

**✅ NEW CODE IS RUNNING IF YOU SEE:**
- A **RED "v2.0" badge** next to the activity title
- Console log: `🔥 MODAL RENDERED - NEW CODE ACTIVE 🔥`

**❌ OLD CODE IF YOU SEE:**
- No red "v2.0" badge
- No fire emoji logs in console
- Plain white modal with minimal info

### Step 7: Check Console Logs
In the Console tab, you should see these logs when the modal opens:

```javascript
🔥 MODAL RENDERED - NEW CODE ACTIVE 🔥 {
  hasDescription: false,
  descriptionLength: 0,
  activityName: "Anne Frank's Story...",
  loadingEnriched: true
}

[ActivityModal] Starting fetch for: Anne Frank's Story...
[ActivityModal] Current description length: 0
[ActivityModal] Description missing or too short, fetching full TripAdvisor details...
[ActivityModal] TripAdvisor API response status: 200
[ActivityModal] Received TripAdvisor data, description length: 450
[ActivityModal] ✅ Successfully merged TripAdvisor details with description
```

### Step 8: What Should Happen
1. Modal opens
2. Initially shows "Description Not Available" for 1-2 seconds
3. Loading spinner appears
4. Description loads and displays
5. Rich content appears with proper formatting

## Troubleshooting

### If You DON'T See the Red "v2.0" Badge:

Your browser is still using old JavaScript. Try these in order:

#### Option 1: Nuclear Browser Reset
1. Close **all** browser windows
2. Clear browser cache completely:
   - Chrome: `Ctrl + Shift + Delete` → Select "All time" → Check "Cached images" → Clear
   - Firefox: `Ctrl + Shift + Delete` → Select "Everything" → Check "Cache" → Clear Now
3. Restart browser
4. Go directly to `http://localhost:3001`

#### Option 2: Try Different Browser
If you've been using Chrome, try Firefox or Edge (or vice versa).
A different browser won't have any cache at all.

#### Option 3: Incognito/Private Mode
1. Open browser in Incognito/Private mode
2. Go to `http://localhost:3001`
3. Test the modal

#### Option 4: Disable Browser Cache in DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Disable cache" checkbox
4. Keep DevTools open
5. Refresh page

### If You See v2.0 Badge But No Description:

The new code is running! Now check the console:

#### Check 1: API Errors
Look for:
```
TripAdvisor API key not configured
```
or
```
Failed to fetch from TripAdvisor API
```

**Fix:** Check your `.env.local` file has a valid `TRIPADVISOR_API_KEY`

#### Check 2: Network Errors
In DevTools Network tab:
1. Filter by "tripadvisor"
2. Click on the request
3. Check the Response tab
4. If 404: API route not found
5. If 500: Server error (check terminal)

#### Check 3: Console Errors
Look for JavaScript errors in red. These might indicate:
- Syntax errors
- Missing imports
- Type errors

### If Description Loads But Looks Wrong:

Success! The API is working. You just need to:
1. Check if TripAdvisor has description for this specific activity
2. Try a different activity
3. Check console for which content source is being used

## Verification Checklist

Before reporting issues, verify:

- [ ] Server is running (check terminal 7)
- [ ] Browser is on http://localhost:3001 (NOT 3000)
- [ ] DevTools is open with Console visible
- [ ] Hard refresh was done (Ctrl + Shift + R)
- [ ] Saw the red "v2.0" badge in modal (proves new code loaded)
- [ ] Checked console for "🔥 MODAL RENDERED" log
- [ ] Checked console for TripAdvisor API logs
- [ ] Checked Network tab for API requests
- [ ] .env.local file exists with TRIPADVISOR_API_KEY

## Expected Timeline

```
0s  - Click activity
1s  - Modal opens, shows "Description Not Available"
1s  - Fire emoji log appears in console
1s  - "Starting fetch" log appears
2-3s - "TripAdvisor API response" log appears
3s  - Description appears in modal
3s  - "Successfully merged" log appears
```

## What Each Badge Means

- **🔴 v2.0** - New code is running (remove this after testing)
- **💜 Enhanced** - Admin content from Sanity CMS
- **💙 AI Enhanced** - AI-generated description
- **⚪ (no badge)** - TripAdvisor description only

## Success Criteria

✅ You should see:
1. Red v2.0 badge (proves new code)
2. Fire emoji in console
3. TripAdvisor API logs
4. Rich description text (multiple paragraphs)
5. Properly formatted content

## Still Not Working?

If after ALL these steps you still see the old modal:

1. **Check file was saved:**
   ```powershell
   Get-FileHash "src/components/RouteBuilder/ActivityDetailsModal.tsx" 
   ```

2. **Kill all Node processes:**
   ```powershell
   Get-Process node | Stop-Process -Force
   ```

3. **Complete rebuild:**
   ```powershell
   Remove-Item -Recurse -Force .next, node_modules/.cache
   npm run dev
   ```

4. **Browser nuclear option:**
   - Uninstall browser extensions
   - Clear ALL browser data
   - Restart computer
   - Try again

---

**Bottom Line:** If you see the **red "v2.0" badge**, the new code IS running. If you don't see it, your browser has old JavaScript cached.

