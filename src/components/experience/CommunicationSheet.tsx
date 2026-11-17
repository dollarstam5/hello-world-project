import { lazy, Suspense } from "react";
import { Sheet } from "@/components/app/Sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n/useI18n";
import { useAssistantPreferences } from "@/lib/app/assistant-preferences";
import { useReelActivityProjection } from "@/domains/presence/model/reel-activity-projection";

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
  const { t } = useI18n();
  const assistantEnabled = useAssistantPreferences((state) => state.enabled);
  const pendingBips = useReelActivityProjection((state) => state.pendingBips);
  const activeConnections = useReelActivityProjection((state) => state.activeConnections);
  const bipsReady = useReelActivityProjection((state) => state.bipsReady);
  const connectionsReady = useReelActivityProjection((state) => state.connectionsReady);
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={t("communication.title")}
      className="max-h-[92dvh]"
    >
      <Tabs defaultValue="notifications">
        <TabsList
          aria-label={t("communication.title")}
          className={`grid w-full ${assistantEnabled ? "grid-cols-4" : "grid-cols-3"}`}
        >
          <TabsTrigger
            className="min-w-0 whitespace-normal px-1 text-xs leading-tight sm:text-sm"
            value="notifications"
          >
            {t("communication.notifications")}
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
          >
            {t("communication.reel")}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="notifications"
          className="py-8 text-center text-sm text-muted-foreground"
        >
          <p role="status" aria-live="polite">
            {t("communication.notifications.empty")}
          </p>
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
            <p className="text-center">{t("communication.reel.empty")}</p>
          )}
        </TabsContent>
      </Tabs>
    </Sheet>
  );
}
