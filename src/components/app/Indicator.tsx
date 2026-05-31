import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary" | "success" | "warning" | "info" | "destructive";

interface IndicatorProps {
  tone?: Tone;
  /** Small label inside the pill. */
  label?: ReactNode;
  /** Show a leading dot. */
  dot?: boolean;
  /** Render as a tiny solid dot only (no pill). */
  dotOnly?: boolean;
  className?: string;
}

const toneRing: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary-soft text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-[oklch(0.45_0.16_75)] dark:text-warning",
  info: "bg-info/15 text-info",
  destructive: "bg-destructive/15 text-destructive",
};

const toneDot: Record<Tone, string> = {
  neutral: "bg-muted-foreground",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  destructive: "bg-destructive",
};

/**
 * Indicator — generic status pill / dot.
 * Use anywhere a small piece of meta-information needs visual weight.
 */
export function Indicator({
  tone = "neutral",
  label,
  dot,
  dotOnly,
  className,
}: IndicatorProps) {
  if (dotOnly) {
    return (
      <span
        aria-hidden
        className={cn("inline-block h-1.5 w-1.5 rounded-full", toneDot[tone], className)}
      />
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-2xs font-medium",
        toneRing[tone],
        className,
      )}
    >
      {dot && (
        <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", toneDot[tone])} />
      )}
      {label}
    </span>
  );
}
