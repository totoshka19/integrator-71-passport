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
import {
  EMPTY_STAGE_FORM,
  validateStageForm,
  type FieldErrors,
  type StageFormValues,
} from "../model/forms";
import type { StageDraft } from "../model/types";
import { DateField } from "./date-field";
import { FormField } from "./form-field";

interface AddStageDialogProps {
  readonly onCreate: (draft: StageDraft) => void;
}

export function AddStageDialog({ onCreate }: AddStageDialogProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<StageFormValues>(EMPTY_STAGE_FORM);
  const [submitted, setSubmitted] = useState(false);

  const result = validateStageForm(values);
  const errors: FieldErrors<StageFormValues> =
    submitted && !result.ok ? result.errors : {};

  const reset = (): void => {
    setValues(EMPTY_STAGE_FORM);
    setSubmitted(false);
  };

  const handleOpenChange = (next: boolean): void => {
    setOpen(next);
    if (!next) reset();
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
        <Button size="sm">Добавить этап</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый этап</DialogTitle>
          <DialogDescription>
            Этап встанет в конец списка со статусом «Блокирован».
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit} className="grid gap-4">
          <FormField
            id="stage-title"
            label="Название"
            placeholder="Например, Фундамент"
            value={values.title}
            error={errors.title}
            onChange={(title) => setValues((current) => ({ ...current, title }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <DateField
              id="stage-start"
              label="Дата начала"
              value={values.startDate}
              error={errors.startDate}
              onChange={(startDate) =>
                setValues((current) => ({ ...current, startDate }))
              }
            />
            <DateField
              id="stage-end"
              label="Дата окончания"
              value={values.endDate}
              error={errors.endDate}
              onChange={(endDate) =>
                setValues((current) => ({ ...current, endDate }))
              }
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
