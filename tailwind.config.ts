import type { Config } from "tailwindcss";

/**
 * ClassOne design tokens.
 * - ink: page background, matched to the hero building image's backdrop.
 * - red: sampled from the ClassOne logo (#CD171F). One accent only.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090e10",
        charcoal: "#14161A",
        line: "rgba(255,255,255,0.10)",
        red: {
          DEFAULT: "#CD171F",
          // Lighter tint for small red text: passes WCAG AA (4.5:1) on ink and charcoal.
          bright: "#F5453C",
          deep: "#A8121A",
        },
        fg: {
          DEFAULT: "rgba(255,255,255,0.92)",
          body: "rgba(255,255,255,0.65)",
          muted: "rgba(255,255,255,0.45)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Oswald", "Impact", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.32em",
        wide2: "0.18em",
      },
      maxWidth: {
        site: "1320px",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        600: "600ms",
        800: "800ms",
      },
    },
  },
  plugins: [],
};

export default config;
