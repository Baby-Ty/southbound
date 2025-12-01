# Southbnd Codebase Context & Coding Standards

> **Last Updated:** 2024  
> **Purpose:** Reference guide for maintaining clean, sustainable code

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Coding Standards](#coding-standards)
6. [Best Practices](#best-practices)
7. [Patterns & Conventions](#patterns--conventions)
8. [Environment Variables](#environment-variables)
9. [Deployment](#deployment)
10. [Maintenance Rules](#maintenance-rules)

---

## Project Overview

**Southbnd** is a modern travel experience platform built for South Africans working remotely. The platform helps users discover work-friendly destinations, plan routes, and book curated travel experiences.

### Key Features
- **Next.js 15** frontend with App Router
- **Azure Functions** for serverless API endpoints
- **Azure Cosmos DB** for data storage
- **Azure Blob Storage** for image assets
- **Route Builder** for trip planning
- **Hub Dashboard** for internal tools

---

## Architecture

### Frontend (Next.js)
- **Framework:** Next.js 15.4.4 with App Router
- **Language:** TypeScript (strict mode enabled)
- **Styling:** Tailwind CSS with custom design system
- **State Management:** React hooks and server components
- **Build Output:** Static export (`out/`) or standalone server

### Backend (Azure Functions)
- **Runtime:** Node.js with TypeScript
- **Framework:** Azure Functions v4
- **Database:** Azure Cosmos DB
- **Storage:** Azure Blob Storage
- **Deployment:** Azure Functions App

### Data Flow
```
Frontend (Next.js) 
  ↓ API Routes (/api/*)
  ↓ Azure Functions (/functions/*)
  ↓ Azure Cosmos DB / Blob Storage
```

---

## Technology Stack

### Core Dependencies
- **React 19.1.0** - UI library
- **Next.js 15.4.4** - React framework
- **TypeScript 5** - Type safety
- **Tailwind CSS 3.4.17** - Styling

### Backend Services
- **@azure/cosmos** (^4.9.0) - Database client
- **@azure/storage-blob** (^12.29.1) - Blob storage
- **@azure/functions** (^4.5.1) - Functions runtime

### Content & Media
- **Mock Data** - Static data in `src/lib/mockData.ts` for trips and FAQs
- **Azure Blob Storage** - Image storage and CDN

### UI Libraries
- **framer-motion** (^12.23.9) - Animations
- **lenis** (^1.3.15) - Smooth scrolling
- **lucide-react** (^0.526.0) - Icons
- **@react-three/fiber** (^9.4.0) - 3D graphics
- **three** (^0.180.0) - 3D library

### Utilities
- **nanoid** (^5.1.6) - ID generation
- **openai** (^4.104.0) - AI integration
- **next-auth** (^4.24.13) - Authentication

---

## Project Structure

```
southbound/
├── src/                          # Next.js source code
│   ├── app/                      # App Router pages
│   │   ├── api/                  # Next.js API routes
│   │   ├── hub/                  # Internal dashboard
│   │   ├── destinations/         # Destination pages
│   │   └── [other pages]/        # Public pages
│   ├── components/               # React components
│   │   ├── ui/                   # Base UI components
│   │   ├── sections/             # Page sections
│   │   ├── RouteBuilder/         # Route builder components
│   │   └── hub/                  # Hub-specific components
│   ├── lib/                      # Utility libraries
│   │   ├── mockData.ts           # Mock data for trips and FAQs
│   │   ├── cosmos.ts             # Cosmos DB client
│   │   ├── azureBlob.ts          # Blob storage client
│   │   └── [other utilities]/    # Helper functions
│   ├── hooks/                    # Custom React hooks
│   └── types/                    # TypeScript type definitions
│
├── functions/                    # Azure Functions
│   ├── cities/                   # Cities API endpoint
│   ├── routes/                   # Routes API endpoint
│   ├── images-generate/          # Image generation
│   ├── images-search/            # Image search
│   ├── upload-image/             # Image upload
│   └── shared/                   # Shared utilities
│       ├── cosmos.ts             # Cosmos DB helpers
│       ├── cosmos-cities.ts      # Cities-specific DB ops
│       ├── azureBlob.ts          # Blob storage helpers
│       ├── cors.ts               # CORS configuration
│       └── email.ts              # Email utilities
│
├── scripts/                      # Utility scripts
│   ├── migrate-images-to-blob.ts # Image migration
│   ├── configure-blob-cors.ts   # CORS setup
│   └── [other scripts]/         # Setup & migration scripts
│
├── public/                       # Static assets
│   └── images/                   # Image files
│
├── out/                         # Static export output (gitignored)
├── .next/                       # Next.js build cache (gitignored)
└── functions/dist/              # Compiled Azure Functions (gitignored)
```

---

## Coding Standards

### TypeScript

#### ✅ DO
- Use **strict mode** (`strict: true` in tsconfig.json)
- Define explicit types for function parameters and return values
- Use interfaces for object shapes
- Prefer `type` for unions and intersections
- Use `const` assertions for immutable data
- Leverage TypeScript's type inference where appropriate

#### ❌ DON'T
- Don't use `any` - use `unknown` or proper types
- Don't disable TypeScript errors with `@ts-ignore` without justification
- Don't use `// eslint-disable` without fixing the underlying issue
- Don't mix `var` with `let`/`const`

**Example:**
```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  name: string;
}

async function getUser(id: string): Promise<User | null> {
  // implementation
}

// ❌ Bad
async function getUser(id: any): Promise<any> {
  // implementation
}
```

### React Components

#### ✅ DO
- Use **functional components** with hooks
- Use **Server Components** by default (Next.js App Router)
- Extract reusable logic into custom hooks
- Keep components small and focused (single responsibility)
- Use descriptive component and prop names
- Export components from `index.ts` files for cleaner imports

#### ❌ DON'T
- Don't use class components
- Don't mix client/server component patterns unnecessarily
- Don't create overly complex components (>200 lines)
- Don't use inline styles when Tailwind classes suffice

**Component Structure:**
```typescript
// ✅ Good - Server Component
export default async function Page() {
  const data = await fetchData();
  return <PageContent data={data} />;
}

// ✅ Good - Client Component (when needed)
'use client';

import { useState } from 'react';

export function InteractiveComponent() {
  const [state, setState] = useState();
  // implementation
}
```

### File Naming

#### ✅ DO
- Use **PascalCase** for components: `UserProfile.tsx`
- Use **camelCase** for utilities: `formatDate.ts`
- Use **kebab-case** for pages/routes: `user-profile/page.tsx`
- Use **UPPER_SNAKE_CASE** for constants: `MAX_RETRIES`

#### File Extensions
- `.tsx` - React components
- `.ts` - TypeScript utilities/types
- `.css` - Styles (rare, prefer Tailwind)

### Styling (Tailwind CSS)

#### ✅ DO
- Use **Tailwind utility classes** for styling
- Leverage **custom design tokens** from `tailwind.config.js`
- Use **custom color palette** (`sb-teal`, `sb-orange`, `sb-navy`, etc.)
- Group related classes logically
- Use **responsive prefixes** (`sm:`, `md:`, `lg:`)
- Extract repeated patterns into components

#### ❌ DON'T
- Don't use inline styles (`style={{}}`)
- Don't create custom CSS files unless absolutely necessary
- Don't use arbitrary values when design tokens exist
- Don't mix Tailwind with CSS modules unnecessarily

**Example:**
```tsx
// ✅ Good
<button className="bg-sb-teal-500 hover:bg-sb-teal-600 text-white px-6 py-3 rounded-full transition-colors">
  Submit
</button>

// ❌ Bad
<button style={{ backgroundColor: '#4ABDC6', padding: '12px 24px' }}>
  Submit
</button>
```

### Error Handling

#### ✅ DO
- Use **try-catch** blocks for async operations
- Provide **fallback data** when external services fail
- Log errors with context (`context.log()` in Azure Functions)
- Return appropriate HTTP status codes
- Handle edge cases (null, undefined, empty arrays)

#### ❌ DON'T
- Don't silently swallow errors
- Don't expose sensitive error details in production
- Don't use generic error messages without context

**Example:**
```typescript
// ✅ Good
async function getCities(region?: string) {
  try {
    if (!isCosmosDBConfigured()) {
      console.warn('CosmosDB not configured, returning empty array');
      return [];
    }
    return await getAllCities(region);
  } catch (error: any) {
    console.error(`Error fetching cities: ${error.message}`, error);
    return []; // Fallback to empty array
  }
}

// ❌ Bad
async function getCities(region?: string) {
  return await getAllCities(region); // No error handling
}
```

### Environment Variables

#### ✅ DO
- Use **descriptive names** with prefixes (`NEXT_PUBLIC_`, `COSMOSDB_`)
- Provide **default values** where safe
- Validate required environment variables at startup
- Document all environment variables in `.env.example`

#### ❌ DON'T
- Don't commit `.env` files to git
- Don't use environment variables for client-side secrets
- Don't hardcode values that should be configurable

**Pattern:**
```typescript
// ✅ Good
const endpoint = process.env.COSMOSDB_ENDPOINT || '';
const key = process.env.COSMOSDB_KEY || '';

if (!endpoint || !key) {
  throw new Error('CosmosDB credentials not configured');
}

// ❌ Bad
const endpoint = 'https://hardcoded-endpoint.documents.azure.com';
```

---

## Best Practices

### 1. Code Organization

- **Group related files** in directories
- **Co-locate** components with their styles/types when appropriate
- **Separate concerns**: UI components, business logic, data access
- **Use barrel exports** (`index.ts`) for cleaner imports

### 2. Performance

- **Use Server Components** by default (Next.js App Router)
- **Lazy load** heavy components (`dynamic()`)
- **Optimize images** with Next.js Image component
- **Cache** API responses when appropriate
- **Minimize bundle size** - import only what you need

### 3. Accessibility

- **Use semantic HTML** (`<nav>`, `<main>`, `<article>`)
- **Provide alt text** for images
- **Ensure keyboard navigation** works
- **Maintain color contrast** ratios
- **Test with screen readers**

### 4. Security

- **Validate user input** on both client and server
- **Sanitize data** before storing in database
- **Use HTTPS** in production
- **Implement CORS** properly (see `functions/shared/cors.ts`)
- **Never expose secrets** in client-side code

### 5. Testing (Future)

- Write **unit tests** for utilities
- Write **integration tests** for API routes
- Write **component tests** for complex UI
- Use **TypeScript** to catch errors at compile time

---

## Patterns & Conventions

### API Routes (Next.js)

**Pattern:**
```typescript
// src/app/api/resource/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const data = await fetchData();
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Azure Functions

**Pattern:**
```typescript
// functions/resource/index.ts
import { app, HttpRequest, HttpResponseInit } from '@azure/functions';
import { createCorsResponse } from '../shared/cors';

export async function handler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return { status: 204, headers: corsHeaders };
  }

  try {
    if (request.method === 'GET') {
      const data = await fetchData();
      return createCorsResponse({ data });
    }
    return createCorsResponse({ error: 'Method not allowed' }, 405);
  } catch (error: any) {
    context.log(`Error: ${error.message}`);
    return createCorsResponse(
      { error: error.message || 'Internal server error' },
      500
    );
  }
}

app.http('resource', {
  methods: ['GET', 'POST', 'OPTIONS'],
  authLevel: 'anonymous',
  handler,
});
```

### Database Queries (Cosmos DB)

**Pattern:**
```typescript
// functions/shared/cosmos.ts
export async function getContainer(containerId: string): Promise<Container> {
  const db = await getDatabase();
  const { container } = await db.containers.createIfNotExists({
    id: containerId,
    partitionKey: { paths: ['/id'] },
  });
  return container;
}

export async function queryItems<T>(
  containerId: string,
  query: string,
  params: any[] = []
): Promise<T[]> {
  const container = await getContainer(containerId);
  const { resources } = await container.items
    .query({ query, parameters: params })
    .fetchAll();
  return resources as T[];
}
```

### Mock Data Pattern

**Pattern:**
```typescript
// src/lib/mockData.ts
export const mockTrips: TripCard[] = [
  {
    id: '1',
    title: 'Example Trip',
    destination: 'Bali',
    // ... other fields
  },
];

// Usage in pages
import { mockTrips } from '@/lib/mockData';

export default async function Page() {
  // Use mock data or fetch from Cosmos DB
  const trips = await getTrips() || mockTrips;
  return <PageContent data={trips} />;
}
```

### Component Patterns

**Server Component (Default):**
```typescript
// src/app/page.tsx
import { mockTrips } from '@/lib/mockData';

export default async function Page() {
  // Fetch from Cosmos DB or use mock data
  const data = await fetchFromCosmos() || mockTrips;
  return <PageContent data={data} />;
}
```

**Client Component (When Needed):**
```typescript
// src/components/InteractiveComponent.tsx
'use client';

import { useState, useEffect } from 'react';

export function InteractiveComponent() {
  const [state, setState] = useState();
  
  useEffect(() => {
    // Client-side logic
  }, []);

  return <div>{/* JSX */}</div>;
}
```

---

## Environment Variables

### Required Variables

#### Next.js Frontend
```bash
# Build Configuration
BUILD_TARGET=static  # or 'standalone'
```

#### Azure Functions
```bash
# Cosmos DB
COSMOSDB_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOSDB_KEY=your-key
COSMOSDB_DATABASE_ID=southbound

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=your-connection-string
AZURE_STORAGE_CONTAINER_NAME=images

# OpenAI (for image generation)
OPENAI_API_KEY=your-key

# Email (if using)
EMAIL_SERVICE_API_KEY=your-key
```

### Environment File Structure

- **`.env.local`** - Local development (gitignored)
- **`.env.example`** - Template for required variables (committed)
- **Azure Portal** - Production environment variables

---

## Deployment

### Frontend (Next.js)

**Static Export:**
```bash
BUILD_TARGET=static npm run build
# Output: out/
```

**Standalone Server:**
```bash
BUILD_TARGET=standalone npm run build
# Output: .next/standalone/
```

**Deployment Targets:**
- **GitHub Pages** - Static export
- **Azure Web App** - Standalone server
- **Vercel** - Automatic (recommended)

### Backend (Azure Functions)

**Build:**
```bash
cd functions
npm run build
```

**Deploy:**
```bash
func azure functionapp publish <function-app-name>
```

**Configuration:**
- Set environment variables in Azure Portal
- Configure CORS in `host.json`
- Set up Application Insights for monitoring

---

## Maintenance Rules

### 🎯 Code Quality

1. **Keep functions small** (< 50 lines when possible)
2. **Single Responsibility Principle** - One function, one purpose
3. **DRY (Don't Repeat Yourself)** - Extract common logic
4. **KISS (Keep It Simple)** - Prefer simple solutions over complex ones
5. **YAGNI (You Aren't Gonna Need It)** - Don't add features until needed

### 📝 Documentation

1. **Comment complex logic** - Explain "why", not "what"
2. **Document API endpoints** - Include request/response examples
3. **Update README** - Keep setup instructions current
4. **Document environment variables** - List all required vars
5. **Write clear commit messages** - Use conventional commits

### 🔄 Refactoring

1. **Refactor incrementally** - Small, safe changes
2. **Maintain backward compatibility** - Don't break existing APIs
3. **Test after refactoring** - Verify functionality still works
4. **Update types** - Keep TypeScript types in sync
5. **Remove dead code** - Delete unused files/functions

### 🐛 Bug Fixes

1. **Reproduce the bug** - Understand the issue first
2. **Write a test** - Prevent regression (when tests exist)
3. **Fix the root cause** - Not just symptoms
4. **Test the fix** - Verify it works
5. **Document the fix** - Add comments if needed

### 🚀 Feature Development

1. **Plan before coding** - Understand requirements
2. **Follow existing patterns** - Consistency is key
3. **Update types** - Add TypeScript types for new data
4. **Handle errors** - Implement proper error handling
5. **Test manually** - Verify the feature works
6. **Update documentation** - Document new features

### 🔒 Security

1. **Never commit secrets** - Use environment variables
2. **Validate input** - Sanitize user data
3. **Use HTTPS** - Always in production
4. **Keep dependencies updated** - Run `npm audit`
5. **Review third-party code** - Understand what you're using

### 📊 Performance

1. **Monitor bundle size** - Keep it reasonable
2. **Optimize images** - Use Next.js Image component
3. **Cache appropriately** - Don't over-cache
4. **Lazy load** - Load code when needed
5. **Profile before optimizing** - Measure first

### 🧹 Cleanup

1. **Remove unused imports** - Keep imports clean
2. **Delete commented code** - Use git history instead
3. **Remove console.logs** - Use proper logging
4. **Clean up temporary files** - Don't commit build artifacts
5. **Organize files** - Keep structure logical

---

## Quick Reference

### Import Paths
```typescript
// Use @ alias for src directory
import { Button } from '@/components/ui/Button';
import { mockTrips } from '@/lib/mockData';
import type { User } from '@/types';
```

### Common Commands
```bash
# Development
npm run dev              # Start Next.js dev server

# Build
npm run build           # Build Next.js app
cd functions && npm run build  # Build Azure Functions

# Linting
npm run lint            # Run ESLint

# Deployment
npm run deploy          # Deploy to GitHub Pages
```

### Design Tokens (Tailwind)
```typescript
// Colors
sb-teal-500    // Primary teal
sb-orange-500  // Primary orange
sb-navy-700    // Primary text color
sb-beige-100   // Background

// Usage
className="bg-sb-teal-500 text-white"
```

---

## Additional Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Azure Functions Docs:** https://docs.microsoft.com/azure/azure-functions/
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **Azure Cosmos DB Docs:** https://docs.microsoft.com/azure/cosmos-db/
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/

---

**Remember:** Code is read more often than it's written. Write code for your future self and your teammates. Keep it clean, simple, and maintainable.

