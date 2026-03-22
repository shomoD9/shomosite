/*
 * This file configures linting rules for the rebuilt codebase.
 * It lives on its own because style and correctness checks should remain independent from runtime code.
 * The `npm run lint` script reads this file when validating the project.
 */

module.exports = {
  extends: ["next/core-web-vitals"]
};
