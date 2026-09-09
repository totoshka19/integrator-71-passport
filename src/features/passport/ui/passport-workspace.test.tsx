import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { dateRange } from "@/lib/scalars";
import type { PassportState } from "../model/passport-reducer";
import type { Stage } from "../model/types";
import { PassportWorkspace } from "./passport-workspace";

const stage = (index: number, title: string, status: Stage["status"]): Stage => ({
  id: `stage_${index}`,
  title,
  status,
  period: dateRange("2026-03-02", "2026-03-13"),
});

const initial: PassportState = {
  stages: [
    stage(1, "Подготовка участка", "done"),
    stage(2, "Земляные работы", "in_progress"),
  ],
  estimate: [],
};

const renderWorkspace = () =>
  render(
    <PassportWorkspace initial={initial} mainTab={<p>Основные данные</p>} />,
  );

const openStagesTab = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("tab", { name: /Этапы/ }));
};

const openAddStageDialog = async (user: ReturnType<typeof userEvent.setup>) => {
  await openStagesTab(user);
  await user.click(screen.getByRole("button", { name: "Добавить этап" }));
  return screen.getByRole("dialog");
};

describe("добавление этапа", () => {
  it("показывает новый этап в списке", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    const dialog = await openAddStageDialog(user);

    await user.type(within(dialog).getByLabelText("Название"), "Фундамент");
    fireEvent.change(within(dialog).getByLabelText("Дата начала"), {
      target: { value: "2026-04-01" },
    });
    fireEvent.change(within(dialog).getByLabelText("Дата окончания"), {
      target: { value: "2026-04-30" },
    });
    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));

    expect(screen.getByText("Фундамент")).toBeInTheDocument();
  });

  it("создаёт новый этап блокированным", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    const dialog = await openAddStageDialog(user);

    await user.type(within(dialog).getByLabelText("Название"), "Фундамент");
    fireEvent.change(within(dialog).getByLabelText("Дата начала"), {
      target: { value: "2026-04-01" },
    });
    fireEvent.change(within(dialog).getByLabelText("Дата окончания"), {
      target: { value: "2026-04-30" },
    });
    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));

    const added = screen.getByText("Фундамент").closest("li");
    expect(added).not.toBeNull();
    expect(within(added as HTMLElement).getByText("Блокирован")).toBeInTheDocument();
  });

  it("не добавляет этап, когда форма пуста", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    const dialog = await openAddStageDialog(user);

    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.getAllByRole("listitem")).toHaveLength(initial.stages.length);
  });

  it("показывает ошибку под незаполненным полем", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    const dialog = await openAddStageDialog(user);

    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));

    expect(within(dialog).getByLabelText("Название")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("отвергает окончание раньше начала", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    const dialog = await openAddStageDialog(user);

    await user.type(within(dialog).getByLabelText("Название"), "Фундамент");
    fireEvent.change(within(dialog).getByLabelText("Дата начала"), {
      target: { value: "2026-04-30" },
    });
    fireEvent.change(within(dialog).getByLabelText("Дата окончания"), {
      target: { value: "2026-04-01" },
    });
    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));

    expect(
      within(dialog).getByText("Окончание не может быть раньше начала"),
    ).toBeInTheDocument();
  });
});
