import {
  Bell,
  Check,
  Eye,
  MapPin,
  ScanLine,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";

export type VisionEngineId = "flash" | "scan" | "reel" | "radar";

type ArtworkLabels = {
  flashTag: string;
  flashTitle: string;
  flashDescription: string;
  today: string;
  nearby: string;
  flashFooter: string;
  scan: string;
  live: string;
  radarSearch: string;
  radarCriteria: string;
  radarNew: string;
  radarSource: string;
  radarActions: string;
};

export function VisionEngineArtwork({
  kind,
  labels,
}: {
  kind: (typeof engines)[number]["id"];
  labels: ArtworkLabels;
}) {
  if (kind === "flash") {
    return (
      <div className="relative mx-auto flex min-h-64 w-full max-w-md items-center justify-center overflow-hidden rounded-[2rem] bg-amber-400/10 p-6">
        <div className="absolute -right-10 -top-12 size-48 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 size-48 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="relative w-full max-w-xs rotate-[-3deg] rounded-3xl border border-border/70 bg-card p-5 shadow-2xl shadow-amber-950/10">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
              {labels.flashTag}
            </span>
            <Zap className="size-5 text-amber-500" />
          </div>
          <p className="mt-5 text-lg font-bold">{labels.flashTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {labels.flashDescription}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-muted px-3 py-1 text-xs">{labels.today}</span>
            <span className="rounded-full bg-muted px-3 py-1 text-xs">{labels.nearby}</span>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
            <span>{labels.flashFooter}</span>
            <ArrowRight className="size-4" />
          </div>
        </div>
        <span className="absolute bottom-7 right-7 grid size-12 place-items-center rounded-2xl border border-amber-400/30 bg-card shadow-lg">
          <Sparkles className="size-5 text-amber-500" />
        </span>
      </div>
    );
  }

  if (kind === "scan") {
    return (
      <div className="relative mx-auto flex min-h-64 w-full max-w-md items-center justify-center overflow-hidden rounded-[2rem] bg-sky-500/10 p-6">
        <div className="relative grid aspect-square w-56 place-items-center rounded-full border border-sky-500/25">
          <div className="absolute inset-5 rounded-full border border-sky-500/25" />
          <div className="absolute inset-10 rounded-full border border-sky-500/25" />
          <div className="absolute h-px w-full rotate-[-35deg] bg-gradient-to-r from-transparent via-sky-500/70 to-transparent" />
          <div className="absolute h-full w-px bg-sky-500/15" />
          <div className="grid size-16 place-items-center rounded-2xl bg-sky-500 text-white shadow-xl shadow-sky-500/25">
            <ScanLine className="size-8" />
          </div>
          <span className="absolute left-7 top-10 grid size-9 place-items-center rounded-xl border border-sky-500/20 bg-card shadow-lg">
            <MapPin className="size-4 text-sky-500" />
          </span>
          <span className="absolute bottom-8 right-5 grid size-9 place-items-center rounded-xl border border-sky-500/20 bg-card shadow-lg">
            <Target className="size-4 text-sky-500" />
          </span>
          <span className="absolute -right-5 top-1/2 rounded-full border border-sky-500/20 bg-card px-3 py-1.5 text-xs font-semibold shadow-lg">
            {labels.scan}
          </span>
        </div>
      </div>
    );
  }

  if (kind === "reel") {
    return (
      <div className="relative mx-auto flex min-h-64 w-full max-w-md items-center justify-center overflow-hidden rounded-[2rem] bg-blue-500/10 p-6">
        <div className="absolute size-56 rounded-full border border-blue-500/15" />
        <div className="absolute size-40 rounded-full border border-blue-500/20" />
        <div className="absolute size-24 rounded-full border border-blue-500/25" />
        <div className="relative z-10 grid size-20 place-items-center rounded-full border-4 border-card bg-blue-600 text-white shadow-xl shadow-blue-600/25">
          <Users className="size-8" />
        </div>
        <span className="absolute left-[17%] top-[24%] grid size-11 place-items-center rounded-2xl border border-blue-500/20 bg-card shadow-lg">
          <Eye className="size-5 text-blue-500" />
        </span>
        <span className="absolute right-[15%] top-[30%] grid size-11 place-items-center rounded-2xl border border-blue-500/20 bg-card shadow-lg">
          <MapPin className="size-5 text-blue-500" />
        </span>
        <span className="absolute bottom-[18%] left-[28%] grid size-11 place-items-center rounded-2xl border border-blue-500/20 bg-card shadow-lg">
          <Bell className="size-5 text-blue-500" />
        </span>
        <span className="absolute bottom-5 right-5 rounded-full border border-blue-500/20 bg-card px-3 py-1.5 text-xs font-semibold shadow-lg">
          {labels.live}
        </span>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex min-h-64 w-full max-w-md items-center justify-center overflow-hidden rounded-[2rem] bg-violet-500/10 p-6">
      <div className="absolute left-10 top-10 h-40 w-px bg-gradient-to-b from-violet-500/0 via-violet-500/40 to-violet-500/0" />
      <div className="relative w-full max-w-xs space-y-3">
        <div className="flex items-center gap-3 rounded-2xl border border-violet-500/20 bg-card p-4 shadow-lg">
          <span className="grid size-10 place-items-center rounded-xl bg-violet-500/10 text-violet-500">
            <Target className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">{labels.radarSearch}</span>
            <span className="text-xs text-muted-foreground">{labels.radarCriteria}</span>
          </span>
          <Check className="size-4 text-violet-500" />
        </div>
        <div className="ml-7 h-5 border-l-2 border-dashed border-violet-500/40" />
        <div className="ml-7 flex items-center gap-3 rounded-2xl border border-violet-500/20 bg-card p-4 shadow-lg">
          <span className="grid size-10 place-items-center rounded-xl bg-violet-500/10 text-violet-500">
            <Bell className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-bold">{labels.radarNew}</span>
            <span className="text-xs text-muted-foreground">{labels.radarSource}</span>
          </span>
        </div>
        <div className="ml-14 h-5 border-l-2 border-dashed border-violet-500/40" />
        <div className="ml-14 rounded-xl border border-dashed border-violet-500/30 px-4 py-2 text-center text-xs text-muted-foreground">
          {labels.radarActions}
        </div>
      </div>
    </div>
  );
}
