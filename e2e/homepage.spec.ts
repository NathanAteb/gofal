import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/gofal\.wales/);
  });

  test("displays hero section with search", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('input[type="search"]')).toBeVisible();
  });

  test("has navigation links", async ({ page }) => {
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator('a[href="/cartrefi-gofal"]').first()).toBeVisible();
  });

  test("has footer with county links", async ({ page }) => {
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator('footer a[href*="cartrefi-gofal"]').first()).toBeVisible();
  });

  test("CQC never appears on page", async ({ page }) => {
    const content = await page.textContent("body");
    expect(content).not.toContain("CQC");
  });

  test("search redirects to directory", async ({ page }) => {
    await page.fill('input[type="search"]', "Cardiff");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/cartrefi-gofal\?q=Cardiff/);
  });
});
