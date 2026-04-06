import { describe, it, expect } from "vitest";
import { counties, getCountyBySlug, getCountyName, normalizeCounty } from "@/lib/utils/counties";

describe("counties", () => {
  it("has all 22 Welsh counties", () => {
    expect(counties).toHaveLength(22);
  });

  it("each county has slug, name_cy, and name_en", () => {
    counties.forEach((c) => {
      expect(c.slug).toBeTruthy();
      expect(c.name_cy).toBeTruthy();
      expect(c.name_en).toBeTruthy();
    });
  });
});

describe("getCountyBySlug", () => {
  it("finds a county by slug", () => {
    const county = getCountyBySlug("caerdydd");
    expect(county).toBeDefined();
    expect(county!.name_en).toBe("Cardiff");
    expect(county!.name_cy).toBe("Caerdydd");
  });

  it("returns undefined for invalid slug", () => {
    expect(getCountyBySlug("not-a-county")).toBeUndefined();
  });
});

describe("getCountyName", () => {
  it("returns Welsh name for cy locale", () => {
    expect(getCountyName("abertawe", "cy")).toBe("Abertawe");
  });

  it("returns English name for en locale", () => {
    expect(getCountyName("abertawe", "en")).toBe("Swansea");
  });

  it("returns slug for unknown county", () => {
    expect(getCountyName("unknown", "cy")).toBe("unknown");
  });
});

describe("normalizeCounty", () => {
  it("matches by slug", () => {
    expect(normalizeCounty("sir-gaerfyrddin")?.name_en).toBe("Carmarthenshire");
  });

  it("matches by English name (case insensitive)", () => {
    expect(normalizeCounty("Cardiff")?.slug).toBe("caerdydd");
  });

  it("matches by Welsh name", () => {
    expect(normalizeCounty("Gwynedd")?.slug).toBe("gwynedd");
  });

  it("returns undefined for no match", () => {
    expect(normalizeCounty("Devon")).toBeUndefined();
  });
});
