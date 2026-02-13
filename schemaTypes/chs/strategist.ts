import { defineType, defineField } from 'sanity'

export const strategist = defineType({
  name: 'strategist',
  title: 'Strategist',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Role identifier (e.g., "principal", "academic", "community", "competition")',
      options: {
        list: [
          { title: 'Principal Strategist', value: 'principal' },
          { title: 'Academic Strategist', value: 'academic' },
          { title: 'Community Strategist', value: 'community' },
          { title: 'Competition Strategist', value: 'competition' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'roleLabel',
      title: 'Role Label',
      type: 'string',
      description: 'Display label (e.g., "Principal Strategist")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 3,
      description: 'Optional short biography',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'roleLabel',
      media: 'photo',
    },
  },
})
