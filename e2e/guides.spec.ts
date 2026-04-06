import { test, expect } from "@playwright/test";

test.describe("Guides", () => {
  test("loads guides index", async ({ page }) => {
    await page.goto("/canllawiau");
    await expect(page.locator("h1")).toBeVisible();
    // Should have guide cards
    const links = page.locator('a[href*="/canllawiau/"]');
    expect(await links.count()).toBeGreaterThanOrEqual(5);
  });

  test("loads individual guide", async ({ page }) => {
    await page.goto("/canllawiau/sut-i-ddod-o-hyd-i-gartref-gofal");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("article")).toBeVisible();
  });

  test("guide has breadcrumbs", async ({ page }) => {
    await page.goto("/canllawiau/deall-graddfeydd-ciw");
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toBeVisible();
  });

  test("guide has CTA at end", async ({ page }) => {
    await page.goto("/canllawiau/costau-cartrefi-gofal-cymru-2026");
    await expect(page.locator('a[href="/cartrefi-gofal"]').last()).toBeVisible();
  });

  test("CQC never appears in guides", async ({ page }) => {
    await page.goto("/canllawiau/deall-graddfeydd-ciw");
    const content = await page.textContent("body");
    expect(content).not.toContain("CQC");
  });
});
