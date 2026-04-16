/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        heritage: {
          DEFAULT: "#C9A227",
          muted: "#A88620",
          soft: "#E8D48A",
        },
        ink: "#0c0c0c",
        parchment: "#FAF7F0",
        stone: {
          50: "#F5F1EA",
          100: "#E8E2D6",
          200: "#D4CBB8",
          300: "#B8AB95",
          400: "#8A7F6C",
          500: "#5E5648",
          600: "#454038",
          700: "#2F2C27",
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
