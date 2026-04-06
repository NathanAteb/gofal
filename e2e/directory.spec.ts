import { test, expect } from "@playwright/test";

test.describe("Directory", () => {
  test("loads directory page", async ({ page }) => {
    await page.goto("/cartrefi-gofal");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("has search bar", async ({ page }) => {
    await page.goto("/cartrefi-gofal");
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test("has filter dropdowns", async ({ page }) => {
    await page.goto("/cartrefi-gofal");
    const selects = page.locator("select");
    expect(await selects.count()).toBeGreaterThanOrEqual(3);
  });

  test("CQC never appears", async ({ page }) => {
    await page.goto("/cartrefi-gofal");
    const content = await page.textContent("body");
    expect(content).not.toContain("CQC");
  });

  test("breadcrumbs are present", async ({ page }) => {
    await page.goto("/cartrefi-gofal");
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toBeVisible();
  });
});
