import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
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
  tone,
}: EngineCardProps) {
  return (
    <Link
      to={to}
      onClick={() => haptic.tap()}
      className="native-press group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Surface
        variant="glass-soft"
        padding="md"
        bordered
        interactive
        className="flex h-full min-h-36 flex-col justify-between gap-4 transition-all duration-200 group-hover:border-primary/35 group-active:scale-[0.985] motion-reduce:transition-none"
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
          <div className="rounded-xl border border-white/[0.07] bg-background/35 px-2.5 py-1.5 backdrop-blur-sm">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {exampleLabel}
            </span>
            <p className="text-xs font-medium leading-relaxed">{example}</p>
          </div>
          <span className="block pt-0.5 text-xs font-semibold text-primary">{action}</span>
        </div>
      </Surface>
    </Link>
  );
}
