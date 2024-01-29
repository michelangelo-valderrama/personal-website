import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"

import expressiveCode from "astro-expressive-code"

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(
      tailwind({
        applyBaseStyles: false,
      })
    ),
    react(),
    expressiveCode({
      themes: ["dark-plus"],
    }),
    mdx(),
  ],
})
