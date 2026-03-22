/*
 * This file verifies the basic public navigation in a real browser.
 * It exists separately because desktop layout, tap targets, and route transitions deserve at least one browser-level check.
 * Playwright runs it against the local dev server configured in `playwright.config.ts`.
 */

import { expect, test } from "@playwright/test";

test("primary navigation reaches the major public routes", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Prose. Product. Productivity." })).toBeVisible();
  await expect(page.getByRole("link", { name: "View the work", exact: true })).toHaveAttribute("href", "/work");

  await Promise.all([
    page.waitForURL("**/work"),
    page.getByRole("link", { name: "View the work", exact: true }).click()
  ]);
  await expect(page.getByRole("heading", { name: "Essays, videos, builds, and systems." })).toBeVisible();

  // We use the real nav labels here because they define the published information architecture.
  await Promise.all([
    page.waitForURL("**/prose"),
    page.getByRole("link", { name: "Prose", exact: true }).click()
  ]);
  await expect(page.getByRole("heading", { name: "Prose", exact: true })).toBeVisible();

  await Promise.all([
    page.waitForURL("**/collaborate"),
    page.getByRole("link", { name: "Working together", exact: true }).click()
  ]);
  await expect(page.getByRole("heading", { name: "Working together", exact: true })).toBeVisible();
});
