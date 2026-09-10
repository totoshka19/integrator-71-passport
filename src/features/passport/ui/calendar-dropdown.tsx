import type { ChangeEvent } from "react";
import type { DropdownProps } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CalendarDropdown({
  options,
  value,
  onChange,
  disabled,
  "aria-label": ariaLabel,
}: DropdownProps) {
  const handleValueChange = (next: string): void => {
    onChange?.({ target: { value: next } } as ChangeEvent<HTMLSelectElement>);
  };

  return (
    <Select
      value={String(value)}
      onValueChange={handleValueChange}
      disabled={disabled === true}
    >
      <SelectTrigger
        size="sm"
        aria-label={ariaLabel}
        className="relative z-10 gap-1 border-none px-2 font-medium shadow-none hover:bg-accent [&>svg]:transition-transform [&>svg]:duration-200 data-[state=open]:[&>svg]:rotate-180"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="start">
        {options?.map((option) => (
          <SelectItem
            key={option.value}
            value={String(option.value)}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
