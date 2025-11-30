import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'region',
  title: 'Region',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Region Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
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
      name: 'timezone',
      title: 'Timezone Offset',
      type: 'string',
      description: 'e.g., "+1h to +2h" or "-2h to -5h"',
    }),
    defineField({
      name: 'budgetLabel',
      title: 'Budget Label',
      type: 'string',
      description: 'e.g., "Value", "Affordable", "Premium"',
    }),
    defineField({
      name: 'budgetSymbol',
      title: 'Budget Symbol',
      type: 'string',
      description: 'e.g., "$", "$$", "$$$"',
    }),
    defineField({
      name: 'vibe',
      title: 'Vibe',
      type: 'string',
      description: 'e.g., "Social & Adventurous", "Relaxed & Creative"',
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this region is available for selection',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'vibe',
      media: 'image',
    },
  },
});

