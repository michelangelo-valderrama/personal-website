import { defineCollection, z } from "astro:content"

const articles = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date().default(new Date()),
    img: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
})

export const collections = {
  articles,
}
