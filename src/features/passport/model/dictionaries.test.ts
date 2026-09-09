import { describe, expect, it } from "vitest";
import {
  MEASUREMENT_UNITS,
  isMeasurementUnit,
  measurementUnitOptions,
} from "./dictionaries";

describe("isMeasurementUnit", () => {
  it("принимает ключ из словаря", () => {
    expect(isMeasurementUnit("sqm")).toBe(true);
  });

  it("отвергает неизвестное значение", () => {
    expect(isMeasurementUnit("парсек")).toBe(false);
  });

  it("отвергает унаследованное свойство объекта", () => {
    expect(isMeasurementUnit("toString")).toBe(false);
  });
});

describe("measurementUnitOptions", () => {
  it("возвращает по одной опции на каждую единицу словаря", () => {
    expect(measurementUnitOptions()).toHaveLength(
      Object.keys(MEASUREMENT_UNITS).length,
    );
  });

  it("сохраняет порядок объявления", () => {
    expect(measurementUnitOptions().map((option) => option.id)).toEqual(
      Object.keys(MEASUREMENT_UNITS),
    );
  });

  it("подставляет подпись из словаря", () => {
    const option = measurementUnitOptions().find((it) => it.id === "sqm");
    expect(option?.label).toBe(MEASUREMENT_UNITS.sqm.label);
  });
});
