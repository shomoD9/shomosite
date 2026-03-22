/*
 * This file teaches Vitest how to execute the site's unit and integration tests.
 * It stays separate so test-environment concerns do not leak into application modules.
 * The `npm run test` script reads this config before loading the suites in `tests/`.
 */

import { defineConfig } from "vitest/config";
import path from "node:path";
import { configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Playwright specs belong to the browser runner, so Vitest should ignore that directory entirely.
    exclude: [...configDefaults.exclude, "tests/e2e/**"]
  },
  // Injecting React keeps TSX route modules renderable under Vitest's transform without changing production code style.
  esbuild: {
    jsxInject: 'import React from "react"'
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
