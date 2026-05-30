import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/useI18n";
import { useNetworkStatus } from "@/lib/platform/useNetworkStatus";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Écosystème — Vivant, calme, intelligent" },
      {
        name: "description",
        content:
          "Un écosystème vivant qui relie les personnes, les talents et les opportunités, avec calme et intelligence.",
      },
      { property: "og:title", content: "Écosystème — Vivant, calme, intelligent" },
      { property: "og:description", content: "Foundation core — Phase 2." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  const net = useNetworkStatus();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
      <div
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface px-3 py-1 text-xs text-muted-foreground"
        suppressHydrationWarning
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${mounted && net.online ? "bg-success" : "bg-muted-foreground"}`}
          aria-hidden
        />
        {mounted ? (net.online ? t("app.online") : t("app.offline")) : "\u00a0"}
      </div>
      <h1 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
        {t("app.name")}
      </h1>
      <p className="mt-3 max-w-sm text-balance text-sm text-muted-foreground">
        {t("app.tagline")}
      </p>
      <p className="mt-10 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
        Phase 2 · Navigation Foundation
      </p>
    </section>
  );
}
