// schemaTypes/entity.ts
import { defineField, defineType } from 'sanity'

export const entityType = defineType({
    name: 'entity',
    title: 'Entity / Client',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Personal', value: 'personal' },
                    { title: 'Client', value: 'cliebnt' },
                    { title: 'Business', value: 'business' }
                ],
                layout: 'radio'
            },
            initialValue: 'personal'
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
        }),
        defineField({
            name: 'content',
            type: 'array',
            of: [
                {
                    type: 'block' // Standard rich text
                },
                {
                    type: 'image', // This adds image blocks!
                    fields: [
                        {
                            name: 'alt',
                            type: 'string',
                            title: 'Alternative text',
                            description: 'Important for SEO and accessibility',
                            options: {
                                isHighlighted: true // Shows the field prominently
                            }
                        },
                        {
                            name: 'caption',
                            type: 'string',
                            title: 'Caption'
                        }
                    ]
                }
            ]
        })
    ],
})