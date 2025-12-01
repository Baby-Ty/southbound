# GitHub Pages Limitations

## ❌ What WON'T Work on GitHub Pages

GitHub Pages only hosts **static files** (HTML, CSS, JavaScript). It cannot run server-side code.

### Your API Routes (All Broken on GitHub Pages):
- ❌ `/api/images/search` - Unsplash image search
- ❌ `/api/images/generate` - OpenAI DALL-E image generation  
- ❌ `/api/upload-image` - Azure Blob Storage uploads
- ❌ `/api/routes` - Route saving/loading from CosmosDB
- ❌ `/api/cities` - City data from CosmosDB
- ❌ `/api/migrate-images` - Image migration

### Features That Won't Work:
- ❌ **Hub image search** - Requires `/api/images/search`
- ❌ **Image generation** - Requires `/api/images/generate` 
- ❌ **Image uploads** - Requires `/api/upload-image`
- ❌ **Route builder save/load** - Requires `/api/routes`
- ❌ **City data loading** - Requires `/api/cities`
- ❌ **Environment variables** - No server to read them

### What MIGHT Work (Limited):
- ⚠️ **Static pages** - Homepage, basic pages
- ⚠️ **Client-side only features** - If they don't need API routes
- ⚠️ **Sanity CMS** - Only if using client-side fetching (limited)

## ✅ What WILL Work on Azure Web App

Azure Web App runs a **full Next.js server**, so everything works:

- ✅ All API routes (`/api/*`)
- ✅ Server-side rendering (SSR)
- ✅ Environment variables
- ✅ CosmosDB connections
- ✅ Azure Blob Storage uploads
- ✅ OpenAI API calls
- ✅ Unsplash API calls
- ✅ Route builder (save/load)
- ✅ Hub features (all of them)

## Current Situation

Your current GitHub Pages deployment workflow:
- Builds the app as static export
- Deploys to GitHub Pages
- **But API routes don't work** - they're just static files

## Solution: Move to Azure Web App

Since you're planning to move to Azure Web App anyway, here's what you need to know:

### For GitHub Pages (Current - Limited):
- Only static pages work
- API routes return 404 errors
- Hub features won't work
- Route builder can't save routes

### For Azure Web App (Future - Full Functionality):
- Everything works
- Set environment variables in Azure Portal
- Full server-side capabilities
- All your new features will work

## Recommendation

**Don't rely on GitHub Pages** for this application. The Hub and Route Builder features you built today require server-side API routes that GitHub Pages cannot support.

**Move to Azure Web App** as soon as possible to get full functionality.

See `AZURE_WEBAPP_DEPLOYMENT.md` for deployment instructions.


