import { test, expect } from "@playwright/test";

test.describe("Language Toggle", () => {
  test("switches between Welsh and English", async ({ page }) => {
    await page.goto("/");

    // Default is Welsh — CY button should be active (has bg-primary)
    const enButton = page.locator('button[aria-label="English"]');
    await expect(enButton).toBeVisible();

    // Switch to English
    await enButton.click();

    // Now CY button should be inactive and we can switch back
    const cyButton = page.locator('button[aria-label="Cymraeg"]');
    await expect(cyButton).toBeVisible();

    // Switch back to Welsh
    await cyButton.click();
    await expect(enButton).toBeVisible();
  });

  test("language persists after navigation", async ({ page }) => {
    await page.goto("/");

    // Switch to English
    await page.locator('button[aria-label="English"]').click();

    // Navigate to another page
    await page.goto("/amdanom");

    // EN button should still be highlighted — check the page has English content
    await expect(page.locator("h1")).toContainText(/About Us/);
  });
});
