import { useState } from "react";
import { buildStageViews, type StageAction } from "../model/stage-flow";
import type { Stage, StageDraft, StageId } from "../model/types";
import { AddStageDialog } from "./add-stage-dialog";
import { EmptyState } from "./empty-state";
import { StageCard } from "./stage-card";

interface StagesTabProps {
  readonly stages: readonly Stage[];
  readonly onAdd: (draft: StageDraft) => void;
  readonly onTransition: (id: StageId, action: StageAction) => void;
}

export function StagesTab({ stages, onAdd, onTransition }: StagesTabProps) {
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

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-medium">Этапы работ</h2>
          <span className="text-muted-foreground tabular-nums">
            {views.length}
          </span>
        </div>
        <AddStageDialog onCreate={onAdd} />
      </div>

      {views.length === 0 ? (
        <EmptyState
          title="Этапов пока нет"
          description="Добавьте первый этап работ, чтобы отслеживать ход строительства."
        />
      ) : (
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
      )}
    </div>
  );
}
