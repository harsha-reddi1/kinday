import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf8f6",
          100: "#f2e8e5",
          500: "#e06c53",
          600: "#c75139",
          700: "#993d2b",
        },
        kid: {
          sun: "#FBBF24",
          grass: "#10B981",
          sky: "#38BDF8",
          purple: "#A855F7",
          coral: "#F43F5E",
        }
      },
      screens: {
        // Tablet breakpoints optimized for iPad & Android Tablets
        tab: "768px",
        tabland: "1024px",
      }
    },
  },
  plugins: [],
};
export default config;
