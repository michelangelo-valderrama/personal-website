import { SITE } from "@/consts"
import type { CollectionEntry } from "astro:content"

/**
 * Agrupa un array de objetos por un atributo.
 */
export const groupBy = (array: any[], key: string) =>
  array.reduce((preValue, curValue) => {
    ;(preValue[curValue[key]] = preValue[curValue[key]] || []).push(curValue)
    return preValue
  }, {})

export const parseImage = (image: string, path: string = "") =>
  image.replace(/%s/g, SITE.URL).replace(/%p/g, path)

export const parseArticleImage = (article: CollectionEntry<"articles">) =>
  parseImage(article.data.img, `images/articles/${article.slug}`)
