import { test, expect } from "@playwright/test";

test.describe("Language Toggle", () => {
  test("switches between Welsh and English", async ({ page }) => {
    await page.goto("/");

    // Default is Welsh — look for "English" toggle
    const toggle = page.locator("button", { hasText: "English" });
    await expect(toggle).toBeVisible();

    // Switch to English
    await toggle.click();

    // Now should show "Cymraeg" to switch back
    await expect(page.locator("button", { hasText: "Cymraeg" })).toBeVisible();

    // Switch back to Welsh
    await page.locator("button", { hasText: "Cymraeg" }).click();
    await expect(page.locator("button", { hasText: "English" })).toBeVisible();
  });

  test("language persists after navigation", async ({ page }) => {
    await page.goto("/");

    // Switch to English
    await page.locator("button", { hasText: "English" }).click();
    await expect(page.locator("button", { hasText: "Cymraeg" })).toBeVisible();

    // Navigate to another page
    await page.goto("/amdanom");

    // Should still be in English
    await expect(page.locator("button", { hasText: "Cymraeg" })).toBeVisible();
  });
});
