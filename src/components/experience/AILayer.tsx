import { Sparkles } from "lucide-react";
import { useState } from "react";
import { FloatingButton } from "@/components/app/FloatingButton";
import { Sheet } from "@/components/app/Sheet";
import { AIBubble } from "@/components/app/AIBubble";
import { Icon } from "@/components/app/Icon";
import { useI18n } from "@/lib/i18n/useI18n";

/**
 * AILayer — global, ambient AI placeholder.
 * Floating action opens a calm sheet with a single greeting bubble.
 * Real provider wiring (mockProvider → live) lands in a later phase;
 * the surface stays the same.
 */
export function AILayer() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <FloatingButton
        icon={<Icon as={Sparkles} size="lg" />}
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
        <div className="space-y-3 pt-2">
          <AIBubble author="assistant">{t("assistant.greeting")}</AIBubble>
          <div className="pt-2 text-center text-xs text-muted-foreground">
            {t("common.soon")}
          </div>
        </div>
      </Sheet>
    </>
  );
}
