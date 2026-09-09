export type BadgeTone = "neutral" | "info" | "success" | "warning" | "muted";

interface LabelEntry {
  readonly label: string;
}

interface StatusEntry extends LabelEntry {
  readonly tone: BadgeTone;
}

export const OBJECT_TYPES = {
  house: { label: "Дом" },
  cottage: { label: "Коттедж" },
  apartment: { label: "Квартира" },
  commercial: { label: "Коммерция" },
} as const satisfies Record<string, LabelEntry>;

export type ObjectType = keyof typeof OBJECT_TYPES;

export const OBJECT_STATUSES = {
  draft: { label: "Черновик", tone: "neutral" },
  active: { label: "Активный", tone: "info" },
  completed: { label: "Завершён", tone: "success" },
  archived: { label: "Архив", tone: "muted" },
} as const satisfies Record<string, StatusEntry>;

export type ObjectStatus = keyof typeof OBJECT_STATUSES;

export const STAGE_STATUSES = {
  blocked: { label: "Блокирован", tone: "warning" },
  in_progress: { label: "В работе", tone: "info" },
  done: { label: "Завершён", tone: "success" },
} as const satisfies Record<string, StatusEntry>;

export type StageStatus = keyof typeof STAGE_STATUSES;

export const MEASUREMENT_UNITS = {
  sqm: { label: "м²" },
  cbm: { label: "м³" },
  rm: { label: "п.м." },
  piece: { label: "шт." },
  kg: { label: "кг" },
  liter: { label: "л" },
  set: { label: "компл." },
  service: { label: "услуга" },
} as const satisfies Record<string, LabelEntry>;

export type MeasurementUnit = keyof typeof MEASUREMENT_UNITS;

export const isMeasurementUnit = (value: string): value is MeasurementUnit =>
  Object.hasOwn(MEASUREMENT_UNITS, value);

export interface MeasurementUnitOption {
  readonly id: MeasurementUnit;
  readonly label: string;
}

export function measurementUnitOptions(): readonly MeasurementUnitOption[] {
  return Object.entries(MEASUREMENT_UNITS).flatMap(([id, entry]) =>
    isMeasurementUnit(id) ? [{ id, label: entry.label }] : [],
  );
}
