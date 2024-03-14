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

export const parseArticleImage = (article: CollectionEntry<"articles">) => ({
  ...article.data.img,
  src: parseImage(article.data.img.src, `/images/articles/${article.slug}`),
})

export const validateEmail = (value: string) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g.test(value)
}
