import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { dateRange, positive } from "@/lib/scalars";
import type { PassportState } from "../model/passport-reducer";
import type { EstimateItem, Stage } from "../model/types";
import { PassportWorkspace } from "./passport-workspace";

const NBSP = "\u00A0";

const stage = (index: number, title: string, status: Stage["status"]): Stage => ({
  id: `stage_${index}`,
  title,
  status,
  period: dateRange("2026-03-02", "2026-03-13"),
});

const item: EstimateItem = {
  id: "item_1",
  title: "Штукатурка стен",
  unit: "sqm",
  quantity: positive(100),
  unitPrice: positive(500),
};

const initial: PassportState = {
  stages: [
    stage(1, "Подготовка участка", "done"),
    stage(2, "Земляные работы", "in_progress"),
  ],
  estimate: [item],
};

type User = ReturnType<typeof userEvent.setup>;

const renderWorkspace = (state: PassportState = initial) =>
  render(<PassportWorkspace initial={state} mainTab={<p>Основные данные</p>} />);

const openTab = async (user: User, name: RegExp) => {
  await user.click(screen.getByRole("tab", { name }));
};

const openStageDialog = async (user: User) => {
  await openTab(user, /Этапы/);
  await user.click(screen.getByRole("button", { name: "Добавить этап" }));
  return screen.getByRole("dialog");
};

const openEstimateDialog = async (user: User) => {
  await openTab(user, /Смета/);
  await user.click(screen.getByRole("button", { name: "Добавить позицию" }));
  return screen.getByRole("dialog");
};

const pickDate = async (
  user: User,
  dialog: HTMLElement,
  label: string,
  day: number,
) => {
  await user.click(within(dialog).getByLabelText(label));
  const grid = await screen.findByRole("grid");
  await user.click(within(grid).getByText(String(day)));
};

const fillStageForm = async (
  user: User,
  dialog: HTMLElement,
  startDay: number,
  endDay: number,
) => {
  await user.type(within(dialog).getByLabelText("Название"), "Фундамент");
  await pickDate(user, dialog, "Дата начала", startDay);
  await pickDate(user, dialog, "Дата окончания", endDay);
};

const fillEstimateForm = async (
  user: User,
  dialog: HTMLElement,
  quantity: string,
) => {
  await user.type(
    within(dialog).getByLabelText("Наименование"),
    "Плитка керамогранит",
  );
  await user.type(within(dialog).getByLabelText("Количество"), quantity);
  await user.type(within(dialog).getByLabelText(/Цена за ед/), "1200");
};

const totalValue = (label: string): string | undefined =>
  screen.getByText(label).parentElement?.querySelector("dd")?.textContent ??
  undefined;

describe("добавление этапа", () => {
  it("показывает новый этап в списке", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    const dialog = await openStageDialog(user);

    await fillStageForm(user, dialog, 15, 20);
    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));

    expect(screen.getByText("Фундамент")).toBeInTheDocument();
  });

  it("создаёт новый этап блокированным", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    const dialog = await openStageDialog(user);

    await fillStageForm(user, dialog, 15, 20);
    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));

    const added = screen.getByText("Фундамент").closest("li");
    expect(added).not.toBeNull();
    expect(
      within(added as HTMLElement).getByText("Блокирован"),
    ).toBeInTheDocument();
  });

  it("не добавляет этап, когда форма пуста", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    const dialog = await openStageDialog(user);

    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.getAllByRole("listitem")).toHaveLength(initial.stages.length);
  });

  it("показывает ошибку под незаполненным полем", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    const dialog = await openStageDialog(user);

    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));

    expect(within(dialog).getByLabelText("Название")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("не показывает ошибок до первой отправки", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    const dialog = await openStageDialog(user);

    await user.type(within(dialog).getByLabelText("Название"), "Ф");

    expect(within(dialog).queryByRole("alert")).toBeNull();
  });

  it("убирает ошибку, как только поле исправили", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    const dialog = await openStageDialog(user);

    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));
    expect(within(dialog).getByLabelText("Название")).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    await user.type(within(dialog).getByLabelText("Название"), "Фундамент");

    expect(within(dialog).getByLabelText("Название")).toHaveAttribute(
      "aria-invalid",
      "false",
    );
  });

  it("отвергает окончание раньше начала", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    const dialog = await openStageDialog(user);

    await fillStageForm(user, dialog, 20, 15);
    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));

    expect(
      within(dialog).getByText("Окончание не может быть раньше начала"),
    ).toBeInTheDocument();
  });
});

describe("добавление позиции сметы", () => {
  it("показывает новую позицию в таблице", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    const dialog = await openEstimateDialog(user);

    await fillEstimateForm(user, dialog, "40");
    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));

    expect(
      within(screen.getByRole("table")).getByText("Плитка керамогранит"),
    ).toBeInTheDocument();
  });

  it("увеличивает итоговую стоимость", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    await openTab(user, /Смета/);
    expect(totalValue("Итого по смете")).toBe(`50${NBSP}000${NBSP}₽`);

    await user.click(screen.getByRole("button", { name: "Добавить позицию" }));
    const dialog = screen.getByRole("dialog");
    await fillEstimateForm(user, dialog, "40");
    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));

    expect(totalValue("Итого по смете")).toBe(`98${NBSP}000${NBSP}₽`);
  });

  it("не добавляет позицию с нулевым количеством", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    const dialog = await openEstimateDialog(user);

    await fillEstimateForm(user, dialog, "0");
    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));

    expect(
      within(dialog).getByText("Число больше нуля"),
    ).toBeInTheDocument();
  });

  it("сохраняет выбранную единицу измерения", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    const dialog = await openEstimateDialog(user);

    await user.type(
      within(dialog).getByLabelText("Наименование"),
      "Арматура А500С",
    );
    await user.click(within(dialog).getByLabelText("Ед. изм."));
    await user.click(await screen.findByRole("option", { name: "кг" }));
    await user.type(within(dialog).getByLabelText("Количество"), "3200");
    await user.type(within(dialog).getByLabelText(/Цена за ед/), "78");
    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));

    const row = within(screen.getByRole("table"))
      .getByText("Арматура А500С")
      .closest("tr") as HTMLElement;
    expect(within(row).getByText("кг")).toBeInTheDocument();
  });

  it("убирает ошибку количества после исправления", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    const dialog = await openEstimateDialog(user);

    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));
    expect(within(dialog).getByLabelText("Количество")).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    await user.type(within(dialog).getByLabelText("Количество"), "40");

    expect(within(dialog).getByLabelText("Количество")).toHaveAttribute(
      "aria-invalid",
      "false",
    );
  });

  it("показывает пустое состояние, когда позиций нет", async () => {
    const user = userEvent.setup();
    renderWorkspace({ stages: [], estimate: [] });
    await openTab(user, /Смета/);

    expect(screen.getByText("В смете пока нет позиций")).toBeInTheDocument();
    expect(totalValue("Итого по смете")).toBe(`0${NBSP}₽`);
  });
});

describe("пустые состояния", () => {
  it("показывает заглушку, когда этапов нет", async () => {
    const user = userEvent.setup();
    renderWorkspace({ stages: [], estimate: [] });
    await openTab(user, /Этапы/);

    expect(screen.getByText("Этапов пока нет")).toBeInTheDocument();
  });

  it("оставляет кнопку добавления доступной на пустом списке", async () => {
    const user = userEvent.setup();
    renderWorkspace({ stages: [], estimate: [] });
    await openTab(user, /Этапы/);

    expect(
      screen.getByRole("button", { name: "Добавить этап" }),
    ).toBeInTheDocument();
  });
});

describe("доступность", () => {
  it("даёт таблице сметы название", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    await openTab(user, /Смета/);

    expect(
      screen.getByRole("table", { name: "Позиции сметы" }),
    ).toBeInTheDocument();
  });

  it("помечает заголовки столбцов области действия", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    await openTab(user, /Смета/);

    const headers = within(screen.getByRole("table")).getAllByRole(
      "columnheader",
    );
    expect(headers.length).toBeGreaterThan(0);
    for (const header of headers) {
      expect(header).toHaveAttribute("scope", "col");
    }
  });

  it("не смешивает счётчик позиций с заголовком раздела", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    await openTab(user, /Смета/);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      /^Смета$/,
    );
  });

  it("не смешивает счётчик этапов с заголовком раздела", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    await openTab(user, /Этапы/);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      /^Этапы работ$/,
    );
  });
});

describe("правила и состояние", () => {
  it("не меняет статус при запрещённом переходе", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    await openTab(user, /Этапы/);

    const card = screen
      .getByText("Подготовка участка")
      .closest("li") as HTMLElement;
    await user.click(
      within(card).getByRole("button", { name: "Вернуть в работу" }),
    );

    expect(within(card).getByText("Завершён")).toBeInTheDocument();
    expect(
      within(card).getByText(/уже начат - вернуть предыдущий нельзя/),
    ).toBeInTheDocument();
  });

  it("сохраняет изменения при переключении вкладок", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    await openTab(user, /Этапы/);

    const card = screen
      .getByText("Земляные работы")
      .closest("li") as HTMLElement;
    await user.click(
      within(card).getByRole("button", { name: "Завершить этап" }),
    );

    await openTab(user, /Смета/);
    await openTab(user, /Этапы/);

    const again = screen
      .getByText("Земляные работы")
      .closest("li") as HTMLElement;
    expect(within(again).getByText("Завершён")).toBeInTheDocument();
  });
});
