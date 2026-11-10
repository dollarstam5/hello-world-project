import { useState } from "react";
import { ChevronRight, MapPin, UserRound } from "lucide-react";
import type { PublicProfilePreview as PublicProfilePreviewData } from "@eco/core-contracts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet } from "./Sheet";
import { useI18n } from "@/lib/i18n/useI18n";

interface PublicProfilePreviewProps {
  profile: PublicProfilePreviewData;
  origin: "real" | "demo";
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toLocaleUpperCase();
}

/** Compact, consent-aware public identity preview with a lightweight profile sheet. */
export function PublicProfilePreview({ profile, origin }: PublicProfilePreviewProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("profile.preview.open")}
        className="flex min-h-12 w-full items-center gap-2.5 rounded-xl text-left outline-none transition-colors hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar className="h-9 w-9 border border-border-soft">
          {profile.avatarUrl ? <AvatarImage src={profile.avatarUrl} alt="" /> : null}
          <AvatarFallback className="bg-primary-soft text-xs font-semibold text-primary">
            {initials(profile.displayName) || <UserRound className="h-4 w-4" aria-hidden />}
          </AvatarFallback>
        </Avatar>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{profile.displayName}</span>
          <span className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden />
            <span className="truncate">{profile.areaLabel}</span>
          </span>
        </span>
        <span className="max-w-24 truncate rounded-full bg-surface px-2 py-1 text-[10px] font-medium text-muted-foreground">
          {t(`flash.category.${profile.category}`)}
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      </button>

      <Sheet
        open={open}
        onOpenChange={setOpen}
        title={profile.displayName}
        description={
          origin === "demo"
            ? t("profile.preview.demoDescription")
            : t("profile.preview.publicDescription")
        }
        side="bottom"
        className="max-h-[82dvh] overflow-y-auto"
      >
        <div className="flex items-center gap-3 pb-4">
          <Avatar className="h-16 w-16 border border-border-soft">
            {profile.avatarUrl ? <AvatarImage src={profile.avatarUrl} alt="" /> : null}
            <AvatarFallback className="bg-primary-soft text-lg font-semibold text-primary">
              {initials(profile.displayName) || <UserRound className="h-6 w-6" aria-hidden />}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold">{profile.displayName}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {profile.areaLabel}
            </p>
            <span className="mt-2 inline-flex rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
              {t(`flash.category.${profile.category}`)}
            </span>
          </div>
        </div>
        <div className="rounded-2xl bg-surface p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("profile.preview.about")}
          </p>
          <p className="text-sm leading-relaxed">{profile.summary}</p>
        </div>
        {origin === "demo" ? (
          <p className="pt-3 text-xs text-muted-foreground">{t("demo.label")}</p>
        ) : null}
      </Sheet>
    </>
  );
}
