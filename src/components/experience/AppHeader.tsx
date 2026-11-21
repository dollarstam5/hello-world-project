import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { haptic } from "@/platform/device/haptics";
import { ProfileQuickPreview } from "./ProfileQuickPreview";
import { useIdentity } from "@/lib/experience/identity";
import { useAuth } from "@/domains/auth/model/useAuth";
import { useI18n } from "@/lib/i18n/useI18n";
import { useCommunicationRuntime } from "@/lib/communication/CommunicationRuntimeProvider";
import { useReelActivityProjection } from "@/domains/presence/model/reel-activity-projection";

export function AppHeader({ onOpenCommunication }: { onOpenCommunication: () => void }) {
  const { t } = useI18n();
  const communication = useCommunicationRuntime();
  const unreadEvents = communication.getEvents().filter((event) => event.readAt === null);
  const unreadBipEvents = unreadEvents.filter(
    (event) => event.messageKey === "communication.event.reel.bipReceived",
  ).length;
  const unreadNonBipEvents = unreadEvents.length - unreadBipEvents;
  const pendingBips = useReelActivityProjection((state) => state.pendingBips);
  const bipsReady = useReelActivityProjection((state) => state.bipsReady);
  // The same received bip is represented by both the server event and the
  // engine projection. Count it once while retaining non-bip notifications.
  const attentionCount =
    unreadNonBipEvents + (bipsReady ? Math.max(pendingBips, unreadBipEvents) : unreadBipEvents);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useAuth();
  const displayName = useIdentity((state) => state.displayName);
  const displayNameOwnerId = useIdentity((state) => state.displayNameOwnerId);
  const visibleDisplayName = user && displayNameOwnerId === user.id ? displayName : undefined;
  const avatarInitials = visibleDisplayName
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toLocaleUpperCase();

  return (
    <>
      <header
        className="sticky top-0 z-30 border-b border-border/30 bg-background/80 backdrop-blur-xl transition-[background-color,border-color]"
        style={{ paddingTop: "var(--safe-top)" }}
      >
        <div
          className="mx-auto flex h-14 w-full max-w-screen-md items-center justify-between"
          style={{
            paddingLeft: "calc(0.75rem + var(--safe-left))",
            paddingRight: "calc(0.75rem + var(--safe-right))",
            paddingInline: "calc(0.75rem + var(--safe-left)) calc(0.75rem + var(--safe-right))",
          }}
        >
          <Link
            to="/"
            onClick={() => haptic.tap()}
            aria-label={t("nav.home")}
            className="native-press flex h-11 w-11 items-center justify-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <img
              src="/icon-192.svg"
              alt=""
              aria-hidden="true"
              className="h-8 w-8 rounded-xl shadow-sm"
            />
          </Link>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onOpenCommunication}
              aria-label={
                attentionCount > 0
                  ? `${t("communication.open")} (${attentionCount})`
                  : t("communication.open")
              }
              className="relative h-12 w-12 rounded-full"
            >
              <Bell aria-hidden className="!size-6" />
              {attentionCount > 0 ? (
                <span
                  className="absolute right-1 top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground"
                  aria-hidden="true"
                >
                  {attentionCount > 99 ? "99+" : attentionCount}
                </span>
              ) : null}
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
