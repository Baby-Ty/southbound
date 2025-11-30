import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'accommodationType',
  title: 'Accommodation Type',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Accommodation Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g., "Private Apartment", "Coliving Space", "Villa"',
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
      name: 'pros',
      title: 'Pros',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key benefits of this accommodation type',
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this accommodation type is available for selection',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      media: 'image',
    },
  },
});

