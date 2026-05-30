import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "plain" | "elevated" | "sunken" | "glass" | "glass-strong";
type Padding = "none" | "sm" | "md" | "lg";

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  padding?: Padding;
  /** Apply a hairline border to delimit without weight. */
  bordered?: boolean;
  /** Use a rounded radius. Defaults to 2xl (28px). */
  radius?: "md" | "lg" | "xl" | "2xl" | "3xl" | "full" | "none";
}

const variantClass: Record<Variant, string> = {
  plain: "bg-surface",
  elevated: "bg-surface-elevated shadow-[var(--shadow-elevated)]",
  sunken: "bg-surface-sunken",
  glass: "glass",
  "glass-strong": "glass-strong",
};

const paddingClass: Record<Padding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const radiusClass: Record<NonNullable<SurfaceProps["radius"]>, string> = {
  none: "rounded-none",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

/**
 * Surface — semantic container for any block. Encapsulates the
 * surface/elevation/glass system so components never reach for
 * raw bg/shadow classes.
 */
export function Surface({
  variant = "plain",
  padding = "md",
  bordered = false,
  radius = "2xl",
  className,
  ...rest
}: SurfaceProps) {
  return (
    <div
      className={cn(
        variantClass[variant],
        paddingClass[padding],
        radiusClass[radius],
        bordered && "border border-border-soft",
        className,
      )}
      {...rest}
    />
  );
}
