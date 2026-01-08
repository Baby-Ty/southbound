# Admin Attraction Management Guide

## Overview

The South Bound platform now supports **enriched activity/attraction management** that combines real-time TripAdvisor data with admin-curated content. This gives you full control over how activities are presented to users while leveraging the power of TripAdvisor's extensive database.

## Features

### 1. **Enriched Activity Modal**
The activity details modal now displays much more useful information:

- ✨ **Enhanced Description** - Full, well-formatted descriptions with read more/less functionality
- 📊 **Quick Info Cards** - Rating, reviews, price, duration, difficulty at a glance
- 🎯 **Highlights** - Key features and selling points
- ⏰ **Best Time to Visit** - Seasonal/timing recommendations
- 📅 **Booking Information** - Whether booking is required and booking links
- ⚠️ **What to Know** - Important visitor information (dress code, restrictions, etc.)
- 📍 **Location & Contact** - Enhanced address display with Google Maps integration
- 🕐 **Opening Hours** - Beautiful, easy-to-read schedule display
- 🏷️ **Experience Types** - Category tags and subcategories
- ✅ **Amenities** - What's included with the activity
- ⭐ **Rating Breakdown** - Visual representation of review distribution

### 2. **Admin Content Management via Sanity CMS**

#### New "Attraction" Content Type

Navigate to your Sanity Studio and you'll find a new **"Attraction"** content type. This allows you to:

##### Basic Information
- Name and slug
- Link to a city
- Category (Cultural & Historical, Tours, Food & Drink, Nature, etc.)
- Featured status
- Publishing status (Published, Draft, Private, Needs Review)

##### Content & Media
- Short description (for cards and previews, max 200 chars)
- Full description (rich text editor with formatting)
- Admin notes (internal only)
- Hero image
- Image gallery

##### Details & Logistics
- **Highlights** - Array of key features
- **Duration** - How long the activity typically takes
- **Best Time to Visit** - When to go for the best experience
- **Difficulty Level** - Easy, Moderate, Challenging, or N/A
- **Price Range** - $, $$, $$$, $$$$, or Free
- **Estimated Cost** - Specific pricing information
- **Booking Required** - Toggle + booking URL
- **Amenities** - Array of features (wheelchair accessible, WiFi, etc.)
- **What to Know** - Important pre-visit information
- **Address** - Full address with all fields
- **Coordinates** - Latitude/longitude for maps
- **Contact** - Phone, website, email
- **Opening Hours** - Day-by-day schedule

##### TripAdvisor Integration
- **TripAdvisor Location ID** - Link to TripAdvisor data
- **Override TripAdvisor Data** - Your content takes precedence (default: on)
- **Auto-Sync** - Automatically update ratings/reviews/photos from TripAdvisor
- **Last Synced** - Timestamp of last sync

## How It Works

### Data Merging Logic

When a user views an activity:

1. **TripAdvisor Only**: If no admin content exists, pure TripAdvisor data is shown
2. **Sanity Only**: If override is disabled or no TripAdvisor data exists
3. **Merged (Best)**: Admin content takes precedence for most fields, but live TripAdvisor ratings/reviews are always shown

#### Precedence Rules (when merged):

**Admin Content Takes Priority:**
- Name, category
- All descriptions
- All media (images, gallery)
- Highlights, duration, best time to visit, difficulty
- Pricing information
- Booking requirements
- Contact information
- Opening hours
- All custom fields

**TripAdvisor Always Wins:**
- Rating (live)
- Review count (live)
- Review breakdown (live)
- TripAdvisor URL

**Both Combined:**
- Amenities (merged and de-duplicated)
- Images (admin images first, then TripAdvisor photos)

## Admin Workflow

### Adding a New Attraction

1. **Find the TripAdvisor Location ID**
   - Search for the activity on TripAdvisor
   - Copy the location ID from the URL (e.g., `d2292910` from `tripadvisor.com/Attraction_Review-g188679-d2292910-...`)

2. **Create New Attraction in Sanity**
   - Go to Sanity Studio → Attractions → Create
   - Fill in the TripAdvisor Location ID
   - Add your custom content in the fields you want to override
   - Set status to "Published" when ready

3. **Customize Content**
   - Write compelling descriptions that highlight what makes this activity special
   - Add highlights that answer "Why should I do this?"
   - Specify difficulty and duration for better planning
   - Add practical information (best time to visit, what to know)
   - Upload better hero images if TripAdvisor's aren't great

4. **Review**
   - Check the activity modal in the app
   - Look for the purple "Enhanced" badge to confirm your content is showing
   - Verify the data merge looks good

### Enriching Existing TripAdvisor Data

For activities already showing from TripAdvisor:

1. Note the location ID
2. Create a new Attraction document
3. Add just the fields you want to enhance (you don't need to fill everything)
4. Common enhancements:
   - Better descriptions (TripAdvisor descriptions can be generic)
   - Highlights (make them compelling!)
   - Duration and difficulty (helps with planning)
   - Best time to visit (insider knowledge)
   - Better images

### Managing Content at Scale

**Status Workflow:**
- 📝 **Draft** - Work in progress, not visible to users
- ⚠️ **Needs Review** - Flag for quality check before publishing
- ✅ **Published** - Live and visible to users
- 🔒 **Private** - Hidden but saved

**Admin Notes Field:**
Use this to track:
- Data sources
- Update schedules
- Special considerations
- Team notes

## Best Practices

### Writing Great Descriptions

**Short Description (card previews):**
- 150-200 characters max
- Focus on the unique selling point
- Action-oriented (e.g., "Walk through history...", "Experience authentic...")

**Full Description:**
- Tell a story
- Paint a picture of what they'll experience
- Include practical details
- Mention what makes it unique
- Keep paragraphs short and scannable

### Creating Compelling Highlights

✅ **Good:**
- "Walk through Anne Frank's secret annex and see the diary"
- "Learn about WWII history from expert guides"
- "Skip-the-line access saves 2+ hours"

❌ **Avoid:**
- "Good tour"
- "Worth it"
- "Popular attraction"

### Pricing Information

Be specific:
- ✅ "$25-30 per person, includes guide and entry"
- ✅ "€15 adults, €8 children under 12, free under 5"
- ❌ "Moderate prices"

### What to Know Section

Include important details like:
- Dress code requirements
- Physical requirements
- What to bring
- Restrictions (no bags, no photos, etc.)
- Age restrictions
- Accessibility information

## Technical Details

### API Endpoint

`GET /api/attractions/[locationId]`

Returns:
```json
{
  "source": "merged", // or "tripadvisor", "sanity"
  "data": {
    // Merged/enriched activity data
  }
}
```

### Data Flow

```
User clicks activity
    ↓
ActivityDetailsModal opens
    ↓
Fetches from /api/attractions/[locationId]
    ↓
API queries Sanity + TripAdvisor
    ↓
Merges data (admin content wins)
    ↓
Returns enriched data
    ↓
Modal displays with "Enhanced" badge
```

### Schema Location

- `/sanity/schemas/attraction.ts` - Main attraction schema
- `/src/app/api/attractions/[locationId]/route.ts` - API route for fetching/merging
- `/src/components/RouteBuilder/ActivityDetailsModal.tsx` - Enhanced modal component

## Future Enhancements

Potential additions:
- AI-generated descriptions when TripAdvisor data is lacking
- Bulk import from TripAdvisor
- Image optimization and CDN
- Multi-language support
- User-generated content integration
- Comparison tools
- Booking integration

## Support

For questions or issues:
1. Check this documentation
2. Review the code comments in the schema files
3. Test in Sanity Studio preview mode
4. Reach out to the development team

---

**Last Updated:** December 2025
**Version:** 1.0

