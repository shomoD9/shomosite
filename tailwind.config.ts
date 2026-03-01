import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        void: "#030305",
        obsidian: "#0D0D12",
        light: "#FAF8F5",
        accent: "#C9A84C",
        dim: "#2A2A35",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Cormorant Garamond", "Playfair Display", "serif"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"]
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "3rem" // For extreme rounded corners, ensuring no sharp edges
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
