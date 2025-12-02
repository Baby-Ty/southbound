# Azure Static Web App Settings

## ⚠️ Important: Static Web Apps Won't Work for Hub

**Static Web Apps are for static sites only** - they don't support:
- ❌ Next.js middleware
- ❌ Server-side rendering
- ❌ Hub routes that need server features

## If You Want to Use Static Web App (Public Site Only)

If you want to use Static Web App for the **public website only** (not Hub), here are the settings:

### Static Web App Creation Settings

**Basics:**
- **Name:** `southbound-website` (or similar)
- **Plan type:** Free (for testing) or Standard (for production)
- **Region:** Choose closest to your users

**Deployment:**
- **Source:** GitHub
- **Organization:** Baby-Ty
- **Repository:** southbound
- **Branch:** master

**Build Details:**
- **Build Presets:** Next.js
- **App location:** `/` (root)
- **Api location:** Leave empty (APIs are in Azure Functions)
- **Output location:** `out` (this is where Next.js static export puts files)

**Note:** This will only work if:
1. `next.config.ts` has `output: 'export'`
2. You exclude `/hub/*` routes from the build
3. Hub is deployed separately to Azure Web App

## Recommended: Use Azure Web App Instead

Since you need Hub functionality, **Azure Web App** is the better choice:

### Azure Web App Settings

**Basics:**
- **Name:** `southbound-app` (you already have this)
- **Runtime stack:** Node.js 20 LTS
- **Operating System:** Linux
- **Region:** Choose closest to your users

**Configuration:**
- **Build:** Uses GitHub Actions workflow
- **Output:** `standalone` (full Next.js server)
- **Supports:** Middleware, SSR, Hub routes

## Current Situation

Looking at your code:
- ✅ You have `azure-static-web-app.yml` workflow
- ✅ `next.config.ts` is set to `output: 'export'` (static)
- ❌ But you need Hub which requires server-side features

## Recommendation

**Option 1: Keep Static Web App for Public Site + Separate Web App for Hub**
- Static Web App: Public website (`southbnd.co.za`)
- Azure Web App: Hub only (`hub.southbnd.co.za`)
- **Settings for Static Web App:**
  - App location: `/`
  - Output location: `out`
  - Api location: (empty)

**Option 2: Use Azure Web App for Everything (Recommended)**
- Single Azure Web App: Everything (`southbnd.co.za` + `hub.southbnd.co.za`)
- **Settings:** Already configured in your workflow
- **Change `next.config.ts` to:** `output: 'standalone'`

## Which Do You Want?

1. **Static Web App** (public site only, Hub separate) - Use settings above
2. **Azure Web App** (everything together) - Already set up, just need to fix `next.config.ts`

Let me know which approach you prefer!

