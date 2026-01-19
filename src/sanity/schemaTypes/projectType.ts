import { defineField, defineType } from 'sanity'

const MAIN_CATEGORIES = [
    { title: "Software & Web", value: "sfw" },
    { title: "Hardware & Tangibles", value: "hdw" },
    { title: "Visual & Brand", value: "viz" },
    { title: "Business & Ventures", value: "biz" },
];

export const projectType = defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'for',
            title: 'For (Client / Entity)',
            description: 'Who was this project created for?',
            type: 'reference',
            to: [{ type: 'entity' }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: MAIN_CATEGORIES.map((item) => ({
                    title: item.title,
                    value: item.value
                })),
                layout: 'radio'
            },
            validation: (rule) => rule.required(), // Optional: make it mandatory
        }),
        defineField({
            name: 'summary',
            title: 'Summary',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'image',
            title: 'Main Image',
            type: 'image',
            options: {
                hotspot: true, // Allows cropping/focal point
            },
            fields: [
                defineField({
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                }),
            ],
        }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'date',
            options: { dateFormat: 'YYYY-MM' },
        }),
        defineField({
            name: 'url',
            title: 'Main Project URL',
            type: 'url',
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
        }),
        defineField({
            name: 'stack',
            title: 'Stack',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
        }),
        defineField({
            name: 'links',
            title: 'Additional Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'label',
                            type: 'string',
                            title: 'Label (e.g. Kickstarter)'
                        }),
                        defineField({
                            name: 'url',
                            type: 'url',
                            title: 'URL'
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'label',
                            subtitle: 'url'
                        }
                    }
                }
            ],
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'readmeUrl',
            title: 'README URL (GitHub, etc.)',
            description: 'Paste the link to the raw file (e.g., https://raw.githubusercontent.com/...) or the blob link.',
            type: 'url',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'summary',
            media: 'image',
        },
    },
})