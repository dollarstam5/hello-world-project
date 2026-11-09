import { useI18n } from "@/lib/i18n/useI18n";
import { locales } from "@/lib/i18n/messages";

/** Compact, always-visible language control for the first screen and app shell. */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("app.language")}
      className="inline-flex shrink-0 items-center rounded-full border border-border-soft bg-surface p-0.5"
    >
      {locales.map((option) => (
        <button
          key={option}
          type="button"
          aria-label={t(option === "fr" ? "app.language.fr" : "app.language.en")}
          aria-pressed={locale === option}
          onClick={() => setLocale(option)}
          className={
            locale === option
              ? "min-h-10 min-w-10 rounded-full bg-primary px-2 text-xs font-semibold text-primary-foreground"
              : "min-h-10 min-w-10 rounded-full px-2 text-xs font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          }
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
