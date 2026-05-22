import {defineType, defineField, defineArrayMember} from 'sanity'

const defaultBoilerplate = [
  {
    _type: 'block',
    _key: 'boilerplate0',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'boilerplate0span',
        marks: [],
        text: 'Alterna is a student-led institute building opportunities for the next generation of leaders. Through its chapters, programs, and competitions, Alterna connects students worldwide with the people and resources they need to grow. For more information, visit alterna.dev.',
      },
    ],
  },
]

export const pressRelease = defineType({
  name: 'pressRelease',
  title: 'Press Release',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
    {name: 'body', title: 'Body'},
    {name: 'about', title: 'About & Contacts'},
    {name: 'seo', title: 'SEO'},
    {name: 'settings', title: 'Settings'},
  ],
  fieldsets: [
    {
      name: 'dateline',
      title: 'Dateline',
      description: 'Publication metadata shown at the top of the release',
      options: {columns: 3},
    },
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Category',
      type: 'string',
      group: 'content',
      description: 'Small kicker label shown above the headline',
      options: {
        list: [
          {title: 'Press Release', value: 'Press Release'},
          {title: 'Announcement', value: 'Announcement'},
          {title: 'Product Update', value: 'Product Update'},
          {title: 'Company News', value: 'Company News'},
          {title: 'Statement', value: 'Statement'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'Press Release',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'content',
      description: 'The press release title',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'URL-friendly identifier, generated from the headline',
      options: {
        source: 'headline',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'deck',
      title: 'Deck',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Standfirst paragraph shown under the headline',
      validation: (Rule) => Rule.required().max(280),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'content',
      fieldset: 'dateline',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'content',
      fieldset: 'dateline',
      description: 'Dateline location, e.g. "BOGOTÁ, COLOMBIA"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'content',
      fieldset: 'dateline',
      description: 'Byline for the release. Defaults to the Alterna Team.',
      initialValue: 'The Alterna Team',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'media',
      description: 'Lead image shown at the top of the release',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Required for accessibility and SEO',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'credit',
          title: 'Credit / Source',
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'body',
      description: 'The press release content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [
              defineArrayMember({
                type: 'object',
                name: 'link',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'linkType',
                    title: 'Link Type',
                    type: 'string',
                    options: {
                      list: [
                        {title: 'External URL', value: 'external'},
                        {title: 'Internal page', value: 'internal'},
                      ],
                      layout: 'radio',
                    },
                    initialValue: 'external',
                  }),
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    hidden: ({parent}) => parent?.linkType !== 'external',
                    validation: (Rule) => Rule.uri({scheme: ['http', 'https', 'mailto', 'tel']}),
                  }),
                  defineField({
                    name: 'internalRef',
                    title: 'Internal Page',
                    type: 'reference',
                    to: [{type: 'pressRelease'}, {type: 'post'}],
                    hidden: ({parent}) => parent?.linkType !== 'internal',
                  }),
                  defineField({
                    name: 'openInNewTab',
                    title: 'Open in New Tab',
                    type: 'boolean',
                    initialValue: false,
                  }),
                ],
                validation: (Rule) =>
                  Rule.custom(
                    (link?: {linkType?: string; href?: string; internalRef?: unknown}) => {
                      if (!link) return true
                      if (link.linkType === 'internal' && !link.internalRef) {
                        return 'Select an internal page'
                      }
                      if (link.linkType !== 'internal' && !link.href) {
                        return 'Enter a URL'
                      }
                      return true
                    },
                  ),
              }),
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          name: 'inlineImage',
          title: 'Image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Required for accessibility and SEO',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'credit',
              title: 'Credit / Source',
              type: 'string',
            }),
          ],
          preview: {
            select: {title: 'caption', subtitle: 'alt', media: 'asset'},
            prepare({title, subtitle, media}) {
              return {
                title: title || 'Image',
                subtitle: subtitle ? `🖼 ${subtitle}` : '🖼 Image',
                media,
              }
            },
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'pullQuote',
          title: 'Pull Quote',
          fields: [
            defineField({
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'attribution',
              title: 'Attribution',
              type: 'string',
              description: 'e.g. "Jane Doe, CEO of Alterna"',
            }),
          ],
          preview: {
            select: {title: 'quote', subtitle: 'attribution'},
            prepare({title, subtitle}) {
              return {
                title: `❝ ${title || 'Pull Quote'}`,
                subtitle,
              }
            },
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'divider',
          title: 'Divider',
          fields: [
            defineField({
              name: 'style',
              title: 'Style',
              type: 'string',
              options: {
                list: [
                  {title: 'Line', value: 'line'},
                  {title: 'Space', value: 'space'},
                  {title: 'Asterism', value: 'asterism'},
                ],
                layout: 'radio',
              },
              initialValue: 'line',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {style: 'style'},
            prepare({style}) {
              return {title: `▭ Divider — ${style || 'line'}`}
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'boilerplate',
      title: 'About Alterna',
      type: 'array',
      group: 'about',
      description: 'Standard boilerplate that closes every release. Review before publishing.',
      initialValue: defaultBoilerplate,
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [
              defineArrayMember({
                type: 'object',
                name: 'link',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (Rule) =>
                      Rule.required().uri({scheme: ['http', 'https', 'mailto', 'tel']}),
                  }),
                ],
              }),
            ],
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'mediaContacts',
      title: 'Media Contacts',
      type: 'array',
      group: 'about',
      description: 'Press contacts listed at the foot of the release',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'mediaContact',
          title: 'Media Contact',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Title / Role',
              type: 'string',
            }),
            defineField({
              name: 'email',
              title: 'Email',
              type: 'string',
              validation: (Rule) => Rule.required().email(),
            }),
          ],
          preview: {
            select: {title: 'name', subtitle: 'email'},
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      description: 'Optional overrides. Falls back to the headline and hero image when empty.',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Defaults to the headline if left blank',
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Defaults to the deck if left blank',
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: 'ogImage',
          title: 'Social Share Image',
          type: 'image',
          description: 'Defaults to the hero image if left blank',
          options: {hotspot: true},
        }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'settings',
      description: 'Highlight this release on the newsroom landing page',
      initialValue: false,
    }),
    defineField({
      name: 'relatedReleases',
      title: 'Related Releases',
      type: 'array',
      group: 'settings',
      description: 'Other press releases to surface alongside this one',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'pressRelease'}],
        }),
      ],
    }),
  ],

  orderings: [
    {
      title: 'Published, newest',
      name: 'publishedDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],

  preview: {
    select: {
      title: 'headline',
      eyebrow: 'eyebrow',
      publishedAt: 'publishedAt',
      featured: 'featured',
      media: 'heroImage',
    },
    prepare({title, eyebrow, publishedAt, featured, media}) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'No date'
      return {
        title: `${featured ? '⭐ ' : ''}${title || 'Untitled Press Release'}`,
        subtitle: `${eyebrow ? `${eyebrow} · ` : ''}${date}`,
        media,
      }
    },
  },
})
