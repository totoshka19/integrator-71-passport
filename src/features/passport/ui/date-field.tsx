import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/lib/format";
import { toIsoDate } from "@/lib/scalars";
import { cn } from "@/lib/utils";
import { CalendarDropdown } from "./calendar-dropdown";

const YEARS_AROUND = 10;

export function navigationRange(currentYear: number): {
  readonly start: Date;
  readonly end: Date;
} {
  return {
    start: new Date(currentYear - YEARS_AROUND, 0),
    end: new Date(currentYear + YEARS_AROUND, 11),
  };
}

function toLocalDate(value: string): Date | undefined {
  const iso = toIsoDate(value);
  if (iso === null) return undefined;
  const [year, month, day] = iso.split("-").map(Number);
  if (year === undefined || month === undefined || day === undefined) {
    return undefined;
  }
  return new Date(year, month - 1, day);
}

const fromLocalDate = (date: Date): string =>
  [
    String(date.getFullYear()).padStart(4, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

interface DateFieldProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly error: string | undefined;
  readonly onChange: (value: string) => void;
}

export function DateField({ id, label, value, error, onChange }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const { start: firstMonth, end: lastMonth } = navigationRange(
    new Date().getFullYear(),
  );
  const iso = toIsoDate(value);
  const selected = toLocalDate(value);
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            aria-invalid={error !== undefined}
            aria-describedby={error === undefined ? undefined : errorId}
            className={cn(
              "w-full justify-between font-normal",
              iso === null && "text-muted-foreground",
            )}
          >
            {iso === null ? "Выберите дату" : formatDate(iso)}
            <CalendarIcon className="size-4 shrink-0 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            locale={ru}
            captionLayout="dropdown"
            components={{ Dropdown: CalendarDropdown }}
            formatters={{
              formatMonthDropdown: (date) =>
                date.toLocaleString("ru", { month: "long" }),
            }}
            labels={{
              labelMonthDropdown: () => "Месяц",
              labelYearDropdown: () => "Год",
              labelNext: () => "Следующий месяц",
              labelPrevious: () => "Предыдущий месяц",
            }}
            startMonth={firstMonth}
            endMonth={lastMonth}
            selected={selected}
            {...(selected === undefined ? {} : { defaultMonth: selected })}
            onSelect={(date) => {
              if (date === undefined) return;
              onChange(fromLocalDate(date));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {error !== undefined && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
