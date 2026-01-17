import { defineField, defineType } from 'sanity'

export const experienceType = defineType({
    name: 'experience',
    title: 'Experience',
    type: 'document',
    fields: [
        defineField({
            name: 'company',
            title: 'Company / Organization',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'role',
            title: 'Role / Job Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'logo',
            title: 'Company Logo',
            type: 'image',
        }),
        defineField({
            name: 'startDate',
            title: 'Start Date',
            type: 'date',
            options: { dateFormat: 'YYYY-MM' },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'endDate',
            title: 'End Date',
            type: 'date',
            options: { dateFormat: 'YYYY-MM' },
            hidden: ({ document }): boolean => !!document?.isCurrent,
        }),
        defineField({
            name: 'isCurrent',
            title: 'I currently work here',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'technologies',
            title: 'Technologies Used',
            type: 'array',
            of: [{ type: 'string' }],
            options: { layout: 'tags' }
        }),
    ],
    orderings: [
        {
            title: 'Start Date, Newest First',
            name: 'startDateDesc',
            by: [
                { field: 'startDate', direction: 'desc' }
            ]
        }
    ],
    preview: {
        select: {
            title: 'role',
            subtitle: 'company',
            media: 'logo'
        }
    }
})