import { describe, expect, it } from "vitest";
import { navigationRange } from "./date-field";

describe("navigationRange", () => {
  it("начинается за десять лет до текущего года", () => {
    expect(navigationRange(2026).start).toEqual(new Date(2016, 0));
  });

  it("заканчивается через десять лет после текущего года", () => {
    expect(navigationRange(2026).end).toEqual(new Date(2036, 11));
  });

  it("сдвигается вместе с текущим годом", () => {
    const range = navigationRange(2030);

    expect(range.start.getFullYear()).toBe(2020);
    expect(range.end.getFullYear()).toBe(2040);
  });

  it("всегда содержит текущий год", () => {
    for (const year of [1999, 2026, 2050]) {
      const range = navigationRange(year);
      expect(range.start.getFullYear()).toBeLessThanOrEqual(year);
      expect(range.end.getFullYear()).toBeGreaterThanOrEqual(year);
    }
  });
});
