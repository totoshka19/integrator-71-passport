import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { STAGE_STATUSES } from "../model/dictionaries";
import type { StageView } from "../model/stage-flow";
import type { StageId } from "../model/types";
import { StatusBadge } from "./status-badge";

interface StageCardProps {
  readonly view: StageView;
  readonly onChangeStatus: (id: StageId) => void;
}

export function StageCard({ view, onChangeStatus }: StageCardProps) {
  const { stage, position } = view;
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
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => onChangeStatus(stage.id)}
          >
            Изменить статус
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
