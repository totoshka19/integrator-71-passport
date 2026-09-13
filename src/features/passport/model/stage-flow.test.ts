import { describe, expect, it } from "vitest";
import { dateRange } from "@/lib/scalars";
import type { StageStatus } from "./dictionaries";
import {
  allowedTransitions,
  applyTransition,
  buildStageViews,
  canTransition,
  createStage,
} from "./stage-flow";
import type { Stage, StageId } from "./types";

const stage = (index: number, status: StageStatus): Stage => ({
  id: `stage_${index}`,
  title: `Этап ${index}`,
  status,
  period: dateRange("2026-03-02", "2026-03-13"),
});

const id = (index: number): StageId => `stage_${index}`;

describe("stage transitions", () => {
  it("создаёт этап ожидающим", () => {
    expect(
      createStage(id(1), {
        title: "Фундамент",
        period: dateRange("2026-04-01", "2026-04-30"),
      }).status,
    ).toBe("pending");
  });

  it.each([
    ["pending", "in_progress"],
    ["in_progress", "completed"],
    ["in_progress", "blocked"],
    ["blocked", "in_progress"],
    ["completed", "in_progress"],
  ] as const)("разрешает %s -> %s", (from, to) => {
    expect(canTransition(from, to)).toBe(true);
  });

  it.each([
    ["pending", "completed"],
    ["completed", "blocked"],
    ["blocked", "completed"],
    ["pending", "pending"],
    ["in_progress", "in_progress"],
  ] as const)("запрещает %s -> %s", (from, to) => {
    expect(canTransition(from, to)).toBe(false);
  });

  it("показывает только разрешённые переходы", () => {
    expect(allowedTransitions("in_progress")).toEqual(["completed", "blocked"]);
  });

  it("применяет разрешённый переход", () => {
    const stages = [stage(1, "in_progress")];
    expect(applyTransition(stages, id(1), "completed")[0]?.status).toBe(
      "completed",
    );
  });

  it("не изменяет этап запрещённым переходом", () => {
    const stages = [stage(1, "pending")];
    expect(applyTransition(stages, id(1), "completed")).toBe(stages);
  });

  it("не изменяет неизвестный этап", () => {
    const stages = [stage(1, "pending")];
    expect(applyTransition(stages, id(99), "in_progress")).toBe(stages);
  });
});

describe("buildStageViews", () => {
  it("нумерует этапы и строит варианты переходов", () => {
    const views = buildStageViews([
      stage(1, "pending"),
      stage(2, "in_progress"),
      stage(3, "completed"),
      stage(4, "blocked"),
    ]);
    expect(views.map((view) => view.position)).toEqual([1, 2, 3, 4]);
    expect(views.map((view) => view.transitions)).toEqual([
      ["in_progress"],
      ["completed", "blocked"],
      ["in_progress"],
      ["in_progress"],
    ]);
  });
});
