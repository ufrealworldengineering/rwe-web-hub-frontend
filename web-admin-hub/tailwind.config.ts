import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Rethink Sans'", "ui-sans-serif", "system-ui"],
        serif: ["'Roboto Slab'", "ui-serif", "Georgia"],
      },
      colors: {
        background: {
          primary: "var(--color-background-primary)",
          secondary: "var(--color-background-secondary)",
          tertiary: "var(--color-background-tertiary)",
          accent: "var(--color-background-accent)",
          "accent-secondary": "var(--color-background-accent-secondary)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
        },
        foreground: {
          primary: "var(--color-foreground-primary)",
          secondary: "var(--color-foreground-secondary)",
          tertiary: "var(--color-foreground-tertiary)",
        },
      },
    },
  },
  darkMode: "class", // toggled with <html class="dark"> or <body class="dark">
  plugins: [],
};

export default config;
