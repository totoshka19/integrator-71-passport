export interface PassportTab {
  readonly id: string;
  readonly label: string;
  readonly shortLabel: string;
}

export const PASSPORT_TABS = [
  { id: "main", label: "Основное", shortLabel: "Основное" },
  { id: "stages", label: "Этапы работ", shortLabel: "Этапы" },
  { id: "estimate", label: "Смета", shortLabel: "Смета" },
] as const satisfies readonly PassportTab[];

export type TabId = (typeof PASSPORT_TABS)[number]["id"];

export const DEFAULT_TAB_ID: TabId = "main";

export const isTabId = (value: string): value is TabId =>
  PASSPORT_TABS.some((tab) => tab.id === value);
