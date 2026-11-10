import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet } from "@/components/app/Sheet";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useIdentity } from "@/lib/experience/identity";
import { useI18n } from "@/lib/i18n/useI18n";

interface ProfileQuickPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toLocaleUpperCase();
}

/** First level of the profile: useful identity details and a clear route to full management. */
export function ProfileQuickPreview({ open, onOpenChange }: ProfileQuickPreviewProps) {
  const { t } = useI18n();
  const displayName = useIdentity((state) => state.displayName);
  const setDisplayName = useIdentity((state) => state.setDisplayName);
  const [loadedName, setLoadedName] = useState(displayName ?? "");
  const [loadedHandle, setLoadedHandle] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoadedName(displayName ?? "");
    setLoadedHandle(null);

    async function loadProfilePreview() {
      const { data: authData } = await supabase.auth.getUser();
      if (!active || !authData.user) return;

      const { data } = await supabase
        .from("profiles")
        .select("display_name,handle")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (!active || !data) return;
      if (data.display_name) {
        setLoadedName(data.display_name);
        setDisplayName(data.display_name);
      }
      setLoadedHandle(data.handle);
    }

    void loadProfilePreview();
    return () => {
      active = false;
    };
  }, [open, setDisplayName]);

  const name = loadedName.trim() || displayName?.trim() || t("identity.guest");

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
            {name !== t("identity.guest") ? (
              getInitials(name)
            ) : (
              <UserRound className="h-6 w-6" aria-hidden />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{name}</p>
          {loadedHandle ? (
            <p className="mt-1 truncate text-sm text-muted-foreground">
              @{loadedHandle}
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              {t("profile.quickPreview.cardHint")}
            </p>
          )}
        </div>
      </div>
      <p className="py-4 text-sm leading-relaxed text-muted-foreground">
        {t("profile.quickPreview.hint")}
      </p>
      <Button asChild className="h-12 w-full justify-between rounded-xl">
        <Link to="/espace" onClick={() => onOpenChange(false)}>
          {t("profile.quickPreview.full")}
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </Button>
    </Sheet>
  );
}
