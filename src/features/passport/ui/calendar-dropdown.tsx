import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { DropdownProps } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ITEMS_ABOVE_SELECTED = 2;

export function scrollTopForSelected(
  selectedTop: number,
  itemHeight: number,
): number {
  return Math.max(0, selectedTop - ITEMS_ABOVE_SELECTED * itemHeight);
}

export function CalendarDropdown({
  options,
  value,
  onChange,
  disabled,
  "aria-label": ariaLabel,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const frame = requestAnimationFrame(() => {
      const viewport = contentRef.current?.querySelector<HTMLElement>(
        "[data-radix-select-viewport]",
      );
      const selected = viewport?.querySelector<HTMLElement>(
        '[data-state="checked"]',
      );
      if (viewport === null || viewport === undefined || !selected) return;
      viewport.scrollTop = scrollTopForSelected(
        selected.offsetTop,
        selected.offsetHeight,
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const handleValueChange = (next: string): void => {
    onChange?.({ target: { value: next } } as ChangeEvent<HTMLSelectElement>);
  };

  return (
    <Select
      open={open}
      onOpenChange={setOpen}
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
      <SelectContent
        ref={contentRef}
        position="popper"
        align="start"
        className="max-h-42 [&_[data-radix-select-viewport]]:[scrollbar-width:thin]! [&_[data-slot=select-scroll-down-button]]:hidden [&_[data-slot=select-scroll-up-button]]:hidden"
      >
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
