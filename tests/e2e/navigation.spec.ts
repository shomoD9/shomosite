/*
 * This file provides an end-to-end smoke check for navigation and critical homepage CTAs.
 * It is separate from unit/integration tests because it validates behavior in a real browser context.
 * Playwright runs this file using config from playwright.config.ts.
 */

import { expect, test } from "@playwright/test";

test("core navigation and primary CTAs are reachable", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Capacity is the/i })
  ).toBeVisible();

  const subscribeCta = page.getByRole("link", { name: "Subscribe" });
  await expect(subscribeCta).toHaveAttribute("href", /substack/i);

  // This sequence verifies each top-level medium route is navigable in production-like behavior.
  await page.getByRole("link", { name: "Essays" }).first().click();
  await expect(page).toHaveURL(/\/essays$/);

  await page.getByRole("link", { name: "Videos" }).first().click();
  await expect(page).toHaveURL(/\/videos$/);

  await page.getByRole("link", { name: "Books" }).first().click();
  await expect(page).toHaveURL(/\/books$/);

  await page.getByRole("link", { name: "Tools" }).first().click();
  await expect(page).toHaveURL(/\/tools$/);
});
