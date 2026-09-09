import { describe, expect, it } from "vitest";
import { dateRange } from "@/lib/scalars";
import type { StageStatus } from "./dictionaries";
import {
  applyTransition,
  buildStageViews,
  checkTransition,
  createStage,
  describeDenial,
  nextActionFor,
} from "./stage-flow";
import type { Stage, StageId } from "./types";

const stage = (index: number, status: StageStatus, title = `Этап ${index}`): Stage => ({
  id: `stage_${index}`,
  title,
  status,
  period: dateRange("2026-03-02", "2026-03-13"),
});

const id = (index: number): StageId => `stage_${index}`;

describe("createStage", () => {
  it("создаёт этап в статусе «блокирован»", () => {
    const created = createStage(id(1), {
      title: "Фундамент",
      period: dateRange("2026-04-01", "2026-04-30"),
    });
    expect(created.status).toBe("blocked");
  });

  it("сохраняет переданные название и период", () => {
    const period = dateRange("2026-04-01", "2026-04-30");
    const created = createStage(id(1), { title: "Фундамент", period });
    expect(created).toMatchObject({ title: "Фундамент", period });
  });
});

describe("nextActionFor", () => {
  it("предлагает взять в работу блокированный этап", () => {
    expect(nextActionFor(stage(1, "blocked"))).toBe("start");
  });

  it("предлагает завершить этап в работе", () => {
    expect(nextActionFor(stage(1, "in_progress"))).toBe("complete");
  });

  it("предлагает вернуть в работу завершённый этап", () => {
    expect(nextActionFor(stage(1, "done"))).toBe("reopen");
  });
});

describe("checkTransition, взятие в работу", () => {
  it("разрешает первому этапу в списке", () => {
    const check = checkTransition("start", { previous: undefined, next: undefined });
    expect(check).toEqual({ ok: true, next: "in_progress" });
  });

  it("разрешает, когда предыдущий завершён", () => {
    const check = checkTransition("start", { previous: stage(1, "done"), next: undefined });
    expect(check.ok).toBe(true);
  });

  it("запрещает, когда предыдущий ещё в работе", () => {
    const previous = stage(1, "in_progress");
    const check = checkTransition("start", { previous, next: undefined });
    expect(check).toEqual({
      ok: false,
      denial: { kind: "previous_not_done", blocker: previous },
    });
  });

  it("запрещает, когда предыдущий блокирован", () => {
    const check = checkTransition("start", { previous: stage(1, "blocked"), next: undefined });
    expect(check.ok).toBe(false);
  });
});

describe("checkTransition, завершение", () => {
  it("разрешает всегда", () => {
    const check = checkTransition("complete", { previous: stage(1, "blocked"), next: stage(3, "done") });
    expect(check).toEqual({ ok: true, next: "done" });
  });
});

describe("checkTransition, возврат в работу", () => {
  it("разрешает последнему этапу в списке", () => {
    const check = checkTransition("reopen", { previous: undefined, next: undefined });
    expect(check).toEqual({ ok: true, next: "in_progress" });
  });

  it("разрешает, когда следующий ещё блокирован", () => {
    const check = checkTransition("reopen", { previous: undefined, next: stage(3, "blocked") });
    expect(check.ok).toBe(true);
  });

  it("запрещает, когда следующий уже начат", () => {
    const next = stage(3, "in_progress");
    const check = checkTransition("reopen", { previous: undefined, next });
    expect(check).toEqual({
      ok: false,
      denial: { kind: "next_already_started", blocker: next },
    });
  });

  it("запрещает, когда следующий уже завершён", () => {
    const check = checkTransition("reopen", { previous: undefined, next: stage(3, "done") });
    expect(check.ok).toBe(false);
  });
});

describe("describeDenial", () => {
  it("называет этап, который надо завершить первым", () => {
    const message = describeDenial({
      kind: "previous_not_done",
      blocker: stage(1, "in_progress", "Черновая отделка"),
    });
    expect(message).toContain("Черновая отделка");
  });

  it("называет этап, который уже начат", () => {
    const message = describeDenial({
      kind: "next_already_started",
      blocker: stage(3, "in_progress", "Кровля"),
    });
    expect(message).toContain("Кровля");
  });
});

describe("applyTransition", () => {
  const stages: readonly Stage[] = [
    stage(1, "done"),
    stage(2, "in_progress"),
    stage(3, "blocked"),
  ];

  it("переводит этап в работе в завершённый", () => {
    const result = applyTransition(stages, id(2), "complete");
    expect(result[1]?.status).toBe("done");
  });

  it("не трогает остальные этапы", () => {
    const result = applyTransition(stages, id(2), "complete");
    expect(result[0]).toBe(stages[0]);
    expect(result[2]).toBe(stages[2]);
  });

  it("возвращает исходный список, когда переход запрещён", () => {
    expect(applyTransition(stages, id(3), "start")).toBe(stages);
  });

  it("возвращает исходный список для неизвестного этапа", () => {
    expect(applyTransition(stages, id(99), "start")).toBe(stages);
  });

  it("разрешает взять в работу этап после завершённого", () => {
    const completed = applyTransition(stages, id(2), "complete");
    const started = applyTransition(completed, id(3), "start");
    expect(started[2]?.status).toBe("in_progress");
  });
});

describe("buildStageViews", () => {
  const stages: readonly Stage[] = [
    stage(1, "done"),
    stage(2, "in_progress"),
    stage(3, "blocked"),
  ];

  it("нумерует этапы с единицы", () => {
    expect(buildStageViews(stages).map((view) => view.position)).toEqual([1, 2, 3]);
  });

  it("подставляет каждому этапу его доступное действие", () => {
    expect(buildStageViews(stages).map((view) => view.action)).toEqual([
      "reopen",
      "complete",
      "start",
    ]);
  });

  it("запрещает возврат первого этапа, пока второй в работе", () => {
    expect(buildStageViews(stages)[0]?.check.ok).toBe(false);
  });

  it("запрещает взять в работу третий этап, пока второй не завершён", () => {
    expect(buildStageViews(stages)[2]?.check.ok).toBe(false);
  });
});
