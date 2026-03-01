/*
 * This file defines Tailwind's design-token bridge for the pure monochromatic frontend.
 * Aesthetic: Unapologetic Grayscale, Infinite Depth.
 */

import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        void: "#000000",       // Pure black
        "void-soft": "#0A0A0A", // Deep off-black
        ink: "#1A1A1A",        // Darkest gray
        ash: "#888888",        // Mid gray
        light: "#FAFAFA",      // Off-white for max contrast
        pure: "#FFFFFF",       // Pure white
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Helvetica", "sans-serif"],
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"]
      },
      transitionTimingFunction: {
        "custom-spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "physics": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards"
      }
    }
  },
  plugins: [typography]
};

export default config;
