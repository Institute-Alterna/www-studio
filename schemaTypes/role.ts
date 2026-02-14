import { defineType, defineField, defineArrayMember } from 'sanity'

export const role = defineType({
  name: 'role',
  title: 'Role',
  type: 'document',
  fields: [
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Whether this role is currently open for applications',
      initialValue: false,
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: 'URL-friendly identifier for this role',
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Job title for this role',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'string',
      description: 'Which team this role belongs to',
      options: {
        list: [
          { title: 'Operations', value: 'operations' },
          { title: 'Safety', value: 'safety' },
          { title: 'MUN', value: 'mun' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'workMode',
      title: 'Work Mode',
      type: 'string',
      description: 'Where this role is performed',
      options: {
        list: [
          { title: 'Remote', value: 'remote' },
          { title: 'Hybrid', value: 'hybrid' },
          { title: 'On-Site', value: 'on-site' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      description: 'Geographic region for this role',
      initialValue: 'International',
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'array',
      description: 'General description of the role',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [],
          },
        }),
      ],
    }),
    defineField({
      name: 'responsibilities',
      title: 'Responsibilities',
      type: 'array',
      description: 'Key responsibilities and duties for this role. Shown as bullet points ("In this role you\'ll:")',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'requirements',
      title: 'Requirements',
      type: 'array',
      description: 'Minimum qualifications and skills needed. Shown as bullet points.',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'exceptionalPoints',
      title: 'Exceptional Points',
      type: 'array',
      description: 'Nice-to-have qualifications that set candidates apart. Shown as bullet points.',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'whatYouWillLearn',
      title: 'What You Will Learn',
      type: 'array',
      description: 'Skills and knowledge gained in this role. Shown as bullet points ("In this role you\'ll learn:")',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'workload',
      title: 'Workload',
      type: 'number',
      description: 'Hours per week',
      validation: (Rule) => Rule.min(1).lessThan(24),
    }),
    defineField({
      name: 'communication',
      title: 'Communication',
      type: 'object',
      description: 'Communication expectations and schedule',
      fields: [
        defineField({
          name: 'asynchronous',
          title: 'Asynchronous',
          type: 'boolean',
          description: 'Whether this role communicates asynchronously without fixed hours',
          initialValue: true,
        }),
        defineField({
          name: 'workingHours',
          title: 'Working Hours',
          type: 'string',
          description: 'Format: HH:MM - HH:MM (24h)',
          hidden: ({ parent }) => parent?.asynchronous === true,
          validation: (Rule) =>
            Rule.regex(/^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/, {
              name: '24h time range',
              invert: false,
            }),
        }),
        defineField({
          name: 'timezone',
          title: 'Timezone',
          type: 'string',
          description: 'Primary timezone for synchronous work',
          hidden: ({ parent }) => parent?.asynchronous === true,
          options: {
            list: [
              { title: 'UTC', value: 'UTC' },
              { title: 'EST (UTC-5)', value: 'EST' },
              { title: 'CST (UTC-6)', value: 'CST' },
              { title: 'PST (UTC-8)', value: 'PST' },
              { title: 'GMT (UTC+0)', value: 'GMT' },
              { title: 'CET (UTC+1)', value: 'CET' },
              { title: 'IST (UTC+5:30)', value: 'IST' },
              { title: 'JST (UTC+9)', value: 'JST' },
              { title: 'AEST (UTC+10)', value: 'AEST' },
            ],
          },
        }),
        defineField({
          name: 'language',
          title: 'Language',
          type: 'string',
          description: 'Primary language used for communication',
          initialValue: 'English',
        }),
        defineField({
          name: 'liveCollaboration',
          title: 'Live Collaboration',
          type: 'boolean',
          description: 'Whether this role involves real-time meetings or pair work',
          initialValue: true,
        }),
        defineField({
          name: 'collaborationFrequency',
          title: 'Collaboration Frequency',
          type: 'string',
          description: 'How often live collaboration sessions occur',
          hidden: ({ parent }) => !parent?.liveCollaboration,
          options: {
            list: [
              { title: 'from time to time', value: 'daily' },
              { title: 'bi-weekly', value: 'bi-weekly' },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'object',
      description: 'Time commitment and contract length',
      fields: [
        defineField({
          name: 'ongoing',
          title: 'Ongoing',
          type: 'boolean',
          description: 'Whether this role has no fixed end date',
          initialValue: true,
        }),
        defineField({
          name: 'expectedStartDate',
          title: 'Expected Start Date',
          type: 'date',
          hidden: ({ parent }) => parent?.ongoing === true,
        }),
        defineField({
          name: 'expectedEndDate',
          title: 'Expected End Date',
          type: 'date',
          hidden: ({ parent }) => parent?.ongoing === true,
          validation: (Rule) =>
            Rule.custom((endDate, context) => {
              const parent = context.parent as { expectedStartDate?: string }
              if (!endDate || !parent?.expectedStartDate) return true
              return endDate > parent.expectedStartDate
                ? true
                : 'End date must be after start date'
            }),
        }),
      ],
    }),
    defineField({
      name: 'compensation',
      title: 'Compensation',
      type: 'object',
      description: 'Pay and benefits details',
      fields: [
        defineField({
          name: 'salary',
          title: 'Salary',
          type: 'boolean',
          description: 'Whether this role includes monetary compensation',
          initialValue: false,
        }),
        defineField({
          name: 'amount',
          title: 'Amount',
          type: 'number',
          description: 'Salary amount in USD',
          initialValue: 0,
          hidden: ({ parent }) => !parent?.salary,
          validation: (Rule) =>
            Rule.custom((amount, context) => {
              const parent = context.parent as { salary?: boolean }
              if (parent?.salary && !amount) return 'Amount is required when salary is enabled'
              if (parent?.salary && amount !== undefined && amount < 0) return 'Amount must be positive'
              return true
            }),
        }),
        defineField({
          name: 'benefits',
          title: 'Benefits',
          type: 'array',
          description: 'Non-monetary perks and benefits offered',
          of: [{ type: 'string' }],
        }),
      ],
    }),
    defineField({
      name: 'specialisedCompetencyAssessment',
      title: 'Specialised Competency Assessment',
      type: 'boolean',
      description: 'Whether applicants must complete a skills assessment',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: 'name',
      active: 'active',
      workMode: 'workMode',
    },
    prepare({ title, active, workMode }) {
      return {
        title: `${active ? '🟢' : '⚫'} ${title || 'Untitled Role'}`,
        subtitle: workMode,
      }
    },
  },
})
