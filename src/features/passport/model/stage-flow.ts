import { assertNever } from "@/lib/assert-never";
import type { StageStatus } from "./dictionaries";
import type { Stage, StageDraft, StageId } from "./types";

export type StageAction = "start" | "complete" | "reopen";

export const STAGE_ACTION_LABELS: Record<StageAction, string> = {
  start: "Взять в работу",
  complete: "Завершить этап",
  reopen: "Вернуть в работу",
};

const NEXT_ACTION: Record<StageStatus, StageAction> = {
  blocked: "start",
  in_progress: "complete",
  done: "reopen",
};

export const nextActionFor = (stage: Stage): StageAction =>
  NEXT_ACTION[stage.status];

export type TransitionDenial =
  | { readonly kind: "previous_not_done"; readonly blocker: Stage }
  | { readonly kind: "next_already_started"; readonly blocker: Stage };

export type TransitionCheck =
  | { readonly ok: true; readonly next: StageStatus }
  | { readonly ok: false; readonly denial: TransitionDenial };

export interface StageNeighbours {
  readonly previous: Stage | undefined;
  readonly next: Stage | undefined;
}

export function checkTransition(
  action: StageAction,
  neighbours: StageNeighbours,
): TransitionCheck {
  switch (action) {
    case "start": {
      const { previous } = neighbours;
      return previous !== undefined && previous.status !== "done"
        ? { ok: false, denial: { kind: "previous_not_done", blocker: previous } }
        : { ok: true, next: "in_progress" };
    }
    case "complete":
      return { ok: true, next: "done" };
    case "reopen": {
      const { next } = neighbours;
      return next !== undefined && next.status !== "blocked"
        ? { ok: false, denial: { kind: "next_already_started", blocker: next } }
        : { ok: true, next: "in_progress" };
    }
    default:
      return assertNever(action);
  }
}

export function describeDenial(denial: TransitionDenial): string {
  switch (denial.kind) {
    case "previous_not_done":
      return `Сначала завершите этап «${denial.blocker.title}»`;
    case "next_already_started":
      return `Этап «${denial.blocker.title}» уже начат - вернуть предыдущий нельзя`;
    default:
      return assertNever(denial);
  }
}

export function createStage(id: StageId, draft: StageDraft): Stage {
  return { id, ...draft, status: "blocked" };
}

export function applyTransition(
  stages: readonly Stage[],
  stageId: StageId,
  action: StageAction,
): readonly Stage[] {
  const index = stages.findIndex((stage) => stage.id === stageId);
  const stage = stages[index];
  if (stage === undefined) return stages;

  const check = checkTransition(action, {
    previous: stages[index - 1],
    next: stages[index + 1],
  });
  if (!check.ok) return stages;

  return stages.map((item, position) =>
    position === index ? { ...item, status: check.next } : item,
  );
}

export interface StageView {
  readonly stage: Stage;
  readonly position: number;
  readonly action: StageAction;
  readonly check: TransitionCheck;
}

export function buildStageViews(
  stages: readonly Stage[],
): readonly StageView[] {
  return stages.map((stage, index) => {
    const action = nextActionFor(stage);
    return {
      stage,
      position: index + 1,
      action,
      check: checkTransition(action, {
        previous: stages[index - 1],
        next: stages[index + 1],
      }),
    };
  });
}
