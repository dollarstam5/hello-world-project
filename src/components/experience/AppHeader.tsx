import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileQuickPreview } from "./ProfileQuickPreview";
import { useIdentity } from "@/lib/experience/identity";
import { useI18n } from "@/lib/i18n/useI18n";

export function AppHeader({ onOpenCommunication }: { onOpenCommunication: () => void }) {
  const { t } = useI18n();
  const [profileOpen, setProfileOpen] = useState(false);
  const displayName = useIdentity((state) => state.displayName);
  const avatarInitials = displayName?.trim().split(/\\s+/).slice(0, 2).map((part) => part[0] ?? "").join("").toLocaleUpperCase();

  return (
    <>
      <header className="sticky top-0 z-30 bg-transparent" style={{ paddingTop: "var(--safe-top)" }}>
        <div className="mx-auto flex h-14 w-full max-w-screen-md items-center justify-between px-3 sm:px-4">
          <Link
            to="/"
            aria-label={t("nav.home")}
            className="flex h-12 w-12 items-center justify-center rounded-xl outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <img src="/icon-192.svg" alt="" aria-hidden="true" className="h-9 w-9 rounded-xl" />
          </Link>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onOpenCommunication}
              aria-label={t("communication.open")}
              className="h-12 w-12 rounded-full"
            >
              <Bell aria-hidden className="!size-6" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setProfileOpen(true)}
              aria-label={t("profile.quickPreview.open")}
              className="h-12 w-12 rounded-full"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border-soft bg-surface text-foreground">
                {avatarInitials || <UserRound className="h-5 w-5" aria-hidden />}
              </span>
            </Button>
          </div>
        </div>
      </header>
      <ProfileQuickPreview open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  );
}
