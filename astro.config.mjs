import { defineConfig } from "astro/config"
/* integrations */
import tailwind from "@astrojs/tailwind"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import expressiveCode from "astro-expressive-code"
import vercel from "@astrojs/vercel/serverless"
/* plugins */
import { rehypeHeadingIds } from "@astrojs/markdown-remark"
import { remarkImageOptimization, rehypeLinkHeading } from "./plugins/index"
import remarkImgAttr from "remark-imgattr"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
/* others */
import theme from "./public/vercel-theme.json"
import sitemap from "@astrojs/sitemap"
const site = "https://imangelo.dev"

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: vercel(),
  site,
  devToolbar: {
    enabled: false,
  },
  markdown: {
    remarkRehype: {
      footnoteLabelProperties: {
        className: [],
      },
    },
    remarkPlugins: [remarkMath, remarkImgAttr, remarkImageOptimization],
    rehypePlugins: [rehypeHeadingIds, rehypeLinkHeading, rehypeKatex],
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    expressiveCode({
      themes: [theme],
      styleOverrides: {
        borderColor: "#27272a",
        codeBackground: "#18181b",
        codeFontFamily:
          "Cascadia, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        codePaddingInline: "1rem",
        frames: {
          editorActiveTabBackground: "#18181b",
          terminalBackground: "#18181b",
          terminalTitlebarBackground: "#18181b",
          shadowColor: "transparent",
        },
      },
    }),
    mdx(),
    sitemap(),
  ],
})
