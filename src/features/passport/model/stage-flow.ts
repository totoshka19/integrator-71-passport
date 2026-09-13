import type { StageStatus } from "./dictionaries";
import type { Stage, StageDraft, StageId } from "./types";

export type StageAction = StageStatus;

export const STAGE_ACTION_LABELS: Record<StageAction, string> = {
  pending: "Вернуть в ожидание",
  in_progress: "Перевести в работу",
  completed: "Завершить этап",
  blocked: "Заблокировать этап",
};

const ALLOWED_TRANSITIONS: Record<StageStatus, readonly StageStatus[]> = {
  pending: ["in_progress"],
  in_progress: ["completed", "blocked"],
  completed: ["in_progress"],
  blocked: ["in_progress"],
};

export const allowedTransitions = (status: StageStatus): readonly StageStatus[] =>
  ALLOWED_TRANSITIONS[status];

export const canTransition = (from: StageStatus, to: StageStatus): boolean =>
  ALLOWED_TRANSITIONS[from].includes(to);

export function createStage(id: StageId, draft: StageDraft): Stage {
  return { id, ...draft, status: "pending" };
}

export function applyTransition(
  stages: readonly Stage[],
  stageId: StageId,
  nextStatus: StageStatus,
): readonly Stage[] {
  const stage = stages.find((item) => item.id === stageId);
  if (stage === undefined) return stages;
  if (!canTransition(stage.status, nextStatus)) return stages;
  return stages.map((item) =>
    item.id === stageId ? { ...item, status: nextStatus } : item,
  );
}

export interface StageView {
  readonly stage: Stage;
  readonly position: number;
  readonly transitions: readonly StageStatus[];
}

export function buildStageViews(
  stages: readonly Stage[],
): readonly StageView[] {
  return stages.map((stage, index) => ({
    stage,
    position: index + 1,
    transitions: allowedTransitions(stage.status),
  }));
}
