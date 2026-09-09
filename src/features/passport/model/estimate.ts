import { formatNumber, formatRub } from "@/lib/format";
import { MEASUREMENT_UNITS } from "./dictionaries";
import type { EstimateItem } from "./types";

export const lineTotal = (item: EstimateItem): number =>
  item.quantity * item.unitPrice;

export const estimateTotal = (items: readonly EstimateItem[]): number =>
  items.reduce((sum, item) => sum + lineTotal(item), 0);

export const PLATFORM_FEE_RATE = 0.07;

export const platformFee = (total: number): number =>
  Math.round(total * PLATFORM_FEE_RATE);

export interface EstimateColumn {
  readonly key: string;
  readonly label: string;
  readonly align: "left" | "right";
  readonly value: (item: EstimateItem) => string;
}

export const ESTIMATE_COLUMNS: readonly EstimateColumn[] = [
  {
    key: "title",
    label: "Наименование",
    align: "left",
    value: (item) => item.title,
  },
  {
    key: "unit",
    label: "Ед. изм.",
    align: "left",
    value: (item) => MEASUREMENT_UNITS[item.unit].label,
  },
  {
    key: "quantity",
    label: "Кол-во",
    align: "right",
    value: (item) => formatNumber(item.quantity),
  },
  {
    key: "unitPrice",
    label: "Цена за ед.",
    align: "right",
    value: (item) => formatRub(item.unitPrice),
  },
  {
    key: "total",
    label: "Сумма",
    align: "right",
    value: (item) => formatRub(lineTotal(item)),
  },
];
