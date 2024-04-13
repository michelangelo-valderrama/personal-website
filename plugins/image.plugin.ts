import type { RemarkPlugin } from "@astrojs/markdown-remark"
import { visit } from "unist-util-visit"
import sizeOf from "image-size"

export function remarkImageOptimization(): ReturnType<RemarkPlugin> {
  const promises = []
  return async function (tree) {
    visit(tree, "image", (node, _, parent) => {
      if (!parent) return
      node.data = node.data || {}
      node.data.hProperties = node.data.hProperties || {}

      const { url, alt } = node
      const { width, height } = node.data.hProperties
      const altRaw = alt?.replace(/</g, "&lt;").replace(/>/g, "&gt;")

      let dimensions = ""

      if (width) dimensions = `width=${width} height=${height ?? width}`
      else if (!/https:\/\//g.test(url)) {
        const size = sizeOf(`./public/${url}`)
        dimensions = `width=${size.width} height=${size.height}`
      }

      const value = `
        <figure>
          <img src="${url}" alt="${altRaw}" ${dimensions} loading="lazy" decoding="async" />
          <figcaption>${altRaw}</figcaption>
        </figure>`

      parent.children.splice(parent.children.indexOf(node), 1, {
        type: "html",
        value,
      })
    })
  }
}
