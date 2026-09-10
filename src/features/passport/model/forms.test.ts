import { describe, expect, it } from "vitest";
import { dateRange } from "@/lib/scalars";
import {
  EMPTY_ESTIMATE_FORM,
  EMPTY_STAGE_FORM,
  validateEstimateForm,
  validateStageForm,
} from "./forms";

const stageForm = (over: Partial<typeof EMPTY_STAGE_FORM> = {}) => ({
  title: "Фундамент",
  startDate: "2026-04-01",
  endDate: "2026-04-30",
  ...over,
});

const estimateForm = (over: Partial<typeof EMPTY_ESTIMATE_FORM> = {}) => ({
  title: "Штукатурка стен",
  unit: "sqm",
  quantity: "120",
  unitPrice: "450",
  ...over,
});

describe("validateStageForm", () => {
  it("собирает доменный этап из корректной формы", () => {
    const result = validateStageForm(stageForm());
    expect(result).toEqual({
      ok: true,
      value: { title: "Фундамент", period: dateRange("2026-04-01", "2026-04-30") },
    });
  });

  it("обрезает пробелы вокруг названия", () => {
    const result = validateStageForm(stageForm({ title: "  Кровля  " }));
    expect(result.ok && result.value.title).toBe("Кровля");
  });

  it("отвергает пустую форму", () => {
    expect(validateStageForm(EMPTY_STAGE_FORM).ok).toBe(false);
  });

  it("требует название длиннее двух символов", () => {
    const result = validateStageForm(stageForm({ title: "Ф" }));
    expect(result.ok).toBe(false);
    expect(!result.ok && result.errors.title).toBeDefined();
  });

  it("отвергает название из одних пробелов", () => {
    const result = validateStageForm(stageForm({ title: "     " }));
    expect(!result.ok && result.errors.title).toBeDefined();
  });

  it("ограничивает длину названия", () => {
    const result = validateStageForm(stageForm({ title: "к".repeat(121) }));
    expect(!result.ok && result.errors.title).toBeDefined();
  });

  it("требует дату начала", () => {
    const result = validateStageForm(stageForm({ startDate: "" }));
    expect(!result.ok && result.errors.startDate).toBeDefined();
  });

  it("требует дату окончания", () => {
    const result = validateStageForm(stageForm({ endDate: "" }));
    expect(!result.ok && result.errors.endDate).toBeDefined();
  });

  it("отвергает несуществующую дату", () => {
    const result = validateStageForm(stageForm({ endDate: "2026-02-31" }));
    expect(!result.ok && result.errors.endDate).toBeDefined();
  });

  it("отвергает окончание раньше начала", () => {
    const result = validateStageForm(
      stageForm({ startDate: "2026-04-30", endDate: "2026-04-01" }),
    );
    expect(!result.ok && result.errors.endDate).toBeDefined();
  });

  it("принимает период длиной в один день", () => {
    const result = validateStageForm(
      stageForm({ startDate: "2026-04-01", endDate: "2026-04-01" }),
    );
    expect(result.ok).toBe(true);
  });
});

describe("validateEstimateForm", () => {
  it("собирает доменную позицию из корректной формы", () => {
    const result = validateEstimateForm(estimateForm());
    expect(result).toEqual({
      ok: true,
      value: { title: "Штукатурка стен", unit: "sqm", quantity: 120, unitPrice: 450 },
    });
  });

  it("отвергает пустую форму", () => {
    expect(validateEstimateForm(EMPTY_ESTIMATE_FORM).ok).toBe(false);
  });

  it("принимает запятую как десятичный разделитель", () => {
    const result = validateEstimateForm(estimateForm({ quantity: "1,5" }));
    expect(result.ok && result.value.quantity).toBe(1.5);
  });

  it("отвергает нулевое количество", () => {
    const result = validateEstimateForm(estimateForm({ quantity: "0" }));
    expect(!result.ok && result.errors.quantity).toBeDefined();
  });

  it("отвергает отрицательную цену", () => {
    const result = validateEstimateForm(estimateForm({ unitPrice: "-10" }));
    expect(!result.ok && result.errors.unitPrice).toBeDefined();
  });

  it("отвергает нечисловое количество", () => {
    const result = validateEstimateForm(estimateForm({ quantity: "много" }));
    expect(!result.ok && result.errors.quantity).toBeDefined();
  });

  it("ограничивает длину наименования", () => {
    const result = validateEstimateForm(estimateForm({ title: "к".repeat(121) }));
    expect(!result.ok && result.errors.title).toBeDefined();
  });

  it("отвергает единицу измерения не из словаря", () => {
    const result = validateEstimateForm(estimateForm({ unit: "парсек" }));
    expect(!result.ok && result.errors.unit).toBeDefined();
  });

  it("возвращает ошибки всех полей сразу", () => {
    const result = validateEstimateForm({
      title: "",
      unit: "парсек",
      quantity: "0",
      unitPrice: "",
    });
    expect(!result.ok && Object.keys(result.errors)).toEqual(
      expect.arrayContaining(["title", "unit", "quantity", "unitPrice"]),
    );
  });
});
