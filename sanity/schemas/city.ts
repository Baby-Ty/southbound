import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'city',
  title: 'City',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'City Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'flag',
      title: 'Flag Emoji',
      type: 'string',
      description: 'Country flag emoji, e.g., 🇵🇹',
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'reference',
      to: [{ type: 'region' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this city is available for selection',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'budgetCoins',
      title: 'Budget Level',
      type: 'number',
      options: {
        list: [
          { title: '1 - Affordable', value: 1 },
          { title: '2 - Value', value: 2 },
          { title: '3 - Premium', value: 3 },
        ],
      },
      validation: (Rule) => Rule.required().min(1).max(3),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g., coastal, culture, nightlife',
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'object',
      fields: [
        defineField({
          name: 'places',
          title: 'Places',
          type: 'array',
          of: [{ type: 'string' }],
        }),
        defineField({
          name: 'accommodation',
          title: 'Accommodation Description',
          type: 'string',
        }),
        defineField({
          name: 'activities',
          title: 'Activities',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'activity' }] }],
        }),
        defineField({
          name: 'notesHint',
          title: 'Notes Hint',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: 'weather',
      title: 'Weather',
      type: 'object',
      fields: [
        defineField({
          name: 'avgTemp',
          title: 'Average Temperature',
          type: 'string',
          description: 'e.g., "21°C"',
        }),
        defineField({
          name: 'bestMonths',
          title: 'Best Months',
          type: 'string',
          description: 'e.g., "Mar-Jun, Sep-Nov"',
        }),
        defineField({
          name: 'climate',
          title: 'Climate',
          type: 'string',
          options: {
            list: [
              { title: 'Tropical', value: 'tropical' },
              { title: 'Mediterranean', value: 'mediterranean' },
              { title: 'Temperate', value: 'temperate' },
              { title: 'Dry', value: 'dry' },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'costs',
      title: 'Costs',
      type: 'object',
      fields: [
        defineField({
          name: 'accommodation',
          title: 'Accommodation Range',
          type: 'string',
          description: 'e.g., "$1,200 - $1,800"',
        }),
        defineField({
          name: 'coworking',
          title: 'Coworking Range',
          type: 'string',
          description: 'e.g., "$150 - $250"',
        }),
        defineField({
          name: 'meals',
          title: 'Meals Range',
          type: 'string',
          description: 'e.g., "$400 - $600"',
        }),
        defineField({
          name: 'monthlyTotal',
          title: 'Monthly Total Range',
          type: 'string',
          description: 'e.g., "$2,200 - $3,000"',
        }),
      ],
    }),
    defineField({
      name: 'nomadScore',
      title: 'Nomad Score',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(10),
    }),
    defineField({
      name: 'internetSpeed',
      title: 'Internet Speed',
      type: 'string',
      description: 'e.g., "100 Mbps avg"',
    }),
    defineField({
      name: 'availableAccommodation',
      title: 'Available Accommodation Types',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'accommodationType' }] }],
      description: 'Select which accommodation types are available for this city',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'country',
      media: 'image',
    },
  },
});

