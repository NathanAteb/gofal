import { describe, it, expect } from "vitest";
import { slugify, generateUniqueSlug } from "@/lib/utils/slugify";

describe("slugify", () => {
  it("converts basic text to slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("handles Welsh characters", () => {
    expect(slugify("Cartref Gofal Ŵyn")).toBe("cartref-gofal-wyn");
    expect(slugify("Tŷ Ceredigion")).toBe("ty-ceredigion");
  });

  it("handles accented characters", () => {
    expect(slugify("Café Résumé")).toBe("cafe-resume");
  });

  it("removes special characters", () => {
    expect(slugify("Home's & Family (Care)")).toBe("home-s-family-care");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  —Hello— ")).toBe("hello");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("a  --  b")).toBe("a-b");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
});

describe("generateUniqueSlug", () => {
  it("generates a unique slug", () => {
    const existing = new Set(["cartref-gofal-llanelli"]);
    expect(generateUniqueSlug("Cartref Gofal", "Llanelli", existing)).toBe(
      "cartref-gofal-llanelli-2"
    );
  });

  it("returns base slug when not duplicate", () => {
    const existing = new Set<string>();
    expect(generateUniqueSlug("My Home", "Cardiff", existing)).toBe(
      "my-home-cardiff"
    );
  });

  it("increments until unique", () => {
    const existing = new Set([
      "home-town",
      "home-town-2",
      "home-town-3",
    ]);
    expect(generateUniqueSlug("Home", "Town", existing)).toBe("home-town-4");
  });
});
