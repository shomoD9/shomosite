/*
 * This file wires Tailwind and Autoprefixer into the CSS build pipeline.
 * It exists separately because stylesheet compilation is infrastructure, not page logic.
 * Next.js invokes this config whenever it processes `src/app/globals.css`.
 */

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
