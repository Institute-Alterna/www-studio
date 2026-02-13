import { defineType, defineField } from 'sanity'

export const chapter = defineType({
  name: 'chapter',
  title: 'Chapter',
  type: 'document',
  fields: [
    // Existing fields
    defineField({
      name: 'societyId',
      title: 'Society ID',
      type: 'string',
      description: 'URL-friendly identifier (e.g., "robinson", "lakes")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Chapter Name',
      type: 'string',
      description: 'Full name (e.g., "CHS Robinson")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'displayName',
      title: 'Display Name',
      type: 'string',
      description: 'Short name for cards (e.g., "Robinson")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'City, State/Country (e.g., "Tampa, FL")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief chapter description for directory cards',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'founded',
      title: 'Founded Year',
      type: 'string',
      description: 'Year the chapter was established',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tallyContactFormId',
      title: 'Tally Contact Form ID',
      type: 'string',
      description: 'Optional Tally form ID for chapter contact form',
    }),

    // Stats object
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'object',
      fields: [
        defineField({
          name: 'members',
          title: 'Members',
          type: 'number',
          validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
          name: 'events',
          title: 'Events',
          type: 'number',
          validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
          name: 'workshops',
          title: 'Workshops',
          type: 'number',
          validation: (Rule) => Rule.min(0),
        }),
      ],
    }),

    // Strategists reference array
    defineField({
      name: 'strategists',
      title: 'Strategists',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'strategist' }],
        },
      ],
    }),

    // Achievements
    defineField({
      name: 'achievements',
      title: 'Achievements',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of chapter accomplishments',
    }),

    defineField({
      name: 'isFlagship',
      title: 'Flagship Chapter',
      type: 'boolean',
      description: 'Enable flagship layout.',
      initialValue: false,
    }),
    defineField({
      name: 'chapterIndex',
      title: 'Chapter Index',
      type: 'number',
      description: 'Display as CHS-1, CHS-2, etc. in the index badge',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short tagline for hero section',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Hero section image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'text',
      rows: 3,
      description: 'Brief overview paragraph',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'features',
      title: 'Focus Areas',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'feature',
          title: 'Feature',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Optional icon identifier',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        },
      ],
      description: 'Chapter focus areas/features displayed in grid',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'location',
      isFlagship: 'isFlagship',
    },
    prepare({ title, subtitle, isFlagship }) {
      return {
        title: isFlagship ? `${title} ⭐` : title,
        subtitle,
      }
    },
  },
})
