import { visit } from "unist-util-visit"

export const remarkImageOptimization = () => (tree: any) => {
  const v = (node: any, _: any, parent: any) => {
    node.properties = node.properties || {}
    node.data.hProperties = node.data.hProperties || {}
    node.properties.loading = "lazy"
    node.properties.decoding = "async"

    const { url, alt } = node
    const { width, height } = node.data.hProperties
    const altRaw = alt?.replace(/</g, "&lt;").replace(/>/g, "&gt;")

    const dimensions = width ? `width=${width} height=${height ?? width}` : ""

    const n = {
      type: "html",
      value: `
      <figure>
        <img src="${url}" alt="${altRaw}" ${dimensions} loading="lazy" decoding="async" />
        <figcaption>${altRaw}</figcaption>
      </figure>`,
    }

    parent.children.splice(parent.children.indexOf(node), 1, n)
  }

  return visit(tree, "image", v)
}
