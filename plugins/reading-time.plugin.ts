import getReadingTime from "reading-time"
import { toString } from "mdast-util-to-string"
import {
  setVfileFrontmatter,
  type RemarkPlugin,
} from "@astrojs/markdown-remark"

export const remarkReadingTime: RemarkPlugin = () => {
  return function (tree, vFile) {
    const textOnPage = toString(tree)
    const readingTime = getReadingTime(textOnPage)
    setVfileFrontmatter(vFile, { minutesRead: readingTime.minutes })
  }
}
