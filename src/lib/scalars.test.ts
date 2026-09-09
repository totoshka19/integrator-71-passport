import { describe, expect, it } from "vitest";
import {
  dateRange,
  isoDate,
  positive,
  toDateRange,
  toIsoDate,
  toPositive,
} from "./scalars";

describe("toPositive", () => {
  it("принимает число больше нуля", () => {
    expect(toPositive(42)).toBe(42);
  });

  it("принимает дробное число", () => {
    expect(toPositive(0.5)).toBe(0.5);
  });

  it("отвергает ноль", () => {
    expect(toPositive(0)).toBeNull();
  });

  it("отвергает отрицательное число", () => {
    expect(toPositive(-1)).toBeNull();
  });

  it("отвергает NaN", () => {
    expect(toPositive(Number.NaN)).toBeNull();
  });

  it("отвергает бесконечность", () => {
    expect(toPositive(Number.POSITIVE_INFINITY)).toBeNull();
  });
});

describe("positive", () => {
  it("бросает исключение на недопустимом значении", () => {
    expect(() => positive(0)).toThrow();
  });
});

describe("toIsoDate", () => {
  it("принимает дату в формате YYYY-MM-DD", () => {
    expect(toIsoDate("2026-04-07")).toBe("2026-04-07");
  });

  it("отвергает другой формат записи", () => {
    expect(toIsoDate("07.04.2026")).toBeNull();
  });

  it("отвергает пустую строку", () => {
    expect(toIsoDate("")).toBeNull();
  });

  it("отвергает несуществующее число месяца", () => {
    expect(toIsoDate("2026-02-31")).toBeNull();
  });

  it("отвергает несуществующий месяц", () => {
    expect(toIsoDate("2026-13-01")).toBeNull();
  });

  it("принимает 29 февраля в високосный год", () => {
    expect(toIsoDate("2024-02-29")).toBe("2024-02-29");
  });

  it("отвергает 29 февраля в невисокосный год", () => {
    expect(toIsoDate("2026-02-29")).toBeNull();
  });
});

describe("isoDate", () => {
  it("бросает исключение на недопустимой дате", () => {
    expect(() => isoDate("2026-02-31")).toThrow();
  });
});

describe("toDateRange", () => {
  it("принимает период, где окончание позже начала", () => {
    expect(toDateRange("2026-03-02", "2026-03-13")).toEqual({
      start: "2026-03-02",
      end: "2026-03-13",
    });
  });

  it("принимает период длиной в один день", () => {
    expect(toDateRange("2026-03-02", "2026-03-02")).toEqual({
      start: "2026-03-02",
      end: "2026-03-02",
    });
  });

  it("отвергает период, где окончание раньше начала", () => {
    expect(toDateRange("2026-03-13", "2026-03-02")).toBeNull();
  });

  it("отвергает период с недопустимой датой начала", () => {
    expect(toDateRange("не дата", "2026-03-02")).toBeNull();
  });

  it("отвергает период с недопустимой датой окончания", () => {
    expect(toDateRange("2026-03-02", "2026-02-31")).toBeNull();
  });
});

describe("dateRange", () => {
  it("бросает исключение на недопустимом периоде", () => {
    expect(() => dateRange("2026-03-13", "2026-03-02")).toThrow();
  });
});
