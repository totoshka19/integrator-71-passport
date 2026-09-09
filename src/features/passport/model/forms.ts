import { toDateRange, toIsoDate, toPositive } from "@/lib/scalars";
import { isMeasurementUnit } from "./dictionaries";
import type { EstimateItemDraft, StageDraft } from "./types";

export type FormValues<TDraft> = { readonly [K in keyof TDraft]: string };

export type FieldErrors<TFields> = Partial<Record<keyof TFields, string>>;

export type ValidationResult<TValue, TFields> =
  | { readonly ok: true; readonly value: TValue }
  | { readonly ok: false; readonly errors: FieldErrors<TFields> };

const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 120;

const toDecimal = (value: string): number => Number(value.replace(",", "."));

export interface StageFormValues {
  readonly title: string;
  readonly startDate: string;
  readonly endDate: string;
}

export const EMPTY_STAGE_FORM: StageFormValues = {
  title: "",
  startDate: "",
  endDate: "",
};

export function validateStageForm(
  values: StageFormValues,
): ValidationResult<StageDraft, StageFormValues> {
  const errors: FieldErrors<StageFormValues> = {};
  const title = values.title.trim();

  if (title.length < TITLE_MIN_LENGTH) {
    errors.title = `Минимум ${TITLE_MIN_LENGTH} символа`;
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Не длиннее ${TITLE_MAX_LENGTH} символов`;
  }

  if (toIsoDate(values.startDate) === null) {
    errors.startDate = "Укажите дату";
  }
  if (toIsoDate(values.endDate) === null) {
    errors.endDate = "Укажите дату";
  }

  const period = toDateRange(values.startDate, values.endDate);
  if (
    period === null &&
    errors.startDate === undefined &&
    errors.endDate === undefined
  ) {
    errors.endDate = "Окончание не может быть раньше начала";
  }

  if (period === null || Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, value: { title, period } };
}

export const EMPTY_ESTIMATE_FORM: FormValues<EstimateItemDraft> = {
  title: "",
  unit: "sqm",
  quantity: "",
  unitPrice: "",
};

export function validateEstimateForm(
  values: FormValues<EstimateItemDraft>,
): ValidationResult<EstimateItemDraft, EstimateItemDraft> {
  const errors: FieldErrors<EstimateItemDraft> = {};

  const title = values.title.trim();
  const unit = isMeasurementUnit(values.unit) ? values.unit : null;
  const quantity = toPositive(toDecimal(values.quantity));
  const unitPrice = toPositive(toDecimal(values.unitPrice));

  if (title.length < TITLE_MIN_LENGTH) {
    errors.title = `Минимум ${TITLE_MIN_LENGTH} символа`;
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Не длиннее ${TITLE_MAX_LENGTH} символов`;
  }
  if (unit === null) errors.unit = "Выберите единицу измерения";
  if (quantity === null) errors.quantity = "Число больше нуля";
  if (unitPrice === null) errors.unitPrice = "Число больше нуля";

  if (
    unit === null ||
    quantity === null ||
    unitPrice === null ||
    Object.keys(errors).length > 0
  ) {
    return { ok: false, errors };
  }
  return { ok: true, value: { title, unit, quantity, unitPrice } };
}
