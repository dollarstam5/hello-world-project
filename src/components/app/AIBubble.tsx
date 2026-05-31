import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Icon } from "./Icon";
import { motion as motionTokens } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

type Author = "assistant" | "user";

interface AIBubbleProps {
  author?: Author;
  children: ReactNode;
  /** Loading / typing state — renders a soft pulse instead of content. */
  thinking?: boolean;
  className?: string;
}

/**
 * AIBubble — generic chat bubble for assistant/user messages.
 * Reused anywhere a conversation surface is needed.
 */
export function AIBubble({ author = "assistant", children, thinking, className }: AIBubbleProps) {
  const isAssistant = author === "assistant";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTokens.fadeIn}
      className={cn(
        "flex w-full gap-2",
        isAssistant ? "justify-start" : "justify-end",
        className,
      )}
    >
      {isAssistant && (
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Icon as={Sparkles} size="xs" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isAssistant
            ? "bg-surface text-foreground rounded-tl-md"
            : "bg-primary text-primary-foreground rounded-tr-md",
        )}
      >
        {thinking ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current opacity-60" />
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-current opacity-60"
              style={{ animationDelay: "120ms" }}
            />
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-current opacity-60"
              style={{ animationDelay: "240ms" }}
            />
          </span>
        ) : (
          children
        )}
      </div>
    </motion.div>
  );
}
