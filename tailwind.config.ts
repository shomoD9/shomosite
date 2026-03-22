/*
 * This file defines the design tokens that Tailwind can reference across the site.
 * It is separated from component files so typography, spacing, and color decisions stay coherent.
 * App routes and shared components consume these tokens through utility classes.
 */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bone: "#f6f1e7",
        paper: "#e9dfd0",
        graphite: "#746d62",
        steel: "#5d6770",
        ink: "#171412",
        ember: "#2a2520"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      letterSpacing: {
        poster: "0.12em"
      },
      boxShadow: {
        hairline: "0 0 0 1px rgba(23, 20, 18, 0.08)"
      },
      maxWidth: {
        copy: "42rem"
      }
    }
  },
  plugins: []
};

export default config;
