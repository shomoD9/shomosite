/*
 * This file wires PostCSS transforms used during stylesheet compilation.
 * It is isolated so style tooling can evolve independently from application logic.
 * Tailwind and autoprefixer both plug into this pipeline before CSS reaches the browser.
 */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

export default config;
