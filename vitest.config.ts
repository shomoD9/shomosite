/*
 * This file configures how unit and integration tests run in Vitest.
 * It exists apart from app modules so test-runtime concerns do not leak into production code.
 * Test files in tests/ rely on these aliases, environment settings, and setup hooks.
 */
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}", "tests/integration/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["tests/e2e/**"]
  },
  // Next.js keeps JSX in preserve mode for its own compiler, so Vitest needs an explicit automatic transform.
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
