import { test, expect } from "@playwright/test";

test.describe("County Pages", () => {
  test("loads Carmarthenshire page", async ({ page }) => {
    await page.goto("/cartrefi-gofal/sir-gaerfyrddin");
    await expect(page.locator("h1")).toContainText(/Sir Gaerfyrddin|Carmarthenshire/);
  });

  test("loads Cardiff page", async ({ page }) => {
    await page.goto("/cartrefi-gofal/caerdydd");
    await expect(page.locator("h1")).toContainText(/Caerdydd|Cardiff/);
  });

  test("shows Welsh speaker percentage", async ({ page }) => {
    await page.goto("/cartrefi-gofal/gwynedd");
    const content = await page.textContent("body");
    expect(content).toContain("64.4%");
  });

  test("has CIW link", async ({ page }) => {
    await page.goto("/cartrefi-gofal/abertawe");
    await expect(page.locator('a[href*="careinspectorate"]')).toBeVisible();
  });

  test("CQC never appears on county pages", async ({ page }) => {
    await page.goto("/cartrefi-gofal/caerdydd");
    const content = await page.textContent("body");
    expect(content).not.toContain("CQC");
  });
});
