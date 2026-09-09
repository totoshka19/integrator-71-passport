import { Card, CardContent } from "@/components/ui/card";
import { formatRub } from "@/lib/format";
import { PLATFORM_FEE_RATE, estimateTotal, platformFee } from "../model/estimate";
import type { EstimateItem } from "../model/types";
import { EmptyState } from "./empty-state";
import { EstimateTable } from "./estimate-table";

interface EstimateTabProps {
  readonly items: readonly EstimateItem[];
}

export function EstimateTab({ items }: EstimateTabProps) {
  const total = estimateTotal(items);
  const fee = platformFee(total);
  const feePercent = Math.round(PLATFORM_FEE_RATE * 100);

  return (
    <div className="grid gap-4">
      {items.length === 0 ? (
        <EmptyState
          title="В смете пока нет позиций"
          description="Добавьте работы и материалы, чтобы увидеть итоговую стоимость."
        />
      ) : (
        <EstimateTable items={items} />
      )}

      <Card>
        <CardContent>
          <dl className="grid gap-2">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-medium">Итого по смете</dt>
              <dd className="text-lg font-semibold tabular-nums">
                {formatRub(total)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 text-sm text-muted-foreground">
              <dt>Комиссия платформы {feePercent}%</dt>
              <dd className="tabular-nums">{formatRub(fee)}</dd>
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-4 border-t pt-3">
              <dt className="font-medium">К оплате</dt>
              <dd className="text-lg font-semibold tabular-nums">
                {formatRub(total + fee)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
