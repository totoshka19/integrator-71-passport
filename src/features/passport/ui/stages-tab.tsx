import { useState } from "react";
import { buildStageViews, type StageAction } from "../model/stage-flow";
import type { Stage, StageId } from "../model/types";
import { EmptyState } from "./empty-state";
import { StageCard } from "./stage-card";

interface StagesTabProps {
  readonly stages: readonly Stage[];
  readonly onTransition: (id: StageId, action: StageAction) => void;
}

export function StagesTab({ stages, onTransition }: StagesTabProps) {
  const [deniedStageId, setDeniedStageId] = useState<StageId | null>(null);
  const views = buildStageViews(stages);

  const handleTransition = (id: StageId, action: StageAction): void => {
    const view = views.find((item) => item.stage.id === id);
    if (view !== undefined && !view.check.ok) {
      setDeniedStageId(id);
      return;
    }
    setDeniedStageId(null);
    onTransition(id, action);
  };

  if (views.length === 0) {
    return (
      <EmptyState
        title="Этапов пока нет"
        description="Добавьте первый этап работ, чтобы отслеживать ход строительства."
      />
    );
  }

  return (
    <ol className="grid gap-3">
      {views.map((view) => (
        <li key={view.stage.id}>
          <StageCard
            view={view}
            showDenial={deniedStageId === view.stage.id}
            onTransition={handleTransition}
          />
        </li>
      ))}
    </ol>
  );
}
