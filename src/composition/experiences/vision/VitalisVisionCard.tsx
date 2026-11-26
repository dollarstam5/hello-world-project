import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Compass } from "lucide-react";
import { useI18n } from "@/platform/internationalization/useI18n";

/** A consistent doorway to the complete, honest explanation of Vitalis. */
export function VitalisVisionCard() {
  const { t } = useI18n();

  return (
    <Link
      to="/vision"
      className="group block rounded-[1.75rem] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <article className="relative isolate overflow-hidden rounded-[1.75rem] border border-primary/20 bg-gradient-to-br from-primary/12 via-card to-card p-5 shadow-sm transition-colors group-hover:border-primary/40 sm:p-7">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/15">
            <Compass className="size-6" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {t("vision.card.eyebrow")}
            </p>
            <h2 className="mt-1 text-lg font-bold tracking-tight sm:text-xl">
              {t("vision.card.title")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t("vision.card.description")}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              {t("vision.card.action")}
              <ArrowUpRight
                className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
