import { describe, expect, it } from "vitest";
import { DEFAULT_TAB_ID, PASSPORT_TABS, isTabId } from "./tabs";

describe("isTabId", () => {
  it("принимает идентификатор каждой объявленной вкладки", () => {
    for (const tab of PASSPORT_TABS) {
      expect(isTabId(tab.id)).toBe(true);
    }
  });

  it("отвергает неизвестное значение", () => {
    expect(isTabId("documents")).toBe(false);
  });

  it("отвергает свойство прототипа", () => {
    expect(isTabId("toString")).toBe(false);
  });
});

describe("PASSPORT_TABS", () => {
  it("у каждой вкладки есть полная и короткая подпись", () => {
    for (const tab of PASSPORT_TABS) {
      expect(tab.label.length).toBeGreaterThan(0);
      expect(tab.shortLabel.length).toBeGreaterThan(0);
    }
  });

  it("открывается на вкладке, которая есть в списке", () => {
    expect(isTabId(DEFAULT_TAB_ID)).toBe(true);
  });
});
