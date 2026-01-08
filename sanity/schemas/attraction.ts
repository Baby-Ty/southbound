import { defineField, defineType } from 'sanity';

/**
 * Enhanced Attraction Schema
 * 
 * This schema allows admins to enrich TripAdvisor data or create custom attractions.
 * When linked to a TripAdvisor locationId, admin-provided data takes precedence over API data.
 */
export default defineType({
  name: 'attraction',
  title: 'Attraction',
  type: 'document',
  groups: [
    {
      name: 'basic',
      title: 'Basic Info',
    },
    {
      name: 'content',
      title: 'Content & Media',
    },
    {
      name: 'details',
      title: 'Details & Logistics',
    },
    {
      name: 'integration',
      title: 'TripAdvisor Integration',
    },
  ],
  fields: [
    // Basic Information
    defineField({
      name: 'name',
      title: 'Attraction Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'reference',
      to: [{ type: 'city' }],
      description: 'Link to the city where this attraction is located',
      group: 'basic',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: '🏛️ Cultural & Historical', value: 'cultural' },
          { title: '🎭 Tours & Experiences', value: 'tours' },
          { title: '🍽️ Food & Drink', value: 'food' },
          { title: '🏞️ Nature & Outdoors', value: 'nature' },
          { title: '🎨 Art & Museums', value: 'art' },
          { title: '🎢 Entertainment', value: 'entertainment' },
          { title: '🛍️ Shopping', value: 'shopping' },
          { title: '🌃 Nightlife', value: 'nightlife' },
          { title: '🧘 Wellness & Spa', value: 'wellness' },
          { title: '⚽ Sports & Adventure', value: 'sports' },
          { title: '🏢 Other', value: 'other' },
        ],
      },
      group: 'basic',
    }),

    // Content & Media
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Brief overview (150-200 characters) - used in cards and previews',
      validation: (Rule) => Rule.max(200),
      group: 'content',
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Detailed description of the attraction - supports rich text',
      group: 'content',
    }),
    defineField({
      name: 'adminNotes',
      title: 'Admin Notes',
      type: 'text',
      rows: 3,
      description: 'Internal notes about this attraction (not displayed to users)',
      group: 'content',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
      group: 'content',
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      description: 'Additional images for the gallery',
      group: 'content',
    }),

    // Details & Logistics
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key highlights and features of this attraction',
      group: 'details',
    }),
    defineField({
      name: 'duration',
      title: 'Typical Duration',
      type: 'string',
      description: 'e.g., "2-3 hours", "Full day", "Half day"',
      group: 'details',
    }),
    defineField({
      name: 'bestTimeToVisit',
      title: 'Best Time to Visit',
      type: 'text',
      rows: 2,
      description: 'When is the best time to visit? (season, time of day, etc.)',
      group: 'details',
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty Level',
      type: 'string',
      options: {
        list: [
          { title: 'Easy - Suitable for all', value: 'easy' },
          { title: 'Moderate - Some physical activity', value: 'moderate' },
          { title: 'Challenging - Good fitness required', value: 'challenging' },
          { title: 'Not Applicable', value: 'n/a' },
        ],
      },
      group: 'details',
    }),
    defineField({
      name: 'priceRange',
      title: 'Price Range',
      type: 'string',
      options: {
        list: [
          { title: '$ - Budget Friendly', value: '$' },
          { title: '$$ - Moderate', value: '$$' },
          { title: '$$$ - Expensive', value: '$$$' },
          { title: '$$$$ - Luxury', value: '$$$$' },
          { title: 'Free', value: 'free' },
        ],
      },
      group: 'details',
    }),
    defineField({
      name: 'estimatedCost',
      title: 'Estimated Cost',
      type: 'string',
      description: 'e.g., "$25-50 per person", "Free entry"',
      group: 'details',
    }),
    defineField({
      name: 'bookingRequired',
      title: 'Booking Required',
      type: 'boolean',
      initialValue: false,
      description: 'Does this attraction require advance booking?',
      group: 'details',
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Booking URL',
      type: 'url',
      description: 'Link to booking page',
      hidden: ({ document }) => !document?.bookingRequired,
      group: 'details',
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities & Facilities',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g., "Wheelchair accessible", "Free WiFi", "Guided tours available"',
      group: 'details',
    }),
    defineField({
      name: 'whatToKnow',
      title: 'What to Know Before You Go',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Important information for visitors (dress code, restrictions, etc.)',
      group: 'details',
    }),

    // Location & Contact
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        { name: 'street', type: 'string', title: 'Street Address' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'state', type: 'string', title: 'State/Province' },
        { name: 'country', type: 'string', title: 'Country' },
        { name: 'postalCode', type: 'string', title: 'Postal Code' },
      ],
      group: 'details',
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'object',
      fields: [
        { name: 'lat', type: 'number', title: 'Latitude' },
        { name: 'lng', type: 'number', title: 'Longitude' },
      ],
      group: 'details',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'website',
      title: 'Official Website',
      type: 'url',
      group: 'details',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'details',
    }),

    // Hours of Operation
    defineField({
      name: 'openingHours',
      title: 'Opening Hours',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'day',
              type: 'string',
              title: 'Day',
              options: {
                list: [
                  { title: 'Monday', value: 'monday' },
                  { title: 'Tuesday', value: 'tuesday' },
                  { title: 'Wednesday', value: 'wednesday' },
                  { title: 'Thursday', value: 'thursday' },
                  { title: 'Friday', value: 'friday' },
                  { title: 'Saturday', value: 'saturday' },
                  { title: 'Sunday', value: 'sunday' },
                ],
              },
            },
            { name: 'open', type: 'string', title: 'Opening Time', description: 'e.g., "09:00"' },
            { name: 'close', type: 'string', title: 'Closing Time', description: 'e.g., "17:00"' },
            { name: 'closed', type: 'boolean', title: 'Closed', initialValue: false },
          ],
          preview: {
            select: {
              day: 'day',
              open: 'open',
              close: 'close',
              closed: 'closed',
            },
            prepare(selection) {
              const { day, open, close, closed } = selection;
              return {
                title: day?.charAt(0).toUpperCase() + day?.slice(1) || 'Unknown',
                subtitle: closed ? 'Closed' : `${open || '?'} - ${close || '?'}`,
              };
            },
          },
        },
      ],
      group: 'details',
    }),

    // TripAdvisor Integration
    defineField({
      name: 'tripAdvisorLocationId',
      title: 'TripAdvisor Location ID',
      type: 'string',
      description: 'Link this attraction to TripAdvisor data. Admin content will override TripAdvisor data.',
      group: 'integration',
    }),
    defineField({
      name: 'overrideTripAdvisorData',
      title: 'Override TripAdvisor Data',
      type: 'boolean',
      initialValue: true,
      description: 'When enabled, admin-provided content takes precedence over TripAdvisor data',
      group: 'integration',
    }),
    defineField({
      name: 'syncWithTripAdvisor',
      title: 'Auto-Sync with TripAdvisor',
      type: 'boolean',
      initialValue: false,
      description: 'Automatically update rating, reviews, and photos from TripAdvisor',
      group: 'integration',
    }),
    defineField({
      name: 'lastSyncedAt',
      title: 'Last Synced',
      type: 'datetime',
      readOnly: true,
      description: 'Last time data was synced from TripAdvisor',
      group: 'integration',
    }),

    // Status & Publishing
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Show this attraction prominently',
      group: 'basic',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: '✅ Published', value: 'published' },
          { title: '📝 Draft', value: 'draft' },
          { title: '🔒 Private', value: 'private' },
          { title: '⚠️ Needs Review', value: 'review' },
        ],
      },
      initialValue: 'draft',
      group: 'basic',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'heroImage',
      city: 'city.name',
      status: 'status',
    },
    prepare(selection) {
      const { title, subtitle, media, city, status } = selection;
      const statusEmojiMap: Record<string, string> = {
        published: '✅',
        draft: '📝',
        private: '🔒',
        review: '⚠️',
      };
      const statusEmoji = statusEmojiMap[(status as string) || 'draft'] || '📝';
      
      return {
        title: `${statusEmoji} ${title}`,
        subtitle: [city, subtitle].filter(Boolean).join(' • '),
        media,
      };
    },
  },

  orderings: [
    {
      title: 'Name, A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],
});

