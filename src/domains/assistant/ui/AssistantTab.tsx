import { useState, type FormEvent } from "react";
import { Send, Trash2 } from "lucide-react";
import { AIBubble } from "@/components/app/AIBubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/useI18n";
import { useHybridAssistant } from "../model/useHybridAssistant";

export function AssistantTab() {
  const { t } = useI18n();
  const [question, setQuestion] = useState("");
  const { messages, pending, failure, send, reset } = useHybridAssistant();

  async function submit(event: FormEvent) {
    event.preventDefault();
    const value = question.trim();
    if (!value || pending) return;
    setQuestion("");
    await send(value);
  }

  const failureKey = failure === "offline"
    ? "assistant.error.offline"
    : failure === "auth_required"
      ? "assistant.error.auth"
      : failure === "rate_limited"
        ? "assistant.error.busy"
        : failure === "daily_limit"
          ? "assistant.error.daily"
          : failure === "unsafe_request"
            ? "assistant.error.sensitive"
            : failure
              ? "assistant.error.generic"
              : null;

  return (
    <div className="flex h-[min(68dvh,38rem)] flex-col">
      <div className="mb-2 flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
        <span>{t("assistant.privacy")}</span>
        {messages.length > 0 && (
          <Button type="button" variant="ghost" size="icon" onClick={reset} aria-label={t("assistant.reset")}>
            <Trash2 aria-hidden />
          </Button>
        )}
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto py-2" aria-live="polite">
        {messages.length === 0 && (
          <AIBubble author="assistant">{t("assistant.greeting")}</AIBubble>
        )}
        {messages.map((message) => (
          <div key={message.id} className="space-y-1">
            <AIBubble author={message.role}>{message.content}</AIBubble>
            {message.role === "assistant" && message.source && (
              <div className="pl-9 text-[11px] text-muted-foreground">
                {message.source === "gateway"
                  ? t("assistant.source.ai")
                  : t("assistant.source.instant")}
              </div>
            )}
          </div>
        ))}
        {pending && <AIBubble author="assistant" thinking>{t("assistant.thinking")}</AIBubble>}
        {failureKey && <p role="alert" className="px-2 text-sm text-destructive">{t(failureKey)}</p>}
      </div>

      <form onSubmit={submit} className="flex gap-2 border-t border-border-soft pt-3">
        <Input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={600}
          disabled={pending}
          placeholder={t("assistant.placeholder")}
          aria-label={t("assistant.placeholder")}
          autoComplete="off"
        />
        <Button type="submit" size="icon" disabled={pending || !question.trim()} aria-label={t("assistant.send")}>
          <Send aria-hidden />
        </Button>
      </form>
    </div>
  );
}
