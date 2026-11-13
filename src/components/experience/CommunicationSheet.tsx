import { lazy, Suspense } from "react";
import { Sheet } from "@/components/app/Sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n/useI18n";
import { useAssistantPreferences } from "@/lib/app/assistant-preferences";

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
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={t("communication.title")}
      className="max-h-[92dvh]"
    >
      <Tabs defaultValue="notifications">
        <TabsList aria-label={t("communication.title")} className={`grid w-full ${assistantEnabled ? "grid-cols-4" : "grid-cols-3"}`}>
          <TabsTrigger
            className="min-w-0 whitespace-normal px-1 text-xs leading-tight sm:text-sm"
            value="notifications"
          >
            {t("communication.notifications")}
          </TabsTrigger>
          {assistantEnabled && <TabsTrigger
            className="min-w-0 whitespace-normal px-1 text-xs leading-tight sm:text-sm"
            value="assistant"
          >
            {t("communication.assistant")}
          </TabsTrigger>}
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
        <TabsContent value="reel" className="py-8 text-center text-sm text-muted-foreground">
          <p role="status" aria-live="polite">
            {t("communication.reel.empty")}
          </p>
        </TabsContent>
      </Tabs>
    </Sheet>
  );
}
