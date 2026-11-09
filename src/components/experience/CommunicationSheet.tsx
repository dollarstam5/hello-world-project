import { lazy, Suspense } from "react";
import { Sheet } from "@/components/app/Sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n/useI18n";

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
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={t("communication.title")}
      className="max-h-[92dvh]"
    >
      <Tabs defaultValue="notifications">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger className="px-1 text-[11px] sm:text-sm" value="notifications">
            {t("communication.notifications")}
          </TabsTrigger>
          <TabsTrigger className="px-1 text-[11px] sm:text-sm" value="assistance">
            {t("communication.assistance")}
          </TabsTrigger>
          <TabsTrigger className="px-1 text-[11px] sm:text-sm" value="messages">
            {t("communication.messages")}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="notifications"
          className="py-8 text-center text-sm text-muted-foreground"
        >
          {t("communication.notifications.empty")}
        </TabsContent>
        <TabsContent value="assistance">
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
        <TabsContent
          value="messages"
          className="py-8 text-center text-sm text-muted-foreground"
        >
          {t("communication.messages.empty")}
        </TabsContent>
      </Tabs>
    </Sheet>
  );
}
