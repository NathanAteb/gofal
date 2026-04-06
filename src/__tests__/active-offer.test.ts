import { describe, it, expect } from "vitest";
import { detectActiveOfferLevel } from "@/lib/utils/active-offer";

describe("detectActiveOfferLevel", () => {
  it("returns 0 for empty text", () => {
    expect(detectActiveOfferLevel("")).toBe(0);
    expect(detectActiveOfferLevel("")).toBe(0);
  });

  it("returns 0 for text with no Welsh indicators", () => {
    expect(detectActiveOfferLevel("The home provides good care.")).toBe(0);
  });

  it("returns 1 for some Welsh", () => {
    expect(detectActiveOfferLevel("Some Welsh greetings are used.")).toBe(1);
  });

  it("returns 2 for good provision", () => {
    expect(
      detectActiveOfferLevel("Welsh-speaking staff are available.")
    ).toBe(2);
  });

  it("returns 3 for excellent provision", () => {
    expect(
      detectActiveOfferLevel("Welsh is the first language of the home.")
    ).toBe(3);
  });

  it("returns 3 when multiple level 2 indicators", () => {
    expect(
      detectActiveOfferLevel(
        "The home has bilingual signage, welsh speaking staff, and an active offer policy."
      )
    ).toBe(3);
  });

  it("handles Welsh language text", () => {
    expect(
      detectActiveOfferLevel("Mae'r cynnig rhagweithiol yn cael ei weithredu.")
    ).toBe(2);
  });
});
