import type { HTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { Surface } from "./Surface";
import { motion as motionTokens, spring } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

interface SmartCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Optional eyebrow above the title. */
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Leading slot — icon, avatar, indicator. */
  leading?: ReactNode;
  /** Trailing slot — action button, chevron, badge. */
  trailing?: ReactNode;
  /** Footer slot — chips, actions, meta line. */
  footer?: ReactNode;
  /** Makes the whole card press-feedback ready. */
  interactive?: boolean;
  /** Visual tone of the card. */
  tone?: "plain" | "elevated" | "glass" | "sunken";
}

const toneMap = {
  plain: "plain",
  elevated: "elevated",
  glass: "glass",
  sunken: "sunken",
} as const;

/**
 * SmartCard — generic, composable card primitive.
 * The base building block for FlashCard / RadarCard / WalletCard / TrustCard.
 *
 *   <SmartCard eyebrow="Today" title="Hello" description="…" trailing={<Badge/>} />
 */
export function SmartCard({
  eyebrow,
  title,
  description,
  leading,
  trailing,
  footer,
  interactive = false,
  tone = "elevated",
  className,
  children,
  ...rest
}: SmartCardProps) {
  const Wrapper = interactive ? motion.div : "div";
  const motionProps = interactive
    ? {
        whileHover: { y: -1 },
        whileTap: { scale: 0.985 },
        transition: spring.smooth,
      }
    : {};

  return (
    <Wrapper {...(motionProps as object)} className="contents">
      <Surface
        variant={toneMap[tone]}
        padding="md"
        bordered={tone !== "elevated"}
        className={cn(
          "flex flex-col gap-3",
          interactive && "cursor-pointer tap select-none",
          className,
        )}
        {...rest}
      >
        {(eyebrow || title || description || leading || trailing) && (
          <header className="flex items-start gap-3">
            {leading && <div className="shrink-0">{leading}</div>}
            <div className="min-w-0 flex-1 space-y-1">
              {eyebrow && <div className="eyebrow">{eyebrow}</div>}
              {title && (
                <h3 className="text-base font-medium tracking-tight text-balance">{title}</h3>
              )}
              {description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              )}
            </div>
            {trailing && <div className="shrink-0">{trailing}</div>}
          </header>
        )}
        {children}
        {footer && <footer className="pt-1">{footer}</footer>}
      </Surface>
    </Wrapper>
  );
}

// Re-export motion preset for consumers that need it
export const smartCardEnter = motionTokens.fadeIn;
