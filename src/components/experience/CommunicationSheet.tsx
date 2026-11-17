import { lazy, Suspense } from "react";
import { Sheet } from "@/components/app/Sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n/useI18n";
import { useAssistantPreferences } from "@/lib/app/assistant-preferences";
import { useReelActivityProjection } from "@/domains/presence/model/reel-activity-projection";
import { useCommunicationRuntime } from "@/lib/communication/CommunicationRuntimeProvider";
import { useNetworkStatus } from "@/lib/platform/useNetworkStatus";

export function getReelActivityStatusKey(
  online: boolean,
): "communication.reel.notLoaded" | "communication.reel.offline" {
  return online ? "communication.reel.notLoaded" : "communication.reel.offline";
}

const AssistantTab = lazy(() =>
  import("@/domains/assistant/ui/AssistantTab").then((module) => ({
    default: module.AssistantTab,
  })),
);

export function CommunicationSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t, locale } = useI18n();
  const { online } = useNetworkStatus();
  const communication = useCommunicationRuntime();
  const events = communication.getEvents();
  const assistantEnabled = useAssistantPreferences((state) => state.enabled);
  const pendingBips = useReelActivityProjection((state) => state.pendingBips);
  const activeConnections = useReelActivityProjection((state) => state.activeConnections);
  const bipsReady = useReelActivityProjection((state) => state.bipsReady);
  const connectionsReady = useReelActivityProjection((state) => state.connectionsReady);
  // Keep each tab's indicator tied to its owning source. Received bips belong
  // to En direct, so they are excluded from the Notifications tab count.
  const unreadNotifications = events.filter(
    (event) => event.readAt === null && event.messageKey !== "communication.event.reel.bipReceived",
  ).length;
  const liveAttention = bipsReady ? pendingBips : 0;
  const formatCount = (count: number) => (count > 99 ? "99+" : String(count));
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={t("communication.title")}
      className="max-h-[92dvh]"
    >
      {!online ? (
        <p
          className="mb-3 rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          {t("communication.offline")}
        </p>
      ) : null}
      <Tabs defaultValue="notifications">
        <TabsList
          aria-label={t("communication.title")}
          className={`grid w-full ${assistantEnabled ? "grid-cols-4" : "grid-cols-3"}`}
        >
          <TabsTrigger
            className="min-w-0 whitespace-normal px-1 text-xs leading-tight sm:text-sm"
            value="notifications"
            aria-label={
              unreadNotifications > 0
                ? `${t("communication.notifications")} (${unreadNotifications})`
                : t("communication.notifications")
            }
          >
            {t("communication.notifications")}
            {unreadNotifications > 0 ? (
              <span
                aria-hidden="true"
                className="ml-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground"
              >
                {formatCount(unreadNotifications)}
              </span>
            ) : null}
          </TabsTrigger>
          {assistantEnabled && (
            <TabsTrigger
              className="min-w-0 whitespace-normal px-1 text-xs leading-tight sm:text-sm"
              value="assistant"
            >
              {t("communication.assistant")}
            </TabsTrigger>
          )}
          <TabsTrigger
            className="min-w-0 whitespace-normal px-1 text-xs leading-tight sm:text-sm"
            value="messages"
          >
            {t("communication.messages")}
          </TabsTrigger>
          <TabsTrigger
            className="min-w-0 whitespace-normal px-1 text-xs leading-tight sm:text-sm"
            value="reel"
            aria-label={
              liveAttention > 0
                ? `${t("communication.reel")} (${liveAttention})`
                : t("communication.reel")
            }
          >
            {t("communication.reel")}
            {liveAttention > 0 ? (
              <span
                aria-hidden="true"
                className="ml-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground"
              >
                {formatCount(liveAttention)}
              </span>
            ) : null}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="notifications" className="space-y-3 py-4">
          {events.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground" role="status">
              {t("communication.events.empty")}
            </p>
          ) : (
            <ul className="space-y-2" aria-label={t("communication.notifications")}>
              {events.map((event) => (
                <li
                  key={event.id}
                  className="rounded-2xl border border-border bg-card p-4"
                  data-read={event.readAt !== null}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {t(event.titleKey)}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground">
                        {t(event.messageKey)}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat(locale, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(event.createdAt)}
                      </p>
                      <a
                        href={event.href}
                        className="mt-3 inline-flex min-h-10 items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        {t(
                          event.source === "flash"
                            ? "communication.events.openFlash"
                            : event.source === "radar"
                              ? "communication.events.openRadar"
                              : "communication.events.openReel",
                        )}
                      </a>
                    </div>
                    {event.readAt === null ? (
                      <button
                        type="button"
                        onClick={() => communication.markEventRead(event.id)}
                        className="min-h-10 shrink-0 rounded-full px-2 text-xs font-medium text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {t("communication.events.markRead")}
                      </button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
        {assistantEnabled && (
          <TabsContent value="assistant">
            <Suspense
              fallback={
                <p role="status" className="py-8 text-center text-sm text-muted-foreground">
                  {t("app.loading")}
                </p>
              }
            >
              <AssistantTab />
            </Suspense>
          </TabsContent>
        )}
        <TabsContent value="messages" className="py-8 text-center text-sm text-muted-foreground">
          <p role="status" aria-live="polite">
            {t("communication.messages.empty")}
          </p>
        </TabsContent>
        <TabsContent value="reel" className="space-y-3 py-6 text-sm text-muted-foreground">
          {bipsReady || connectionsReady ? (
            <div className="space-y-2" role="status" aria-live="polite">
              {bipsReady && (
                <p>
                  {t("communication.reel.pendingBips")}: <strong>{pendingBips}</strong>
                </p>
              )}
              {connectionsReady && (
                <p>
                  {t("communication.reel.activeConnections")}: <strong>{activeConnections}</strong>
                </p>
              )}
            </div>
          ) : (
            <p className="text-center" role="status" aria-live="polite">
              {t(getReelActivityStatusKey(online))}
            </p>
          )}
          <a
            href="/reel"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("communication.reel.open")}
          </a>
        </TabsContent>
      </Tabs>
    </Sheet>
  );
}
