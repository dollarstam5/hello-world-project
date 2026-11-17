import { useEffect, useMemo, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssistantPreferences } from "@/lib/app/assistant-preferences";
import { useAssistantNotices } from "@/lib/app/assistant-notices";
import { useI18n } from "@/lib/i18n/useI18n";
import { createCommunicationRuntime } from "@/lib/communication/runtime";

/** Appears only while an explicitly published assistant message is available. */
export function AssistantNoticeLayer() {
  const { t } = useI18n();
  const enabled = useAssistantPreferences((state) => state.enabled);
  const notice = useAssistantNotices((state) => state.notice);
  const dismiss = useAssistantNotices((state) => state.dismiss);\n  const runtimeRef = useRef(createCommunicationRuntime());\n  const translateRef = useRef(t);\n  translateRef.current = t;\n  const runtime = runtimeRef.current;\n  const prepared = useMemo(() => {\n    if (!notice) return null;\n    return runtime.prepare(translateRef.current, [\n      { key: notice.message, priority: "normal", repeatKey: `assistant-notice:${notice.id}` },\n    ]);\n  }, [notice, runtime]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(dismiss, 9000);
    return () => window.clearTimeout(timeout);
  }, [notice, dismiss]);

  if (!enabled || !notice) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-3 z-[70] flex justify-center"
      style={{ top: "calc(var(--safe-top) + 0.75rem)" }}
    >
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border border-border bg-background/95 px-4 py-3 text-sm text-foreground shadow-xl backdrop-blur"
      >
        <p className="min-w-0 flex-1 leading-relaxed">
          {prepared?.messages[0]?.text ?? ""}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="-mr-2 -mt-1 h-8 w-8 shrink-0"
          onClick={dismiss}
          aria-label={t("common.close")}
        >
          <X className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
