---
name: Country Management & Detours
overview: Add country-level management to the hub and introduce detours (shorter 1-2 week stops) as a special type of city. Users will be able to extend their stay in a country or add quick detours from each city in their itinerary.
todos:
  - id: database-schema
    content: Create Country entity and add detour fields to City entity in Cosmos DB
    status: completed
  - id: api-routes
    content: Build Country API routes and extend Cities API with country/detour filters
    status: completed
  - id: hub-countries
    content: Create country management pages in hub (list, create, edit, delete)
    status: completed
  - id: hub-cities-update
    content: Update city form to use country dropdown and add detour fields
    status: completed
  - id: trip-options-buttons
    content: Add 'Extend Country' and 'Add Detours' buttons to city cards
    status: completed
  - id: city-selector-filters
    content: Enhance city selector with country/detour filters and drawer modes
    status: completed
  - id: detour-styling
    content: Add visual styling for detour cards (badge, shorter duration, teal accent)
    status: completed
  - id: data-migration
    content: Run migration scripts to add detour fields and populate countries
    status: completed
---

# Country Management & Detours Enhancement

## Overview

Enhance the trip options screen by adding "Extend Country" and "Detours" buttons below each city, and restructure the hub to manage destinations at the country level with support for detour cities.

## Strategy

**For Detours:** We'll use the same `CityData` entity with an `isDetour` flag rather than creating a separate entity. This keeps data management simple and allows detours to inherit all city functionality (images, activities, accommodations, etc.).

**For Countries:** Based on the need to add country-level information and organize cities by country in the hub, I recommend creating a `Country` entity. This will:

- Store country-level descriptions and metadata
- Enable better navigation: Region > Country > Cities
- Allow associating detours with countries
- Future-proof for country-specific info (visa requirements, currency, etc.)

## Database Changes

### 1. Extend CityData Interface

**File:** `src/lib/cosmos-cities.ts`

Add these new fields to the `CityData` interface:

```typescript
// New fields for detour support
isDetour?: boolean; // Flag to mark as detour
nearbyCity?: string; // Main city this detour is near (e.g., "Bali" for Ubud)
suggestedDuration?: number; // Suggested weeks (1-2 for detours, 4 for main cities)
```

### 2. Create Country Entity

**Files:**

- `src/lib/cosmos-countries.ts` (new)
- `functions/shared/cosmos-countries.ts` (new, shared with Azure Functions)

Create `CountryData` interface:

```typescript
interface CountryData {
  id: string;
  name: string;
  flag: string;
  region: RegionKey;
  description?: string; // Rich description of the country
  enabled: boolean;
  // For future enhancements
  visaInfo?: string;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}
```

Implement CRUD operations:

- `getAllCountries(region?: RegionKey)`
- `getCountry(countryId: string)`
- `getCountryByName(name: string, region: RegionKey)`
- `saveCountry(countryData)`
- `updateCountry(countryId, updates)`
- `deleteCountry(countryId)`

## API Routes

### 1. Country API Routes

**Files to create:**

- `src/app/api/countries/route.ts` - GET all, POST new
- `src/app/api/countries/[id]/route.ts` - GET one, PATCH update, DELETE
- `src/app/api/countries/by-region/[region]/route.ts` - GET by region

### 2. Extend Cities API

**File:** `src/app/api/cities/route.ts`

Add query parameter support:

- `?country=Mexico` - Filter cities by country
- `?isDetour=true` - Filter only detours
- `?mainCities=true` - Filter only non-detour cities

## Hub - Country Management

### 1. Countries List Page

**File:** `src/app/hub/destinations/countries/page.tsx` (new)

Features:

- List all countries grouped by region
- Quick stats: # of cities, # of detours per country
- Enable/disable countries
- Link to edit country details

### 2. Country Form

**Files:**

- `src/app/hub/destinations/countries/new/page.tsx` (new)
- `src/app/hub/destinations/countries/[id]/page.tsx` (new)
- `src/components/hub/CountryFormClient.tsx` (new)

Form fields:

- Name, Flag, Region
- Description (markdown editor)
- List of cities in this country (read-only, links to edit)
- List of detours in this country (read-only, links to edit)

### 3. Update City Form

**File:** `src/app/hub/destinations/cities/CityFormClient.tsx`

Changes:

- Replace country text input with country dropdown (fetched from API)
- Add "Is Detour" checkbox
- If detour: show "Nearby City" dropdown (cities in same country)
- Add "Suggested Duration (weeks)" field (defaults: 4 for cities, 1.5 for detours)

### 4. Update Hub Navigation

**File:** `src/app/hub/destinations/page.tsx`

Update navigation flow:

```
Destinations 
  ├── Regions (existing)
  ├── Countries (new) 
  │   └── List/Create/Edit countries
  └── Cities (existing)
      └── List/Create/Edit cities & detours
```

## Trip Options Screen Enhancements

### 1. Add Buttons to City Cards

**File:** `src/components/RouteBuilder/EnhancedCityCard.tsx`

Below each city card's action bar (around line 992), add two new buttons:

```tsx
{/* New section above the existing action buttons */}
<div className="border-t border-sb-beige-200 pt-4 pb-2 px-5 flex gap-2">
  <button
    onClick={(e) => {
      e.stopPropagation();
      onExtendCountry(stop.country);
    }}
    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-sb-teal-50 border border-sb-teal-200 rounded-xl hover:bg-sb-teal-100 transition-all text-sm font-bold text-sb-teal-700"
  >
    <Plus className="w-4 h-4" />
    Extend {stop.country} +1 Month
  </button>
  
  <button
    onClick={(e) => {
      e.stopPropagation();
      onShowDetours(stop.country);
    }}
    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-sb-orange-50 border border-sb-orange-200 rounded-xl hover:bg-sb-orange-100 transition-all text-sm font-bold text-sb-orange-700"
  >
    <MapPin className="w-4 h-4" />
    Add Detour
  </button>
</div>
```

### 2. Update City Selector Modal

**File:** `src/app/trip-options/page.tsx`

Enhance the `RightDrawer` city selector:

- Add filter toggle: "Main Cities" vs "Detours"
- When opened from "Extend Country", filter to same country
- When opened from "Add Detour", filter to detours in/near same country
- Show detour badge on detour cities

Add state:

```typescript
const [drawerMode, setDrawerMode] = useState<'add' | 'swap' | 'extend-country' | 'detours'>(
  'add'
);
const [drawerCountryFilter, setDrawerCountryFilter] = useState<string | null>(null);
```

### 3. Detour Card Styling

**File:** `src/components/RouteBuilder/EnhancedCityCard.tsx`

Add visual distinction for detours:

- Add "Detour" badge in top-left corner (near #1, #2, #3 badge)
- Shorter default duration (1-2 weeks instead of 4)
- Show "Near [main city]" subtitle
- Slightly different card styling (maybe teal accent instead of orange)

Check `stop.isDetour` and apply conditional styles:

```tsx
{stop.isDetour && (
  <div className="absolute top-12 left-5 bg-sb-teal-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md z-10">
    <MapPin className="w-3 h-3" />
    Detour
  </div>
)}
```

### 4. Update Stop Duration Logic

**File:** `src/app/trip-options/page.tsx`

In `makeStopFromPreset` function:

```typescript
function makeStopFromPreset(p: CityPreset, idx: number, idSuffix?: string): StopPlan {
  // Use suggestedDuration from city data, or default based on detour status
  const defaultWeeks = p.isDetour ? 1.5 : 4;
  const weeks = p.suggestedDuration || defaultWeeks;
  
  return {
    id: `${p.city}-${idx}-${idSuffix || Math.random().toString(36).slice(2, 7)}`,
    city: p.city,
    country: p.country,
    weeks: weeks,
    isDetour: p.isDetour || false,
    // ... rest of fields
  };
}
```

## Data Migration

### Update Existing Cities

**Script:** `scripts/migrate-add-detour-fields.ts` (new)

Create a migration script to:

1. Add `isDetour: false` to all existing cities
2. Set `suggestedDuration: 4` for existing cities
3. Identify detour candidates (Ubud, Gili T, etc.) and flag them manually

### Populate Countries

**Script:** `scripts/populate-countries.ts` (new)

Extract unique countries from existing cities and create Country entities:

```typescript
// Example countries to create
const countries = [
  { name: 'Indonesia', region: 'southeast-asia', flag: '🇮🇩' },
  { name: 'Thailand', region: 'southeast-asia', flag: '🇹🇭' },
  { name: 'Vietnam', region: 'southeast-asia', flag: '🇻🇳' },
  { name: 'Mexico', region: 'latin-america', flag: '🇲🇽' },
  // ... etc
];
```

## Implementation Order

1. **Database Layer** (Day 1-2)

   - Add detour fields to CityData
   - Create CountryData interface and CRUD operations
   - Create cosmos-countries.ts

2. **API Routes** (Day 2)

   - Countries API routes (GET, POST, PATCH, DELETE)
   - Extend cities API with filters

3. **Hub - Countries** (Day 3-4)

   - Countries list page
   - Country form component
   - Update city form to use country dropdown
   - Update navigation

4. **Trip Options - Core** (Day 4-5)

   - Add extend/detour buttons to city cards
   - Update city selector with filters
   - Implement detour visual styling

5. **Testing & Polish** (Day 5-6)

   - Test country CRUD
   - Test city-detour relationships
   - Test trip builder with detours
   - Data migration for existing cities

## Key Files Summary

### New Files

- `src/lib/cosmos-countries.ts` - Country CRUD
- `src/app/api/countries/**` - Country API routes
- `src/app/hub/destinations/countries/**` - Country management UI
- `src/components/hub/CountryFormClient.tsx` - Country form
- `scripts/migrate-add-detour-fields.ts` - Migration script
- `scripts/populate-countries.ts` - Populate countries

### Modified Files

- `src/lib/cosmos-cities.ts` - Add detour fields
- `src/app/api/cities/route.ts` - Add filters
- `src/app/hub/destinations/cities/CityFormClient.tsx` - Country dropdown
- `src/app/trip-options/page.tsx` - Drawer modes, filtering
- `src/components/RouteBuilder/EnhancedCityCard.tsx` - Detour styling, buttons
- `src/app/hub/destinations/page.tsx` - Add countries link

## Notes

- Detours will share all city functionality (images, activities, accommodations)
- Users can add multiple detours per country
- Detours appear in chronological order in the itinerary
- The "Extend Country" button helps users quickly find more cities in the same country they're already visiting
- Admin can mark any city as a detour in the hub