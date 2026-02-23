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
        paper: "#08080a",
        ink: "#c8c2b8",
        muted: "#716b63",
        line: "#1e1e22",
        accent: "#8a8478",
        accentSoft: "#0e0e10"
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Cormorant Garamond", "Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
        body: ["var(--font-body)", "EB Garamond", "Palatino Linotype", "Book Antiqua", "Georgia", "serif"],
        serif: ["var(--font-heading)", "Cormorant Garamond", "Iowan Old Style", "Palatino Linotype", "Georgia", "serif"]
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out"
      }
    }
  },
  plugins: [typography]
};

export default config;
