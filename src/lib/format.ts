import type { IsoDate } from "./scalars";

const NBSP = "\u00A0";

const groupDigits = (digits: string): string =>
  digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);

export const formatRub = (value: number): string =>
  `${groupDigits(Math.round(value).toString())}${NBSP}₽`;

export function formatNumber(value: number): string {
  const [integer = "0", fraction = ""] = value.toFixed(3).split(".");
  const trimmed = fraction.replace(/0+$/, "");
  const grouped = groupDigits(integer);
  return trimmed === "" ? grouped : `${grouped},${trimmed}`;
}

export const formatDate = (value: IsoDate): string =>
  value.split("-").reverse().join(".");

export const formatArea = (value: number): string =>
  `${formatNumber(value)}${NBSP}м²`;
