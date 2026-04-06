import { test, expect } from "@playwright/test";

test.describe("Mobile Viewport", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("mobile menu button visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('button[aria-label*="menu"]')).toBeVisible();
  });

  test("mobile menu opens and shows links", async ({ page }) => {
    await page.goto("/");
    await page.click('button[aria-label*="menu"]');
    await expect(page.locator('a[href="/cartrefi-gofal"]').last()).toBeVisible();
  });

  test("search works on mobile", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test("footer scrolls into view on mobile", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").scrollIntoViewIfNeeded();
    await expect(page.locator("footer")).toBeVisible();
  });
});
