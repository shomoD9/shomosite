/*
 * This file configures browser-level verification for the rebuilt site.
 * It exists separately so end-to-end assumptions about ports and browsers remain explicit.
 * Playwright gets its own dedicated dev-server port so stale local servers do not leak into browser tests.
 * The `npm run test:e2e` script reads it before launching Playwright.
 */

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:3100"
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
    port: 3100,
    reuseExistingServer: false
  }
});
