import type { Config } from "tailwindcss";

/**
 * Deitsh brand palette — barn red / wood brown / wheat gold / sky blue.
 * Per CLAUDE.md + PRD Section 8: NEVER use Duolingo green. These warm folk
 * tones are the only brand colors. Applied in a soft/saturated cartoon way.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Barn red
        barn: {
          50: "#fdf3f2",
          100: "#fbe0dd",
          200: "#f5b8b1",
          300: "#ec8b80",
          400: "#df5f51",
          500: "#c8402f", // primary barn red
          600: "#a83124",
          700: "#87271d",
          800: "#66201a",
          900: "#4a1714",
        },
        // Wood brown
        wood: {
          50: "#faf6f1",
          100: "#f0e6d8",
          200: "#e0c9ad",
          300: "#cca87d",
          400: "#b6864f",
          500: "#9c6b38", // primary wood brown
          600: "#7f5530",
          700: "#63432a",
          800: "#4b3421",
          900: "#382719",
        },
        // Wheat gold
        wheat: {
          50: "#fdf9ed",
          100: "#f9efcb",
          200: "#f2dd92",
          300: "#ecc95c",
          400: "#e6b533", // primary wheat gold
          500: "#d69a1f",
          600: "#b57717",
          700: "#915717",
          800: "#78451a",
          900: "#663a1a",
        },
        // Sky blue
        sky: {
          50: "#f0f8fd",
          100: "#dcedfa",
          200: "#c0e1f6",
          300: "#93cdef",
          400: "#5fb2e5",
          500: "#3a95d6", // primary sky blue
          600: "#2a77b8",
          700: "#245f95",
          800: "#23517c",
          900: "#214467",
        },
        // Warm off-white "sun-bleached parchment" surface
        cream: "#fbf6ec",
        parchment: "#f4ead6",
      },
      fontFamily: {
        // Friendly rounded chunky display for headers; clean sans for body.
        display: ["var(--font-display)", "ui-rounded", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        chunky: "1.25rem",
      },
      boxShadow: {
        // Thick friendly bottom "3D button" shadow used across the app.
        pop: "0 4px 0 0 rgba(0,0,0,0.18)",
        "pop-sm": "0 3px 0 0 rgba(0,0,0,0.18)",
        card: "0 6px 0 0 rgba(99,67,42,0.25)",
      },
      keyframes: {
        bouncey: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12%)" },
        },
        headtilt: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(-6deg)" },
        },
        pop: {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "70%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
      animation: {
        bouncey: "bouncey 0.9s ease-in-out infinite",
        headtilt: "headtilt 1.6s ease-in-out infinite",
        pop: "pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        sway: "sway 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
