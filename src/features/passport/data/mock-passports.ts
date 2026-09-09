import { dateRange, positive } from "@/lib/scalars";
import { applyTransition, createStage } from "../model/stage-flow";
import type { EstimateItem, ObjectId, ObjectPassport, Stage } from "../model/types";

interface StageSeed {
  readonly title: string;
  readonly start: string;
  readonly end: string;
}

const HOUSE_STAGE_SEEDS: readonly StageSeed[] = [
  { title: "Подготовка участка", start: "2026-03-02", end: "2026-03-13" },
  { title: "Земляные работы", start: "2026-03-16", end: "2026-03-31" },
  { title: "Фундамент", start: "2026-04-01", end: "2026-04-30" },
  { title: "Возведение стен и перекрытий", start: "2026-05-04", end: "2026-06-19" },
  { title: "Кровля", start: "2026-06-22", end: "2026-07-17" },
  { title: "Черновая отделка", start: "2026-07-20", end: "2026-08-28" },
  { title: "Инженерные сети (скрытая часть)", start: "2026-08-31", end: "2026-09-25" },
  { title: "Чистовая отделка", start: "2026-09-28", end: "2026-10-30" },
  { title: "Сантехника и оборудование", start: "2026-11-02", end: "2026-11-27" },
  { title: "Благоустройство территории", start: "2026-11-30", end: "2026-12-18" },
  { title: "Финальная уборка", start: "2026-12-21", end: "2026-12-25" },
  { title: "Приёмка", start: "2027-01-12", end: "2027-01-23" },
  { title: "Гарантийное обслуживание", start: "2027-01-26", end: "2028-01-26" },
];

function buildTimeline(
  seeds: readonly StageSeed[],
  completed: number,
): readonly Stage[] {
  let stages: readonly Stage[] = seeds.map((seed, index) =>
    createStage(`stage_${index + 1}`, {
      title: seed.title,
      period: dateRange(seed.start, seed.end),
    }),
  );

  for (let index = 0; index < completed; index += 1) {
    const id = stages[index]?.id;
    if (id === undefined) continue;
    stages = applyTransition(stages, id, "start");
    stages = applyTransition(stages, id, "complete");
  }

  const currentId = stages[completed]?.id;
  return currentId === undefined
    ? stages
    : applyTransition(stages, currentId, "start");
}

const HOUSE_ESTIMATE: readonly EstimateItem[] = [
  {
    id: "item_1",
    title: "Геодезическая разбивка участка",
    unit: "service",
    quantity: positive(1),
    unitPrice: positive(45000),
  },
  {
    id: "item_2",
    title: "Разработка котлована экскаватором",
    unit: "cbm",
    quantity: positive(210),
    unitPrice: positive(620),
  },
  {
    id: "item_3",
    title: "Бетон М300 для фундаментной плиты",
    unit: "cbm",
    quantity: positive(64),
    unitPrice: positive(5900),
  },
  {
    id: "item_4",
    title: "Арматура А500С d12",
    unit: "kg",
    quantity: positive(3200),
    unitPrice: positive(78),
  },
  {
    id: "item_5",
    title: "Кладка газобетонных блоков D500",
    unit: "cbm",
    quantity: positive(96),
    unitPrice: positive(3400),
  },
  {
    id: "item_6",
    title: "Стропильная система с монтажом",
    unit: "sqm",
    quantity: positive(180),
    unitPrice: positive(2150),
  },
  {
    id: "item_7",
    title: "Металлочерепица с монтажом и водостоками",
    unit: "sqm",
    quantity: positive(180),
    unitPrice: positive(1480),
  },
  {
    id: "item_8",
    title: "Штукатурка стен (ГКЛ)",
    unit: "sqm",
    quantity: positive(120),
    unitPrice: positive(450),
  },
];

const PASSPORTS: readonly ObjectPassport[] = [
  {
    id: "obj_kottedzh-zaozerye",
    name: "Коттедж «Заозёрье», участок 14",
    address: "Тульская обл., Ленинский р-н, кп «Заозёрье», уч. 14",
    type: "cottage",
    areaSqM: 214.6,
    status: "active",
    stages: buildTimeline(HOUSE_STAGE_SEEDS, 5),
    estimate: HOUSE_ESTIMATE,
  },
  {
    id: "obj_kvartira-mytishchi",
    name: "Квартира на Юбилейной, 42",
    address: "Московская обл., Мытищи, ул. Юбилейная, 42, кв. 118",
    type: "apartment",
    areaSqM: 68.3,
    status: "draft",
    stages: [],
    estimate: [],
  },
];

export const DEMO_OBJECT_ID: ObjectId = "obj_kottedzh-zaozerye";

export const listObjectIds = (): readonly ObjectId[] =>
  PASSPORTS.map((passport) => passport.id);

export const getPassportById = (
  objectId: string,
): ObjectPassport | undefined =>
  PASSPORTS.find((passport) => passport.id === objectId);
