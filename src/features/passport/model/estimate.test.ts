import { describe, expect, it } from "vitest";
import { positive } from "@/lib/scalars";
import { MEASUREMENT_UNITS } from "./dictionaries";
import {
  ESTIMATE_COLUMNS,
  estimateTotal,
  lineTotal,
  platformFee,
} from "./estimate";
import type { EstimateItem } from "./types";

const NBSP = "\u00A0";

const item = (quantity: number, unitPrice: number): EstimateItem => ({
  id: "item_1",
  title: "Штукатурка стен (ГКЛ)",
  unit: "sqm",
  quantity: positive(quantity),
  unitPrice: positive(unitPrice),
});

describe("lineTotal", () => {
  it("умножает количество на цену за единицу", () => {
    expect(lineTotal(item(120, 450))).toBe(54000);
  });

  it("считает дробное количество", () => {
    expect(lineTotal(item(1.5, 100))).toBe(150);
  });
});

describe("estimateTotal", () => {
  it("складывает суммы всех позиций", () => {
    expect(estimateTotal([item(120, 450), item(10, 1000)])).toBe(64000);
  });

  it("возвращает ноль для пустой сметы", () => {
    expect(estimateTotal([])).toBe(0);
  });
});

describe("platformFee", () => {
  it("составляет семь процентов от итога", () => {
    expect(platformFee(64800)).toBe(4536);
  });

  it("округляет до целых рублей", () => {
    expect(platformFee(1234)).toBe(86);
  });

  it("равна нулю при пустой смете", () => {
    expect(platformFee(0)).toBe(0);
  });
});

describe("ESTIMATE_COLUMNS", () => {
  const sample = item(120, 450);

  it("каждая колонка возвращает непустую строку", () => {
    for (const column of ESTIMATE_COLUMNS) {
      expect(column.value(sample)).not.toBe("");
    }
  });

  it("показывает подпись единицы измерения, а не её ключ", () => {
    const unit = ESTIMATE_COLUMNS.find((column) => column.key === "unit");
    expect(unit?.value(sample)).toBe(MEASUREMENT_UNITS.sqm.label);
  });

  it("показывает в колонке суммы произведение количества на цену", () => {
    const total = ESTIMATE_COLUMNS.find((column) => column.key === "total");
    expect(total?.value(sample)).toBe(`54${NBSP}000${NBSP}₽`);
  });

  it("выравнивает числовые колонки вправо", () => {
    const numeric = ESTIMATE_COLUMNS.filter((column) =>
      ["quantity", "unitPrice", "total"].includes(column.key),
    );
    expect(numeric.every((column) => column.align === "right")).toBe(true);
  });
});
