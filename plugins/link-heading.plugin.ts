import type { RehypePlugin } from "@astrojs/markdown-remark"
import type { Element } from "hast"
import { visit } from "unist-util-visit"

export function rehypeLinkHeading(): ReturnType<RehypePlugin> {
  return function (tree) {
    visit(tree, (node, _, parent) => {
      if (node.type !== "element") return
      if (!parent) return

      const element = node as Element
      const { tagName } = element
      if (!/h([0-6])/.test(tagName)) return

      const slug = element.properties["id"]!

      const newNode = Object.assign(element, {
        children: [
          {
            type: "element",
            tagName: "a",
            properties: {
              href: `#${slug}`,
              "aria-hidden": "true",
              tabindex: "-1",
              class: "h-icon",
            },
          },
          ...element.children,
        ],
      })

      parent.children.splice(parent.children.indexOf(element), 1, newNode)
    })
  }
}
