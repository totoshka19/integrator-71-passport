import type { VariantProps } from "class-variance-authority";
import { Badge, badgeVariants } from "@/components/ui/badge";
import type { BadgeTone } from "../model/dictionaries";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const TONE_STYLES: Record<
  BadgeTone,
  { readonly variant: BadgeVariant; readonly className: string }
> = {
  neutral: { variant: "secondary", className: "" },
  info: {
    variant: "secondary",
    className: "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200",
  },
  success: {
    variant: "secondary",
    className:
      "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  },
  warning: {
    variant: "outline",
    className:
      "border-amber-500 text-amber-700 dark:border-amber-500/60 dark:text-amber-300",
  },
  muted: { variant: "outline", className: "text-muted-foreground" },
};

interface StatusBadgeProps {
  readonly tone: BadgeTone;
  readonly children: string;
}

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  const style = TONE_STYLES[tone];
  return (
    <Badge variant={style.variant} className={style.className}>
      {children}
    </Badge>
  );
}
