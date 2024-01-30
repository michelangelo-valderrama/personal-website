import { visit } from "unist-util-visit"
import sizeOf from "image-size"

interface Props {
  figure?: boolean
}

export const remarkImageOptimization =
  ({ figure = false }: Props) =>
  (tree: any) => {
    const v = (node: any, _: any, parent: any) => {
      node.properties = node.properties || {}
      node.data.hProperties = node.data.hProperties || {}
      node.properties.loading = "lazy"
      node.properties.decoding = "async"

      const { url, alt } = node
      const { width, height } = node.data.hProperties
      const altRaw = alt?.replace(/</g, "&lt;").replace(/>/g, "&gt;")

      let dimensions = ""

      if (!/https:\/\//g.test(url)) {
        const size = sizeOf(`./public/${url}`)
        dimensions = `width=${size.width} height=${size.height}`
      }

      if (width) dimensions = `width=${width} height=${height ?? width}`

      let value = `<img src="${url}" alt="${altRaw}" ${dimensions} loading="lazy" decoding="async" />`

      if (figure) {
        value = `
        <figure>
          ${value}
          <figcaption>${altRaw}</figcaption>
        </figure>`
      }

      const n = {
        type: "html",
        value,
      }

      parent.children.splice(parent.children.indexOf(node), 1, n)
    }

    return visit(tree, "image", v)
  }
