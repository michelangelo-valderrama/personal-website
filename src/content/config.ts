import { SITE } from "@/consts"
import { defineCollection, z } from "astro:content"

const articles = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    img: z.string().default(`%s${SITE.BANNER}`),
    tags: z.array(z.string()).optional(),
  }),
})

export const collections = {
  articles,
}
