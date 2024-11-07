import { defineCollection, z } from "astro:content";

const projectsCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: ({image}) => z.object({
    title: z.string(),
    cover: image().optional(),
    dir: z.string().optional(),
    summary: z.string().optional(),
    date: z.string().optional(), // Use z.string() for date, or z.date() if you prefer a Date object
    url: z.string().url().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    hideCover: z.boolean().optional()
  }),
});

export const collections = {
  'projects': projectsCollection,
};