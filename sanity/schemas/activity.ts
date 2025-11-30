import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'activity',
  title: 'Activity',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Activity Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Emoji or icon name',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Adventure', value: 'adventure' },
          { title: 'Culture', value: 'culture' },
          { title: 'Food & Drink', value: 'food' },
          { title: 'Nature', value: 'nature' },
          { title: 'Wellness', value: 'wellness' },
          { title: 'Nightlife', value: 'nightlife' },
          { title: 'Work', value: 'work' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this activity is available for selection',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
    },
  },
});

