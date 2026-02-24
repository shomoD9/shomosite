import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#0c0c10",
        ink: "#dbd6cc",
        muted: "#8e887e",
        line: "#1f1f25",
        accent: "#c9a84c",
        accentSoft: "#151518"
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Cormorant Garamond", "Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
        body: ["var(--font-body)", "EB Garamond", "Palatino Linotype", "Book Antiqua", "Georgia", "serif"],
        serif: ["var(--font-heading)", "Cormorant Garamond", "Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "Menlo", "monospace"]
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem"
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
