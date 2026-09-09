import { Card, CardContent } from "@/components/ui/card";
import { formatArea } from "@/lib/format";
import { OBJECT_STATUSES, OBJECT_TYPES } from "../model/dictionaries";
import type { ObjectPassport } from "../model/types";
import { StatusBadge } from "./status-badge";

interface MainTabProps {
  readonly passport: ObjectPassport;
}

export function MainTab({ passport }: MainTabProps) {
  const status = OBJECT_STATUSES[passport.status];

  const fields = [
    { label: "Название", value: passport.name },
    { label: "Адрес", value: passport.address },
    { label: "Тип объекта", value: OBJECT_TYPES[passport.type].label },
    { label: "Площадь", value: formatArea(passport.areaSqM) },
  ];

  return (
    <Card>
      <CardContent>
        <dl className="grid gap-5 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="min-w-0">
              <dt className="text-sm text-muted-foreground">{field.label}</dt>
              <dd className="mt-1 font-medium break-words">{field.value}</dd>
            </div>
          ))}
          <div className="min-w-0">
            <dt className="text-sm text-muted-foreground">Статус</dt>
            <dd className="mt-1">
              <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
