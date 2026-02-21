/*
 * This file defines the design token surface for the whole interface.
 * It is separate from components so visual language stays coherent and centrally managed.
 * Components in src/app and src/components consume these tokens through utility classes.
 */
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f4f1ea",
        ink: "#151312",
        muted: "#6f665c",
        line: "#d8d2c9",
        accent: "#b06f2f",
        accentSoft: "#e7d4bd"
      },
      fontFamily: {
        serif: ["Iowan Old Style", "Palatino Linotype", "Book Antiqua", "Georgia", "serif"],
        sans: ["Avenir Next", "Segoe UI", "Helvetica Neue", "sans-serif"]
      },
      boxShadow: {
        card: "0 14px 42px -24px rgba(21, 19, 18, 0.25)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out"
      }
    }
  },
  plugins: [typography]
};

export default config;
