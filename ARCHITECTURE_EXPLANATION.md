# Architecture Explanation: How the Split Works

## Current Setup

### What's Actually Happening

**GitHub Pages (`southbnd.co.za`):**
- Builds with `BUILD_TARGET=static` → `output: 'export'`
- Creates static HTML files in `/out` folder
- **Only includes routes that can be statically exported**
- **Excludes `/hub/*` routes** (they require server-side rendering)
- Deploys to GitHub Pages (free, static hosting)

**Azure Web App (`hub.southbnd.co.za`):**
- Builds with `output: 'standalone'` (full Next.js server)
- **Includes ALL routes** - homepage, route-builder, hub, everything
- Runs as a Node.js server
- Can do server-side rendering, API routes, etc.

## The Problem

When you visit `hub.southbnd.co.za`, you see the **entire website** because:
- Azure Web App serves the complete Next.js app
- Next.js doesn't restrict routes by domain by default
- All routes (`/`, `/route-builder`, `/hub/*`, etc.) are available

## Current Architecture

```
┌─────────────────────────────────────┐
│   GitHub Pages (southbnd.co.za)     │
│   Static Export                      │
│   ✅ Homepage                        │
│   ✅ Route Builder                   │
│   ✅ All public pages                │
│   ❌ Hub routes (excluded)            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   Azure Web App (hub.southbnd.co.za)│
│   Full Next.js Server                │
│   ✅ Homepage                        │
│   ✅ Route Builder                   │
│   ✅ Hub routes                      │
│   ✅ Everything                      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   Azure Functions (api.southbnd.co.za)│
│   Backend APIs                       │
│   ✅ /api/cities                     │
│   ✅ /api/routes                     │
│   ✅ /api/leads                      │
│   ✅ /api/images-search              │
└─────────────────────────────────────┘
```

## Solutions

### Option 1: Add Middleware to Redirect Non-Hub Routes (Recommended)

Create middleware that redirects non-hub routes on the Azure Web App domain:

**File:** `src/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // If accessing hub.southbnd.co.za, only allow /hub/* routes
  if (hostname.includes('hub.southbnd.co.za') || hostname.includes('hub')) {
    const pathname = request.nextUrl.pathname;
    
    // Allow hub routes and static assets
    if (
      pathname.startsWith('/hub') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/images') ||
      pathname.startsWith('/favicon')
    ) {
      return NextResponse.next();
    }
    
    // Redirect everything else to hub home
    return NextResponse.redirect(new URL('/hub', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

**Pros:**
- Clean separation
- Users can't accidentally access public routes on hub domain
- Easy to implement

**Cons:**
- Still builds all routes (but redirects them)

### Option 2: Accept Current Behavior (Simplest)

Keep it as-is:
- `southbnd.co.za` → Public website (GitHub Pages)
- `hub.southbnd.co.za` → Full app (Azure Web App)
- Users can access everything on hub domain, but that's okay

**Pros:**
- No code changes needed
- Works immediately
- Hub still accessible

**Cons:**
- Hub domain shows full site
- Slightly confusing UX

### Option 3: Separate Hub-Only Build (Most Complex)

Create a separate build that only includes hub routes:
- More complex build process
- Requires code restructuring
- Not recommended unless necessary

## Recommendation

**Use Option 1 (Middleware)** - It's clean, simple, and provides proper separation.

## Current State Summary

| Domain | What It Serves | Build Mode |
|--------|---------------|------------|
| `southbnd.co.za` | Public website + Route Builder (static) | Static export |
| `hub.southbnd.co.za` | **Everything** (including hub) | Standalone server |
| `api.southbnd.co.za` | Backend APIs only | Azure Functions |

The "split" is more about **deployment targets** than **route restrictions**. Both GitHub Pages and Azure Web App can serve the same routes, but:
- GitHub Pages = Static only (no server features)
- Azure Web App = Full server (all features)

