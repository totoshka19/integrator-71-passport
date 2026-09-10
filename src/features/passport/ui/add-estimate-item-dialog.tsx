import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { measurementUnitOptions } from "../model/dictionaries";
import {
  EMPTY_ESTIMATE_FORM,
  validateEstimateForm,
  type FieldErrors,
  type FormValues,
} from "../model/forms";
import type { EstimateItemDraft } from "../model/types";
import { FormField } from "./form-field";

interface AddEstimateItemDialogProps {
  readonly onCreate: (draft: EstimateItemDraft) => void;
}

const UNIT_OPTIONS = measurementUnitOptions();

export function AddEstimateItemDialog({ onCreate }: AddEstimateItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(EMPTY_ESTIMATE_FORM);
  const [submitted, setSubmitted] = useState(false);

  const result = validateEstimateForm(values);
  const errors: FieldErrors<EstimateItemDraft> =
    submitted && !result.ok ? result.errors : {};

  const reset = (): void => {
    setValues(EMPTY_ESTIMATE_FORM);
    setSubmitted(false);
  };

  const handleOpenChange = (next: boolean): void => {
    setOpen(next);
    if (!next) reset();
  };

  const update = (patch: Partial<FormValues<EstimateItemDraft>>): void => {
    setValues((current) => ({ ...current, ...patch }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
    if (!result.ok) return;
    onCreate(result.value);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">Добавить позицию</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новая позиция сметы</DialogTitle>
          <DialogDescription>
            Сумма по позиции и итог сметы пересчитаются автоматически.
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit} className="grid gap-4">
          <FormField
            id="item-title"
            label="Наименование"
            placeholder="Например, Штукатурка стен"
            value={values.title}
            error={errors.title}
            onChange={(title) => update({ title })}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="item-unit">Ед. изм.</Label>
              <Select
                value={values.unit}
                onValueChange={(unit) => update({ unit })}
              >
                <SelectTrigger
                  id="item-unit"
                  className="w-full [&>svg]:transition-transform [&>svg]:duration-200 data-[state=open]:[&>svg]:rotate-180"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  align="start"
                  className="w-[var(--radix-select-trigger-width)] min-w-0"
                >
                  {UNIT_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FormField
              id="item-quantity"
              label="Количество"
              inputMode="decimal"
              placeholder="120"
              value={values.quantity}
              error={errors.quantity}
              onChange={(quantity) => update({ quantity })}
            />
            <FormField
              id="item-price"
              label="Цена за ед., ₽"
              inputMode="decimal"
              placeholder="450"
              value={values.unitPrice}
              error={errors.unitPrice}
              onChange={(unitPrice) => update({ unitPrice })}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Добавить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
