/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        heritage: {
          DEFAULT: "rgb(var(--color-heritage-rgb) / <alpha-value>)",
          muted: "rgb(var(--color-heritage-muted-rgb) / <alpha-value>)",
          soft: "rgb(var(--color-heritage-soft-rgb) / <alpha-value>)",
        },
        ink: "rgb(var(--color-ink-rgb) / <alpha-value>)",
        parchment: "rgb(var(--color-parchment-rgb) / <alpha-value>)",
        /** Section frames & ring motifs (`--line`, `--line-strong` in CSS). */
        line: "rgb(var(--color-line-rgb) / <alpha-value>)",
        lineStrong: "rgb(var(--color-line-strong-rgb) / <alpha-value>)",
        /** Card / inset surfaces (`--bg-panel`). */
        panel: "rgb(var(--color-panel-rgb) / <alpha-value>)",
        stone: {
          50: "rgb(var(--color-stone-50-rgb) / <alpha-value>)",
          100: "rgb(var(--color-stone-100-rgb) / <alpha-value>)",
          200: "rgb(var(--color-stone-200-rgb) / <alpha-value>)",
          300: "rgb(var(--color-stone-300-rgb) / <alpha-value>)",
          400: "rgb(var(--color-stone-400-rgb) / <alpha-value>)",
          500: "rgb(var(--color-stone-500-rgb) / <alpha-value>)",
          600: "rgb(var(--color-stone-600-rgb) / <alpha-value>)",
          700: "rgb(var(--color-stone-700-rgb) / <alpha-value>)",
          800: "rgb(var(--color-stone-800-rgb) / <alpha-value>)",
          900: "rgb(var(--color-stone-900-rgb) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ['"Newsreader"', "Georgia", "serif"],
        sans: ['"Source Sans 3"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      maxWidth: {
        measure: "65ch",
        content: "72rem",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      boxShadow: {
        rail: "inset 3px 0 0 0 #C9A227",
      },
    },
  },
  plugins: [],
};
