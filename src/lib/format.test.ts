import { describe, expect, it } from "vitest";
import { formatArea, formatDate, formatNumber, formatRub } from "./format";
import { isoDate } from "./scalars";

const NBSP = "\u00A0";

describe("formatRub", () => {
  it("разделяет разряды неразрывным пробелом", () => {
    expect(formatRub(64800)).toBe(`64${NBSP}800${NBSP}₽`);
  });

  it("не разделяет числа короче четырёх знаков", () => {
    expect(formatRub(450)).toBe(`450${NBSP}₽`);
  });

  it("разделяет миллионы дважды", () => {
    expect(formatRub(4536000)).toBe(`4${NBSP}536${NBSP}000${NBSP}₽`);
  });

  it("округляет копейки до рублей", () => {
    expect(formatRub(4535.6)).toBe(`4${NBSP}536${NBSP}₽`);
  });

  it("показывает ноль, а не пустую строку", () => {
    expect(formatRub(0)).toBe(`0${NBSP}₽`);
  });
});

describe("formatNumber", () => {
  it("оставляет целое число без дробной части", () => {
    expect(formatNumber(120)).toBe("120");
  });

  it("отделяет дробную часть запятой", () => {
    expect(formatNumber(1234.5)).toBe(`1${NBSP}234,5`);
  });

  it("сохраняет до трёх знаков после запятой", () => {
    expect(formatNumber(1234.567)).toBe(`1${NBSP}234,567`);
  });

  it("убирает хвостовые нули", () => {
    expect(formatNumber(2.5)).toBe("2,5");
  });

  it("форматирует значение меньше единицы", () => {
    expect(formatNumber(0.5)).toBe("0,5");
  });
});

describe("formatDate", () => {
  it("переводит ISO-дату в привычный порядок", () => {
    expect(formatDate(isoDate("2026-04-07"))).toBe("07.04.2026");
  });

  it("сохраняет ведущие нули", () => {
    expect(formatDate(isoDate("2027-01-01"))).toBe("01.01.2027");
  });
});

describe("formatArea", () => {
  it("добавляет единицу измерения через неразрывный пробел", () => {
    expect(formatArea(214.6)).toBe(`214,6${NBSP}м²`);
  });
});
