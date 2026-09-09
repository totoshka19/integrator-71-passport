import { OBJECT_STATUSES } from "../model/dictionaries";
import type { ObjectPassport } from "../model/types";
import { StatusBadge } from "./status-badge";

interface ObjectHeaderProps {
  readonly passport: ObjectPassport;
}

export function ObjectHeader({ passport }: ObjectHeaderProps) {
  const status = OBJECT_STATUSES[passport.status];

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <h1 className="min-w-0 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        {passport.name}
      </h1>
      <div className="shrink-0">
        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      </div>
    </header>
  );
}
