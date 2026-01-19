# Curated Trip Templates Implementation

## Overview
Successfully implemented a system to display curated trip templates on the homepage instead of hardcoded city cards.

## What Was Built

### 1. Database Schema Updates ✅
- Added 3 new curated fields to `TripTemplate` in CosmosDB:
  - `isCurated?: boolean` - Marks template for homepage display
  - `curatedOrder?: number` - Display priority (1-4)
  - `curatedImageUrl?: string` - Optional alternate image for homepage
- Added 6 new homepage card display fields:
  - `price?: string` - e.g., "R25,000/mo"
  - `vibe?: string` - Short tagline (e.g., "Beach & Relaxation")
  - `internetSpeed?: string` - e.g., "50 Mbps"
  - `safetyRating?: string` - e.g., "4.5/5"
  - `avgWeather?: string` - e.g., "27°C"
  - `bestFor?: string` - e.g., "Surfing & Cafes"

**File:** `functions/shared/cosmos.ts`

### 2. API Updates ✅
- **GET** `/api/trip-templates?curated=true` - Fetch curated templates
- **PATCH** `/api/trip-templates/:id` - Update template fields including curated status
- Sorting logic prioritizes `curatedOrder` for curated templates

**Files:** 
- `functions/trip-templates/index.ts`
- `functions/trip-templates-by-id/index.ts`

### 3. Frontend Type Definitions ✅
- Updated `TripTemplate` interface with new curated fields

**File:** `src/lib/tripTemplates.ts`

### 4. Homepage Integration ✅
- `DestinationsGrid` component now:
  - Fetches curated templates from API on mount
  - Displays top 4 curated templates (sorted by `curatedOrder`)
  - Falls back to hardcoded cities if API fails
  - Links to `/templates?expanded={templateId}`
  - Uses `curatedImageUrl` or falls back to `imageUrl`

**File:** `src/components/sections/DestinationsGrid.tsx`

### 5. Templates Page Deep Linking ✅
- Added URL parameter support: `/templates?expanded={templateId}`
- **Fetches templates from API** (not static data) to ensure ID consistency with homepage
- Auto-expands specified template on page load
- Auto-selects correct region tab for the template
- Smooth scroll to expanded card with `block: 'center'` positioning
- Loading state while fetching templates
- Each template card has unique `id="template-{templateId}"` for scroll targeting

**File:** `src/app/templates/page.tsx`

### 6. Hub Management Interface ✅
- New admin page at `/hub/templates`
- Features:
  - View all templates grouped by region
  - **Inline editing** of ALL template fields:
    - Basic info: name, description, icon
    - Images: default image URL, curated homepage image URL
    - Content: story/journey description
    - Cities: preset cities (comma-separated)
    - Tags: template tags (comma-separated)
  - **Homepage card fields** (visible when curated):
    - Price (e.g., "R25,000/mo")
    - Vibe (short tagline)
    - Internet Speed (e.g., "50 Mbps")
    - Safety Rating (e.g., "4.5/5")
    - Average Weather (e.g., "27°C")
    - Best For (e.g., "Surfing & Cafes")
  - Toggle "Curated" status
  - Set display order (1-4)
  - Expand/collapse for detailed editing
  - Live homepage preview showing top 4
  - Batch save changes
  - Visual indicators for pending changes

**File:** `src/app/hub/templates/page.tsx`

### 7. Navigation ✅
- Added "Templates" link to hub sidebar
- Icon: Sparkles
- Route: `/hub/templates`

**File:** `src/app/hub/components/Sidebar.tsx`

### 8. Seed Script ✅
- Updated to include curated fields (default: `false`)

**File:** `scripts/seed-trip-templates.ts`

## User Flows

### For Website Visitors:
1. Visit homepage
2. See 4 beautiful curated trip template cards
3. Click a card → Navigate to `/templates` page with that template expanded
4. View full template details (cities, story, tags)
5. Click "Build Your Route" → Start planning

### For Admins:
1. Navigate to **Hub → Templates**
2. Browse all trip templates
3. Mark 4 templates as "Curated"
4. Set display order (1-4)
5. Optionally set custom homepage image
6. Preview changes in real-time
7. Click "Save Changes"
8. Homepage automatically updates

## Image Handling
- Images are stored in **Azure Blob Storage**
- Only **URL strings** stored in CosmosDB
- `curatedImageUrl` allows different image for homepage vs templates page
- Falls back to `imageUrl` if `curatedImageUrl` not set

## Testing Checklist

- [ ] Run seed script: `npx tsx scripts/seed-trip-templates.ts`
- [ ] Verify templates exist in CosmosDB
- [ ] Test API endpoint: `GET /api/trip-templates?curated=true`
- [ ] Navigate to `/hub/templates`
- [ ] Mark 4 templates as curated with orders 1-4
- [ ] Verify "Save Changes" works
- [ ] Visit homepage - should show 4 curated templates
- [ ] Click a homepage card - should navigate to templates page with card expanded
- [ ] Test fallback: Disable all curated templates, homepage should show hardcoded cities

## Next Steps

1. **Seed Existing Templates** (if not already done):
   ```bash
   npx tsx scripts/seed-trip-templates.ts
   ```

2. **Curate 4 Templates**:
   - Go to `/hub/templates`
   - Select 4 templates to feature
   - Set their order (1-4)
   - Optionally upload custom homepage images
   - Save changes

3. **Test Homepage**:
   - Visit homepage
   - Verify 4 curated templates display
   - Click each card to test deep linking

4. **Deploy**:
   - Deploy Azure Functions (for API updates)
   - Deploy Next.js app (for UI changes)

## Files Modified/Created

### Modified:
- `functions/shared/cosmos.ts` - Schema + query updates
- `functions/trip-templates/index.ts` - Added curated filtering
- `functions/trip-templates-by-id/index.ts` - Added PATCH support for curated fields
- `src/lib/tripTemplates.ts` - Updated TypeScript interface
- `src/components/sections/DestinationsGrid.tsx` - Dynamic curated templates
- `src/app/templates/page.tsx` - Deep linking support
- `src/app/hub/components/Sidebar.tsx` - Added Templates nav link
- `scripts/seed-trip-templates.ts` - Include curated fields

### Created:
- `src/app/hub/templates/page.tsx` - Hub management interface

## Notes

- All changes are backward compatible
- Existing templates without curated fields will default to `isCurated: false`
- Fallback mechanism ensures homepage never breaks
- Image URLs support both Azure Blob Storage and external URLs (Unsplash, etc.)
- **Templates page now fetches from API** to ensure ID consistency between homepage and templates page (fixes deep linking)
- Template cards have unique IDs for scroll targeting: `template-{templateId}`
- Scroll positioning uses `block: 'center'` for better visibility of expanded cards
