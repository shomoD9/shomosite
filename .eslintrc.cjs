/*
 * This file configures lint rules for the whole codebase.
 * It is kept separate so quality constraints remain centralized and tooling-friendly.
 * ESLint reads this file when npm run lint is executed.
 */
module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    "react/no-unescaped-entities": "off"
  }
};
