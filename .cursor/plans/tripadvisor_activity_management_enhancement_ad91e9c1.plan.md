---
name: TripAdvisor Activity Management Enhancement
overview: Enhance admin activity management with multi-page TripAdvisor fetching and improve user experience with custom activity creation, including image selection and AI-powered description polishing.
todos:
  - id: admin-multi-page
    content: Add multi-page TripAdvisor fetching to ActivityManager with page controls and progress indicators
    status: completed
  - id: default-limit
    content: Implement 2-default activity limit with validation in UI and backend
    status: completed
  - id: custom-activity-modal
    content: Create CustomActivityModal with image upload/search/generate tabs and activity form
    status: completed
  - id: ai-polish-api
    content: Build AI description polishing API endpoint using OpenAI
    status: completed
  - id: integration
    content: Wire CustomActivityModal to EnhancedCityCard and handle custom activity storage
    status: completed
---

# TripAdvisor Activity Management Enhancement

## Overview

Enhance the admin hub to allow fetching multiple pages of TripAdvisor activities with a 2-default-activity limit, and improve the user experience by adding a custom activity creation modal with image upload/search/AI generation and AI-powered description polishing.

## Admin Side Changes

### 1. Multi-Page TripAdvisor Fetching

**File: `src/components/hub/ActivityManager.tsx`**

- Add page controls for fetching from TripAdvisor API
- Display "Pull Page 1", "Pull Page 2", etc. buttons
- Show total activities pulled vs. available
- Add loading states for each page fetch

**File: `src/app/api/cities/[id]/activities/pull/route.ts`**

- Already has page parameter support
- Enhance to fetch sequentially from TripAdvisor (page 1, then page 2, etc.)
- Return metadata about total pages available

**File: `src/lib/tripadvisor.ts`**

- Add pagination support to `searchCityAttractions` method
- Handle TripAdvisor's limit per request (typically 30-50 per page)

### 2. Default Activity Limit

**File: `src/components/hub/ActivityManager.tsx`**

- Add validation: max 2 activities can be marked as default
- Show warning when trying to mark 3rd activity as default
- Display badge showing "2/2 defaults selected"

**File: `src/lib/cosmos-cities.ts`**

- Add validation in `toggleActivityDefault` to enforce 2-default limit
- Auto-unmark oldest default if user tries to mark a 3rd

## User Side Changes

### 3. Enhanced City Card Activity Display

**File: `src/components/RouteBuilder/EnhancedCityCard.tsx`**

- Already shows 2 default activities + Add Activity card (line 482-606)
- Ensure "Add Activity" card is styled like the screenshot (dashed border, + icon, text)
- **Import missing `Plus` icon** from lucide-react (currently missing)

### 4. Custom Activity Creation Modal

**NEW File: `src/components/RouteBuilder/CustomActivityModal.tsx`**

Create a new modal component with:

**Image Selection Section:**

- Three tabs: "Upload File", "Stock Photos", "Generate AI"
- Upload: File input for local images
- Stock Photos: Integration with Unsplash API (use existing `/api/images-search`)
- Generate AI: Use DALL-E to generate activity images (use existing DALL-E integration)

**Activity Details Section:**

- Activity title input field
- Category/type selector (optional)
- Description textarea (large, 3-4 rows)

**AI Polish Button:**

- Call existing AI description generator (`src/lib/aiDescriptionGenerator.ts`)
- Pass: city name, activity title, user's initial description
- Replace textarea content with polished version
- Show loading state during generation

**Actions:**

- Save button: Add custom activity to trip plan (stored in `stop.highlights.customActivities`)
- Cancel button: Close modal without saving

### 5. Custom Activity Storage

**File: `src/components/RouteBuilder/EnhancedCityCard.tsx`**

- Custom activities already supported via `CustomActivity` interface (line 45-52)
- Store in `stop.highlights.customActivities` array
- Display custom activities alongside TripAdvisor ones
- Add visual indicator (badge) to distinguish custom from TripAdvisor activities

### 6. API Integration for AI Polishing

**NEW File: `src/app/api/activities/polish-description/route.ts`**

Create endpoint for description polishing:

- Accept: city, country, activity title, initial description
- Use OpenAI to enhance description (250-300 words)
- Return: polished description with better structure and travel-focused language

## Key Files to Modify/Create

### Modify:

1. `src/components/hub/ActivityManager.tsx` - Multi-page fetch UI
2. `src/app/api/cities/[id]/activities/pull/route.ts` - Page handling
3. `src/lib/tripadvisor.ts` - Pagination support
4. `src/lib/cosmos-cities.ts` - 2-default validation
5. `src/components/RouteBuilder/EnhancedCityCard.tsx` - Import Plus icon, wire custom activity modal

### Create:

1. `src/components/RouteBuilder/CustomActivityModal.tsx` - Main custom activity form
2. `src/app/api/activities/polish-description/route.ts` - AI description polishing endpoint

## Technical Details

### Image Upload Flow:

```typescript
// Upload → Azure Blob Storage → Return URL
// Reuse existing: src/lib/azureBlob.ts uploadToAzure()
```

### Stock Photo Search:

```typescript
// Reuse: GET /api/images-search?query={cityName}+{activityTitle}
// Returns: { id, url, thumb, alt, user }[]
```

### AI Image Generation:

```typescript
// Reuse existing DALL-E integration
// Prompt: "Travel photo of {activityTitle} in {cityName}, high quality, realistic"
```

### AI Description Polish:

```typescript
// POST /api/activities/polish-description
// Body: { city, country, title, description }
// Uses: OpenAI GPT-4 to enhance travel writing
```

## Validation & Constraints

1. **Admin:** Maximum 2 default activities per city
2. **User:** Custom activities stored only in trip plan (not database)
3. **Images:** Support JPG, PNG, WebP (max 5MB)
4. **Description:** Min 50 chars, max 1000 chars before AI polish

## Testing Checklist

1. Admin can fetch page 1, 2, 3+ from TripAdvisor
2. Admin cannot mark 3rd activity as default (shows error)
3. User sees 2 defaults + "Add Activity" card
4. User can upload/search/generate images
5. AI Polish enhances description quality
6. Custom activities appear in trip plan alongside TripAdvisor ones