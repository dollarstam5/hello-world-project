import { Link } from "@tanstack/react-router";
import { ChevronRight, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet } from "@/components/app/Sheet";
import { Button } from "@/components/ui/button";
import { useIdentity } from "@/lib/experience/identity";
import { useI18n } from "@/lib/i18n/useI18n";

interface ProfileQuickPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getInitials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] ?? "").join("").toLocaleUpperCase();
}

/** First level of the profile: a quick identity preview with a clear route to the full page. */
export function ProfileQuickPreview({ open, onOpenChange }: ProfileQuickPreviewProps) {
  const { t } = useI18n();
  const displayName = useIdentity((state) => state.displayName);
  const tier = useIdentity((state) => state.tier);
  const name = displayName?.trim() || t("identity.guest");

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={t("profile.title")}
      description={t("profile.subtitle")}
      className="max-h-[80dvh]"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-border-soft bg-surface p-4">
        <Avatar className="h-14 w-14 border border-border-soft">
          <AvatarFallback className="bg-primary-soft text-primary">
            {displayName ? getInitials(displayName) : <UserRound className="h-6 w-6" aria-hidden />}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t(`identity.${tier}`)}</p>
        </div>
      </div>
      <p className="py-4 text-sm leading-relaxed text-muted-foreground">{t("profile.quickPreview.hint")}</p>
      <Button asChild className="h-12 w-full justify-between rounded-xl">
        <Link to="/espace" onClick={() => onOpenChange(false)}>
          {t("profile.quickPreview.full")}
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </Button>
    </Sheet>
  );
}
