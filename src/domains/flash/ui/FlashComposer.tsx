import { useMemo, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { parseFlashIntent } from "@eco/core-logic";
import type { UserId } from "@eco/core-contracts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Surface } from "@/components/app/Surface";
import { Indicator } from "@/components/app/Indicator";
import { useI18n } from "@/lib/i18n/useI18n";
import { useAuth } from "@/domains/auth";
import { createFlash } from "../data";

/**
 * FlashComposer — the person writes an intention in natural language;
 * Vita's parser pre-fills kind, category and lifetime (shown as chips).
 * The write goes to the local database only; the sync worker publishes
 * it to the backend when the network is available.
 */
export function FlashComposer() {
  const { t } = useI18n();
  const { user, loading } = useAuth();
  const [text, setText] = useState("");
  const [published, setPublished] = useState(false);
  const [pending, setPending] = useState(false);

  const intent = useMemo(
    () => (text.trim().length >= 3 ? parseFlashIntent(text) : null),
    [text],
  );

  async function submit(event: FormEvent) {
    event.preventDefault();
    const value = text.trim();
    if (!value || !intent || !user || pending) return;
    setPending(true);
    try {
      await createFlash({
        authorId: user.id as UserId,
        title: value.length > 80 ? `${value.slice(0, 77)}…` : value,
        body: value,
        kind: intent.kind,
        category: intent.category,
        timeSlot: intent.timeSlot,
        expiresAt: intent.expiresAt,
      });
      setText("");
      setPublished(true);
      window.setTimeout(() => setPublished(false), 4000);
    } finally {
      setPending(false);
    }
  }

  if (!loading && !user) {
    return (
      <Surface variant="sunken" padding="lg" bordered>
        <p className="text-sm text-muted-foreground">{t("flash.composer.signIn")}</p>
        <Button asChild className="mt-3 w-full">
          <Link to="/auth">{t("auth.signIn")}</Link>
        </Button>
      </Surface>
    );
  }

  return (
    <Surface variant="sunken" padding="lg" bordered>
      <form onSubmit={submit} className="stack-3">
        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={600}
          rows={3}
          placeholder={t("flash.composer.placeholder")}
          aria-label={t("flash.composer.placeholder")}
        />

        {intent ? (
          <div className="flex flex-wrap items-center gap-2" aria-live="polite">
            <span className="text-xs text-muted-foreground">
              {t("flash.composer.understood")}
            </span>
            <Indicator tone="primary" label={t(`flash.kind.${intent.kind}`)} />
            <Indicator tone="info" label={t(`flash.category.${intent.category}`)} />
            <Indicator tone="warning" label={t(`flash.slot.${intent.timeSlot}`)} />
          </div>
        ) : null}

        {published ? (
          <p className="text-xs text-primary" role="status">
            {t("flash.composer.published")}
          </p>
        ) : null}

        <Button type="submit" disabled={!intent || pending} className="w-full">
          <Send aria-hidden className="size-4" />
          {t("flash.composer.publish")}
        </Button>
      </form>
    </Surface>
  );
}
