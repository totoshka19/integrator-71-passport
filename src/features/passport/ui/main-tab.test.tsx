import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ObjectPassport } from "../model/types";
import { MainTab } from "./main-tab";

const NBSP = "\u00A0";

const passport: ObjectPassport = {
  id: "obj_test",
  name: "Коттедж «Заозёрье», участок 14",
  address: "Тульская обл., Ленинский р-н, кп «Заозёрье», уч. 14",
  type: "cottage",
  areaSqM: 214.6,
  status: "active",
  stages: [],
  estimate: [],
};

describe("MainTab", () => {
  it("показывает все пять полей задания", () => {
    render(<MainTab passport={passport} />);

    for (const label of [
      "Название",
      "Адрес",
      "Тип объекта",
      "Площадь",
      "Статус",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("показывает подпись типа объекта, а не ключ словаря", () => {
    render(<MainTab passport={passport} />);

    expect(screen.getByText("Коттедж")).toBeInTheDocument();
    expect(screen.queryByText("cottage")).toBeNull();
  });

  it("показывает подпись статуса, а не ключ словаря", () => {
    render(<MainTab passport={passport} />);

    expect(screen.getByText("Активный")).toBeInTheDocument();
    expect(screen.queryByText("active")).toBeNull();
  });

  it("форматирует площадь с неразрывным пробелом перед единицей", () => {
    render(<MainTab passport={passport} />);

    const value = screen.getByText("Площадь").nextElementSibling;
    expect(value?.textContent).toBe(`214,6${NBSP}м²`);
  });

  it("связывает подписи со значениями списком определений", () => {
    render(<MainTab passport={passport} />);

    const area = screen.getByText("Площадь");
    expect(area.tagName).toBe("DT");
    expect(area.nextElementSibling?.tagName).toBe("DD");
  });
});
