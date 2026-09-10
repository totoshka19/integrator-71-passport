import { describe, expect, it } from "vitest";
import { scrollTopForSelected } from "./calendar-dropdown";

const ITEM = 28;

describe("scrollTopForSelected", () => {
  it("оставляет над выбранным два пункта", () => {
    expect(scrollTopForSelected(8 * ITEM, ITEM)).toBe(6 * ITEM);
  });

  it("не прокручивает список выше начала", () => {
    expect(scrollTopForSelected(0, ITEM)).toBe(0);
  });

  it("не прокручивает, когда выбран второй пункт", () => {
    expect(scrollTopForSelected(1 * ITEM, ITEM)).toBe(0);
  });

  it("не прокручивает, когда выбранный уже третий", () => {
    expect(scrollTopForSelected(2 * ITEM, ITEM)).toBe(0);
  });

  it("прокручивает, начиная с четвёртого пункта", () => {
    expect(scrollTopForSelected(3 * ITEM, ITEM)).toBe(1 * ITEM);
  });
});
