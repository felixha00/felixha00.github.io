import { defineField, defineType } from 'sanity'

export const profileType = defineType({
    name: 'profile',
    title: 'Profile',
    type: 'document',
    fields: [
        defineField({
            name: 'fullName',
            title: 'Full Name',
            type: 'string',
        }),
        defineField({
            name: 'headline',
            title: 'Headline',
            type: 'string',
            description: 'e.g. Full Stack Developer based in Toronto'
        }),
        defineField({
            name: 'profileImage',
            title: 'Profile Image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'shortBio',
            title: 'Short Bio',
            type: 'markdown',
        }),
        defineField({
            name: 'fullBio',
            title: 'Full Bio',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'achievementsSimple',
            title: 'Achievements',
            type: 'markdown',
        }),
        defineField({
            name: 'achievements',
            title: 'Achievements',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'achievement',
                    fields: [
                        { name: 'title', type: 'string', title: 'Achievement Title' },
                        { name: 'year', type: 'string', title: 'Year' },
                        {
                            name: 'description',
                            type: 'array',
                            title: 'Description',
                            of: [{ type: 'block' }]
                        },
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            subtitle: 'year'
                        }
                    }
                }
            ]
        }),
        defineField({
            name: 'resume',
            title: 'Resume/CV PDF',
            type: 'file',
            description: 'Upload your PDF resume here for download'
        }),
        defineField({
            name: 'socialLinks',
            title: 'Social Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'platform', type: 'string', title: 'Platform' },
                        { name: 'url', type: 'url', title: 'URL' },
                    ]
                }
            ]
        }),
    ],
})