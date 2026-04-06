import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test("main landmarks present on homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("all form inputs have labels on contact page", async ({ page }) => {
    await page.goto("/cysylltu");
    const inputs = page.locator("input, textarea, select");
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute("id");
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
  });

  test("keyboard navigation — interactive elements reachable", async ({ page }) => {
    await page.goto("/");
    // Tab through elements
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });

  test("H1 on every page — only one", async ({ page }) => {
    const pages = ["/", "/cartrefi-gofal", "/amdanom", "/cysylltu", "/darparwyr"];
    for (const path of pages) {
      await page.goto(path);
      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBe(1);
    }
  });

  test("images have alt text", async ({ page }) => {
    await page.goto("/");
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt).toBeTruthy();
    }
  });
});
