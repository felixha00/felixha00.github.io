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
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'fullBio',
            title: 'Full Bio',
            type: 'array',
            of: [{ type: 'block' }],
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