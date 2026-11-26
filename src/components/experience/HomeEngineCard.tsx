import { Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Surface } from "@/components/app/Surface";
import { haptic } from "@/platform/device/haptics";

type EngineCardProps = {
  to: "/flash" | "/scan" | "/reel" | "/radar";
  icon: LucideIcon;
  title: string;
  description: string;
  example: string;
  exampleLabel: string;
  action: string;
  exampleAction: string;
  tone: "warm" | "info" | "primary" | "violet";
};

const toneClasses = {
  warm: "bg-warm-soft text-warm ring-warm/15",
  info: "bg-info/10 text-info ring-info/15",
  primary: "bg-primary-soft text-primary ring-primary/15",
  violet: "bg-intelligence-soft text-intelligence ring-intelligence/15",
} as const;

export function HomeEngineCard({
  to,
  icon: Icon,
  title,
  description,
  example,
  exampleLabel,
  action,
  exampleAction,
  tone,
}: EngineCardProps) {
  return (
    <Surface
        variant="glass-soft"
        padding="md"
        bordered
        interactive
        className="group flex h-full min-h-36 flex-col justify-between gap-4 transition-colors duration-200 motion-reduce:transition-none"
      >
        <div className="flex items-start justify-between gap-3">
          <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${toneClasses[tone]}`}>
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <ArrowUpRight
            className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden
          />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
          <div className="rounded-xl border border-border-soft bg-surface-sunken px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {exampleLabel}
            </span>
            <p className="text-xs font-medium leading-relaxed">{example}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs font-semibold">
            <Link to={to} hash="guide" onClick={() => haptic.tap()} className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-1 text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />{action}
            </Link>
            <Link to={to} hash="example" onClick={() => haptic.tap()} className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Lightbulb className="h-3.5 w-3.5" aria-hidden />{exampleAction}
            </Link>
          </div>
        </div>
      </Surface>
  );
}
