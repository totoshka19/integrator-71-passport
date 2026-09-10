import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ObjectPassport } from "../model/types";
import { ObjectHeader } from "./object-header";

const passport: ObjectPassport = {
  id: "obj_test",
  name: "Коттедж «Заозёрье», участок 14",
  address: "Тульская обл., Ленинский р-н, кп «Заозёрье», уч. 14",
  type: "cottage",
  areaSqM: 214.6,
  status: "draft",
  stages: [],
  estimate: [],
};

describe("ObjectHeader", () => {
  it("показывает название заголовком первого уровня", () => {
    render(<ObjectHeader passport={passport} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Коттедж «Заозёрье», участок 14",
    );
  });

  it("показывает подпись статуса, а не ключ словаря", () => {
    render(<ObjectHeader passport={passport} />);

    expect(screen.getByText("Черновик")).toBeInTheDocument();
    expect(screen.queryByText("draft")).toBeNull();
  });
});
