const defaultTheme = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: ["class"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Karla Variable", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: {
        DEFAULT: {
          css: {
            h1: { "@apply text-4xl font-extrabold lg:text-5xl": "" },
            h2: {
              "@apply border-b pb-2 text-3xl font-semibold first:mt-0 first-of-type:mt-6 md:first-of-type:mt-8":
                "",
            },
            h3: { "@apply text-2xl font-semibold": "" },
            h4: { "@apply text-xl font-semibold": "" },
            h5: { "@apply text-lg font-semibold": "" },
            h6: { "@apply font-semibold": "" },
            p: {
              "@apply leading-8 [&:not(:first-child)]:mt-6 text-pretty": "",
            },
            blockquote: {
              "@apply mt-6 border-l-2 border-l-border/80 pl-6 italic": "",
            },
            table: { "@apply w-full": "" },
            tr: { "@apply m-0 border-t p-0 even:bg-muted/40": "" },
            th: {
              "@apply border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right":
                "",
            },
            td: {
              "@apply border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right":
                "",
            },
            ul: { "@apply my-6 list-disc [&>li]:mt-2": "" },
            code: {
              "@apply relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-normal":
                "",
            },
            figcaption: { "@apply text-center": "" },
            ".h-icon": {
              "@apply no-underline text-muted-foreground before:content-['§_']":
                "",
            },
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar"),
  ],
}
