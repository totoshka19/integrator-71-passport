import { useState } from "react";
import { buildStageViews } from "../model/stage-flow";
import type { StageStatus } from "../model/dictionaries";
import { STAGE_STATUSES } from "../model/dictionaries";
import type { Stage, StageDraft, StageId } from "../model/types";
import { AddStageDialog } from "./add-stage-dialog";
import { EmptyState } from "./empty-state";
import { StageCard } from "./stage-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StagesTabProps {
  readonly stages: readonly Stage[];
  readonly onAdd: (draft: StageDraft) => void;
  readonly onTransition: (id: StageId, status: StageStatus) => void;
}

export function StagesTab({ stages, onAdd, onTransition }: StagesTabProps) {
  const [selectedStageId, setSelectedStageId] = useState<StageId | null>(null);
  const views = buildStageViews(stages);
  const selectedView = views.find((view) => view.stage.id === selectedStageId);

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
                onChangeStatus={setSelectedStageId}
              />
            </li>
          ))}
        </ol>
      )}

      <Dialog
        open={selectedView !== undefined}
        onOpenChange={(open) => {
          if (!open) setSelectedStageId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить статус</DialogTitle>
            <DialogDescription>
              {selectedView?.stage.title}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            {selectedView?.transitions.map((status) => (
              <Button
                key={status}
                variant="outline"
                className="justify-start"
                onClick={() => {
                  if (selectedStageId !== null) {
                    onTransition(selectedStageId, status);
                  }
                  setSelectedStageId(null);
                }}
              >
                {STAGE_STATUSES[status].label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
