# Route Builder Enhancements - Setup Guide

This document explains the new route builder features and how to set them up.

## Overview

The route builder now supports:
1. **CMS-Managed City/Region Data** - Manage destinations via Sanity CMS
2. **User Route Saving** - Users can save routes with email/WhatsApp links
3. **Admin Route Review** - Review and manage saved routes in the Hub
4. **Shareable Route Links** - Public URLs for saved routes

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# CosmosDB Configuration
COSMOSDB_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOSDB_KEY=your-cosmosdb-key-here
COSMOSDB_DATABASE_ID=southbound

# Email Service (Optional - for sending route links)
# If using Resend:
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=South Bound <noreply@southbound.com>

# Sanity (already configured)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-token (optional, for write operations)
```

## CosmosDB Setup

1. **Create CosmosDB Account** (if not already done)
   - Go to Azure Portal
   - Create a new CosmosDB account
   - Note the endpoint and key

2. **Database and Containers**
   The code will automatically create:
   - Database: `southbound` (or value from `COSMOSDB_DATABASE_ID`)
   - Container: `savedRoutes` (created automatically on first use)

## Sanity CMS Setup

1. **Start Sanity Studio**
   ```bash
   npm run sanity:dev
   ```

2. **Create Content**
   - Navigate to Regions and create regions (Europe, Latin America, Southeast Asia)
   - Navigate to Cities and add cities for each region
   - Navigate to Activities and add activity types
   - Navigate to Accommodation Types and add accommodation options

3. **Link Cities to Regions**
   - When creating/editing a city, select the region reference
   - Select available activities and accommodation types

## API Endpoints

### Routes API
- `POST /api/routes` - Save a new route
- `GET /api/routes` - List all routes (with optional filters: ?status=draft&region=europe)
- `GET /api/routes/[id]` - Get a specific route
- `PATCH /api/routes/[id]` - Update a route (status, adminNotes)
- `DELETE /api/routes/[id]` - Delete a route

### Email API
- `POST /api/routes/send-link` - Send route link via email

## User Flow

1. **User builds route** on `/trip-options`
2. **Clicks "Save Route"** → Modal appears
3. **Enters email or WhatsApp** → Route saved to CosmosDB
4. **Receives link** via email or WhatsApp
5. **Views route** at `/route/[id]`
6. **Submits for review** → Status changes to "submitted"
7. **Admin reviews** in `/hub/routes`
8. **Admin updates status** and adds notes

## Admin Flow

1. **Access Routes** via `/hub/routes` (new sidebar link)
2. **Filter by status** (draft, submitted, in-review, confirmed)
3. **View route details** → Click on any route
4. **Update status** and add admin notes
5. **Contact user** via email or WhatsApp
6. **View public route** page

## Data Migration

The existing `cityPresets.ts` file remains as a fallback. To migrate to Sanity:

1. Create regions in Sanity matching the existing structure
2. Create cities in Sanity with all the data from `cityPresets.ts`
3. Update `src/lib/cityPresets.ts` to fetch from Sanity (with static fallback)

Example migration approach:
```typescript
// In cityPresets.ts
import { getCitiesByRegion } from './sanity-queries';

export async function getCityPresets(region: RegionKey): Promise<CityPreset[]> {
  try {
    // Try fetching from Sanity
    const regionSlug = region === 'europe' ? 'europe' : 
                      region === 'southeast-asia' ? 'southeast-asia' : 
                      'latin-america';
    return await getCitiesByRegion(regionSlug);
  } catch (error) {
    // Fallback to static data
    console.warn('Failed to fetch from Sanity, using static data', error);
    return CITY_PRESETS[region] || [];
  }
}
```

## Email Service Integration

The email utility (`src/lib/email.ts`) currently logs to console. To enable actual email sending:

1. **Install Resend** (recommended):
   ```bash
   npm install resend
   ```

2. **Get API key** from [resend.com](https://resend.com)

3. **Update `src/lib/email.ts`**:
   - Uncomment the Resend code
   - Add your API key to `.env.local`

Alternatively, integrate with SendGrid, AWS SES, or your preferred email service.

## Testing

1. **Test route saving**:
   - Build a route on `/trip-options`
   - Click "Save Route"
   - Enter email/WhatsApp
   - Verify route appears in `/hub/routes`

2. **Test admin review**:
   - Navigate to `/hub/routes`
   - Click on a route
   - Update status and add notes
   - Verify changes save

3. **Test public route view**:
   - Copy route ID from admin
   - Visit `/route/[id]`
   - Verify route displays correctly

## Troubleshooting

### CosmosDB Connection Issues
- Verify `COSMOSDB_ENDPOINT` and `COSMOSDB_KEY` are correct
- Check CosmosDB account is active
- Verify network/firewall allows connections

### Sanity Content Not Loading
- Check `NEXT_PUBLIC_SANITY_PROJECT_ID` matches your project
- Verify content is published in Sanity Studio
- Check CORS settings in Sanity project

### Email Not Sending
- Email service is optional (routes still save)
- Check email service API key
- Verify email service is configured in `src/lib/email.ts`

## Next Steps

1. Set up CosmosDB and add credentials
2. Create content in Sanity CMS
3. Configure email service (optional)
4. Test the full flow
5. Migrate existing city data to Sanity (optional)

