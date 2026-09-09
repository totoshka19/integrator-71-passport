import { describe, expect, it } from "vitest";
import { dateRange, positive } from "@/lib/scalars";
import { passportReducer, type PassportState } from "./passport-reducer";
import type { Stage, StageDraft } from "./types";

const period = dateRange("2026-04-01", "2026-04-30");

const stage = (index: number, status: Stage["status"]): Stage => ({
  id: `stage_${index}`,
  title: `Этап ${index}`,
  status,
  period,
});

const draft: StageDraft = { title: "Кровля", period };

const initial = (): PassportState => ({
  stages: [stage(1, "done"), stage(2, "in_progress")],
  estimate: [],
});

describe("stage/added", () => {
  it("добавляет этап в конец списка", () => {
    const next = passportReducer(initial(), {
      type: "stage/added",
      id: "stage_new",
      draft,
    });
    expect(next.stages.at(-1)?.title).toBe("Кровля");
  });

  it("создаёт новый этап блокированным", () => {
    const next = passportReducer(initial(), {
      type: "stage/added",
      id: "stage_new",
      draft,
    });
    expect(next.stages.at(-1)?.status).toBe("blocked");
  });

  it("не изменяет переданное состояние", () => {
    const state = initial();
    passportReducer(state, { type: "stage/added", id: "stage_new", draft });
    expect(state.stages).toHaveLength(2);
  });

  it("не трогает смету", () => {
    const state = initial();
    const next = passportReducer(state, {
      type: "stage/added",
      id: "stage_new",
      draft,
    });
    expect(next.estimate).toBe(state.estimate);
  });
});

describe("stage/transitioned", () => {
  it("переводит этап в следующий статус", () => {
    const next = passportReducer(initial(), {
      type: "stage/transitioned",
      id: "stage_2",
      action: "complete",
    });
    expect(next.stages[1]?.status).toBe("done");
  });

  it("возвращает то же состояние, когда переход запрещён", () => {
    const state = initial();
    const next = passportReducer(state, {
      type: "stage/transitioned",
      id: "stage_1",
      action: "reopen",
    });
    expect(next).toBe(state);
  });

  it("возвращает то же состояние для неизвестного этапа", () => {
    const state = initial();
    expect(
      passportReducer(state, {
        type: "stage/transitioned",
        id: "stage_404",
        action: "start",
      }),
    ).toBe(state);
  });
});

describe("estimate/added", () => {
  const item = {
    title: "Штукатурка стен",
    unit: "sqm",
    quantity: positive(120),
    unitPrice: positive(450),
  } as const;

  it("добавляет позицию с переданным идентификатором", () => {
    const next = passportReducer(initial(), {
      type: "estimate/added",
      id: "item_new",
      draft: item,
    });
    expect(next.estimate.at(-1)).toEqual({ id: "item_new", ...item });
  });

  it("не трогает этапы", () => {
    const state = initial();
    const next = passportReducer(state, {
      type: "estimate/added",
      id: "item_new",
      draft: item,
    });
    expect(next.stages).toBe(state.stages);
  });
});
