import { lazy, Suspense, useState } from "react";
import { Compass } from "lucide-react";
import { FloatingButton } from "@/components/app/FloatingButton";
import { Sheet } from "@/components/app/Sheet";
import { Icon } from "@/components/app/Icon";
import { useI18n } from "@/lib/i18n/useI18n";

const AssistantTab = lazy(() =>
  import("@/domains/assistant/ui/AssistantTab").then((module) => ({
    default: module.AssistantTab,
  })),
);

/** AILayer — global entry point to Vita, the in-app guide. */
export function AILayer() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <FloatingButton
        icon={<Icon as={Compass} size="lg" />}
        label={t("assistant.cta")}
        position="bottom-right"
        size="md"
        onClick={() => setOpen(true)}
      />
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title={t("assistant.cta")}
        description={t("app.tagline")}
      >
        {open ? (
          <Suspense
            fallback={
              <p role="status" className="py-8 text-center text-sm text-muted-foreground">
                {t("app.loading")}
              </p>
            }
          >
            <AssistantTab />
          </Suspense>
        ) : null}
      </Sheet>
    </>
  );
}
