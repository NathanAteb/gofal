import { describe, it, expect } from "vitest";
import translations from "@/lib/i18n/translations";

describe("translations", () => {
  it("every key has both cy and en", () => {
    Object.entries(translations).forEach(([key, value]) => {
      expect(value).toHaveProperty("cy");
      expect(value).toHaveProperty("en");
      expect(typeof value.cy).toBe("string");
      expect(typeof value.en).toBe("string");
      expect(value.cy.length).toBeGreaterThan(0);
      expect(value.en.length).toBeGreaterThan(0);
    });
  });

  it("has all essential navigation keys", () => {
    const navKeys = [
      "nav.home", "nav.search", "nav.directory", "nav.guides",
      "nav.about", "nav.contact", "nav.providers", "nav.language",
    ];
    navKeys.forEach((key) => {
      expect(translations).toHaveProperty(key);
    });
  });

  it("has all 22 county translations", () => {
    const countyKeys = Object.keys(translations).filter((k) => k.startsWith("county."));
    expect(countyKeys.length).toBe(22);
  });

  it("does not contain CQC anywhere", () => {
    Object.entries(translations).forEach(([key, value]) => {
      expect(value.cy).not.toContain("CQC");
      expect(value.en).not.toContain("CQC");
    });
  });
});
