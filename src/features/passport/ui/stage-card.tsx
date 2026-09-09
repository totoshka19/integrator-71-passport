import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { STAGE_STATUSES } from "../model/dictionaries";
import {
  STAGE_ACTION_LABELS,
  describeDenial,
  type StageAction,
  type StageView,
} from "../model/stage-flow";
import type { StageId } from "../model/types";
import { StatusBadge } from "./status-badge";

interface StageCardProps {
  readonly view: StageView;
  readonly showDenial: boolean;
  readonly onTransition: (id: StageId, action: StageAction) => void;
}

export function StageCard({ view, showDenial, onTransition }: StageCardProps) {
  const { stage, position, action, check } = view;
  const status = STAGE_STATUSES[stage.status];

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 gap-3">
          <span className="pt-0.5 text-sm tabular-nums text-muted-foreground">
            {position}
          </span>
          <div className="min-w-0">
            <p className="font-medium break-words">{stage.title}</p>
            <p className="mt-1 text-sm tabular-nums text-muted-foreground">
              {formatDate(stage.period.start)} - {formatDate(stage.period.end)}
            </p>
            {showDenial && !check.ok && (
              <p role="status" className="mt-2 text-sm text-amber-700">
                {describeDenial(check.denial)}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => onTransition(stage.id, action)}
          >
            {STAGE_ACTION_LABELS[action]}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
