import { describe, expect, it } from "vitest";
import type { StageStatus } from "../model/dictionaries";
import { DEMO_OBJECT_ID, getPassportById, listObjectIds } from "./mock-passports";

const demo = getPassportById(DEMO_OBJECT_ID);
const statuses = (): readonly StageStatus[] =>
  demo?.stages.map((stage) => stage.status) ?? [];

describe("getPassportById", () => {
  it("находит демонстрационный объект", () => {
    expect(demo).toBeDefined();
  });

  it("возвращает undefined для неизвестного идентификатора", () => {
    expect(getPassportById("obj_нет-такого")).toBeUndefined();
  });
});

describe("listObjectIds", () => {
  it("содержит демонстрационный объект", () => {
    expect(listObjectIds()).toContain(DEMO_OBJECT_ID);
  });

  it("перечисляет все объекты, которые отдаёт getPassportById", () => {
    for (const id of listObjectIds()) {
      expect(getPassportById(id)).toBeDefined();
    }
  });
});

describe("демонстрационный объект", () => {
  it("содержит полный цикл из тринадцати этапов", () => {
    expect(demo?.stages).toHaveLength(13);
  });

  it("показывает все три статуса сразу", () => {
    expect(new Set(statuses())).toEqual(
      new Set(["done", "in_progress", "blocked"]),
    );
  });

  it("держит в работе ровно один этап", () => {
    expect(statuses().filter((status) => status === "in_progress")).toHaveLength(1);
  });

  it("не содержит завершённых этапов после незавершённого", () => {
    const all = statuses();
    const firstUnfinished = all.findIndex((status) => status !== "done");
    const tail = firstUnfinished === -1 ? [] : all.slice(firstUnfinished);
    expect(tail).not.toContain("done");
  });

  it("не содержит этапов с пустым названием", () => {
    expect(demo?.stages.every((stage) => stage.title.length > 0)).toBe(true);
  });

  it("содержит позиции сметы", () => {
    expect(demo?.estimate.length).toBeGreaterThan(0);
  });
});

describe("объект-черновик", () => {
  const draft = listObjectIds()
    .map((id) => getPassportById(id))
    .find((passport) => passport?.status === "draft");

  it("существует для показа пустых состояний", () => {
    expect(draft).toBeDefined();
  });

  it("не содержит этапов", () => {
    expect(draft?.stages).toHaveLength(0);
  });

  it("не содержит позиций сметы", () => {
    expect(draft?.estimate).toHaveLength(0);
  });
});
