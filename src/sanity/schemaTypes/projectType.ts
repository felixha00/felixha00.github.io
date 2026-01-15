import { defineField, defineType } from 'sanity'

const MAIN_CATEGORIES = [
    { title: "Software & Web" },
    { title: "Hardware & Tangibles" },
    { title: "Visual & Brand" },
    { title: "Business & Ventures" },
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
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                // 2. Map your array to the format Sanity expects: { title: string, value: string }
                list: MAIN_CATEGORIES.map((item) => ({
                    title: item.title,
                    value: item.title
                })),
                // Optional: Render as radio buttons instead of a dropdown
                // layout: 'radio' 
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
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'summary',
            media: 'image',
        },
    },
})