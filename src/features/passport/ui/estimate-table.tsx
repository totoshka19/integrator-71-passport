import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ESTIMATE_COLUMNS } from "../model/estimate";
import type { EstimateItem } from "../model/types";

interface EstimateTableProps {
  readonly items: readonly EstimateItem[];
}

export function EstimateTable({ items }: EstimateTableProps) {
  return (
    <>
      <div className="hidden md:block">
        <Table aria-label="Позиции сметы">
          <TableHeader>
            <TableRow>
              {ESTIMATE_COLUMNS.map((column) => (
                <TableHead
                  key={column.key}
                  scope="col"
                  className={cn(column.align === "right" && "text-right")}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                {ESTIMATE_COLUMNS.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      column.align === "right"
                        ? "text-right tabular-nums"
                        : "min-w-0 break-words",
                    )}
                  >
                    {column.value(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="grid gap-3 md:hidden">
        {items.map((item) => (
          <li key={item.id}>
            <Card>
              <CardContent className="grid gap-2">
                {ESTIMATE_COLUMNS.map((column) => (
                  <div
                    key={column.key}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <span className="shrink-0 text-sm text-muted-foreground">
                      {column.label}
                    </span>
                    <span
                      className={cn(
                        "min-w-0 text-right break-words",
                        column.align === "right" && "tabular-nums",
                      )}
                    >
                      {column.value(item)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
