import type { DateRange, Positive } from "@/lib/scalars";
import type {
  MeasurementUnit,
  ObjectStatus,
  ObjectType,
  StageStatus,
} from "./dictionaries";

export type ObjectId = `obj_${string}`;
export type StageId = `stage_${string}`;
export type EstimateItemId = `item_${string}`;

export interface Stage {
  readonly id: StageId;
  readonly title: string;
  readonly status: StageStatus;
  readonly period: DateRange;
}

export type StageDraft = Pick<Stage, "title" | "period">;

export interface EstimateItem {
  readonly id: EstimateItemId;
  readonly title: string;
  readonly unit: MeasurementUnit;
  readonly quantity: Positive;
  readonly unitPrice: Positive;
}

export type EstimateItemDraft = Omit<EstimateItem, "id">;

export interface ObjectPassport {
  readonly id: ObjectId;
  readonly name: string;
  readonly address: string;
  readonly type: ObjectType;
  readonly areaSqM: number;
  readonly status: ObjectStatus;
  readonly stages: readonly Stage[];
  readonly estimate: readonly EstimateItem[];
}
