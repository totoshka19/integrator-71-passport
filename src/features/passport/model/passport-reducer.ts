import { assertNever } from "@/lib/assert-never";
import { applyTransition, createStage, type StageAction } from "./stage-flow";
import type {
  EstimateItem,
  EstimateItemDraft,
  EstimateItemId,
  Stage,
  StageDraft,
  StageId,
} from "./types";

export interface PassportState {
  readonly stages: readonly Stage[];
  readonly estimate: readonly EstimateItem[];
}

export type PassportAction =
  | { readonly type: "stage/added"; readonly id: StageId; readonly draft: StageDraft }
  | {
      readonly type: "stage/transitioned";
      readonly id: StageId;
      readonly action: StageAction;
    }
  | {
      readonly type: "estimate/added";
      readonly id: EstimateItemId;
      readonly draft: EstimateItemDraft;
    };

export function passportReducer(
  state: PassportState,
  action: PassportAction,
): PassportState {
  switch (action.type) {
    case "stage/added":
      return {
        ...state,
        stages: [...state.stages, createStage(action.id, action.draft)],
      };
    case "stage/transitioned": {
      const stages = applyTransition(state.stages, action.id, action.action);
      return stages === state.stages ? state : { ...state, stages };
    }
    case "estimate/added":
      return {
        ...state,
        estimate: [...state.estimate, { id: action.id, ...action.draft }],
      };
    default:
      return assertNever(action);
  }
}
