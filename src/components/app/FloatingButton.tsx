import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { spring } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

type MotionButtonProps = Omit<HTMLMotionProps<"button">, "ref">;

interface FloatingButtonProps extends MotionButtonProps {
  icon: ReactNode;
  label?: string;
  /** Visual position. Anchored is fixed to viewport; inline lets parent place it. */
  position?: "bottom-right" | "bottom-center" | "inline";
  size?: "md" | "lg";
}

const sizes = {
  md: "h-12 w-12",
  lg: "h-14 w-14",
} as const;

const positions = {
  "bottom-right":
    "fixed right-4 bottom-[max(calc(env(safe-area-inset-bottom)+5.5rem),6rem)] z-40",
  "bottom-center":
    "fixed left-1/2 -translate-x-1/2 bottom-[max(calc(env(safe-area-inset-bottom)+5.5rem),6rem)] z-40",
  inline: "",
} as const;

/**
 * FloatingButton — generic FAB primitive.
 * Generic round action — never tied to a single feature.
 */
export const FloatingButton = forwardRef<HTMLButtonElement, FloatingButtonProps>(
  ({ icon, label, position = "bottom-right", size = "md", className, ...rest }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.94 }}
        transition={spring.smooth}
        aria-label={label}
        className={cn(
          "inline-flex items-center justify-center rounded-full",
          "bg-primary text-primary-foreground shadow-[var(--shadow-float)]",
          "focus-visible:outline-none",
          "tap",
          sizes[size],
          positions[position],
          className,
        )}
        {...rest}
      >
        {icon}
      </motion.button>
    );
  },
);
FloatingButton.displayName = "FloatingButton";
