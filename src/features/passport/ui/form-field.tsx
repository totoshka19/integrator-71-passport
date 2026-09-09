import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly error: string | undefined;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly inputMode?: "decimal";
}

export function FormField({
  id,
  label,
  value,
  error,
  onChange,
  ...input
}: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        aria-invalid={error !== undefined}
        aria-describedby={error === undefined ? undefined : errorId}
        onChange={(event) => onChange(event.target.value)}
        {...input}
      />
      {error !== undefined && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
