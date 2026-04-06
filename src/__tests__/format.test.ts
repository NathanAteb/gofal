import { describe, it, expect } from "vitest";
import { formatDate, formatFee, formatFeeRange, formatPhoneForTel } from "@/lib/utils/format";

describe("formatDate", () => {
  it("formats date in Welsh", () => {
    expect(formatDate("2026-03-15", "cy")).toBe("15 Mawrth 2026");
  });

  it("formats date in English", () => {
    expect(formatDate("2026-03-15", "en")).toBe("15 March 2026");
  });

  it("handles Welsh month names", () => {
    expect(formatDate("2026-01-01", "cy")).toBe("1 Ionawr 2026");
    expect(formatDate("2026-06-20", "cy")).toBe("20 Mehefin 2026");
    expect(formatDate("2026-12-25", "cy")).toBe("25 Rhagfyr 2026");
  });

  it("returns original string for invalid date", () => {
    expect(formatDate("not-a-date", "en")).toBe("not-a-date");
  });
});

describe("formatFee", () => {
  it("formats pence to pounds", () => {
    expect(formatFee(80000)).toBe("£800");
  });

  it("handles pence correctly", () => {
    expect(formatFee(80050)).toBe("£800.50");
  });

  it("handles zero", () => {
    expect(formatFee(0)).toBe("£0");
  });
});

describe("formatFeeRange", () => {
  it("formats a range", () => {
    expect(formatFeeRange(800, 1200, "en")).toBe("£800 – £1,200 per week");
  });

  it("formats single fee", () => {
    expect(formatFeeRange(900, 900, "en")).toBe("£900 per week");
  });

  it("returns not specified for nulls", () => {
    expect(formatFeeRange(null, null, "cy")).toBe("Heb ei nodi");
    expect(formatFeeRange(null, null, "en")).toBe("Not specified");
  });

  it("handles Welsh locale", () => {
    expect(formatFeeRange(800, 1200, "cy")).toBe("£800 – £1,200 yr wythnos");
  });
});

describe("formatPhoneForTel", () => {
  it("converts UK number for tel: link", () => {
    expect(formatPhoneForTel("01234 567890")).toBe("+441234567890");
  });

  it("strips whitespace", () => {
    expect(formatPhoneForTel("01234  567  890")).toBe("+441234567890");
  });
});
