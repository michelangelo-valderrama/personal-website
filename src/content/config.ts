import { SITE } from "@/consts"
import { defineCollection, z } from "astro:content"

const articles = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    img: z
      .object({
        src: z.string(),
        alt: z.string(),
        width: z.number().default(1920),
        height: z.number().default(1080),
        show: z.boolean().default(true),
        credit: z.string().optional(),
      })
      .default({
        ...SITE.IMAGE,
        src: '%s' + SITE.IMAGE.src,
        show: false
      }),
    tags: z.array(z.string()),
  }),
})

export const collections = {
  articles,
}
