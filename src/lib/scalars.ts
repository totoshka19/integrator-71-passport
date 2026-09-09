declare const brand: unique symbol;

type Brand<TValue, TName extends string> = TValue & {
  readonly [brand]: TName;
};

export type Positive = Brand<number, "Positive">;

export function toPositive(value: number): Positive | null {
  return Number.isFinite(value) && value > 0 ? (value as Positive) : null;
}

export function positive(value: number): Positive {
  const result = toPositive(value);
  if (result === null) {
    throw new Error(`Ожидалось число больше нуля, получено: ${value}`);
  }
  return result;
}

export type IsoDate = Brand<string, "IsoDate">;

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function toIsoDate(value: string): IsoDate | null {
  if (!ISO_DATE_PATTERN.test(value)) return null;

  const time = Date.parse(`${value}T00:00:00Z`);
  if (Number.isNaN(time)) return null;

  // Date переносит выход за границы месяца на следующий: 2026-02-31 становится
  // 2026-03-03. Отличить это можно только обратным сравнением.
  return new Date(time).toISOString().slice(0, 10) === value
    ? (value as IsoDate)
    : null;
}

export function isoDate(value: string): IsoDate {
  const result = toIsoDate(value);
  if (result === null) throw new Error(`Некорректная дата: ${value}`);
  return result;
}

export interface DateRange {
  readonly start: IsoDate;
  readonly end: IsoDate;
}

export function toDateRange(start: string, end: string): DateRange | null {
  const parsedStart = toIsoDate(start);
  const parsedEnd = toIsoDate(end);
  if (parsedStart === null || parsedEnd === null || parsedEnd < parsedStart) {
    return null;
  }
  return { start: parsedStart, end: parsedEnd };
}

export function dateRange(start: string, end: string): DateRange {
  const result = toDateRange(start, end);
  if (result === null) {
    throw new Error(`Некорректный период: ${start} — ${end}`);
  }
  return result;
}
