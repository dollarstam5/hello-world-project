import { ArrowLeft, Bot, Languages, Monitor, Moon, Sun } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Surface } from "@/components/app/Surface";
import { Button } from "@/components/ui/button";
import type { MessageKey } from "@/lib/i18n/messages";
import { useI18n } from "@/lib/i18n/useI18n";
import { useThemeStore, type ThemeMode } from "@/lib/app/theme";
import { useAssistantPreferences } from "@/lib/app/assistant-preferences";
import { publishAssistantWelcome } from "@/lib/app/assistant-notices";

const themeOptions: { value: ThemeMode; icon: typeof Moon; key: MessageKey }[] = [
  { value: "dark", icon: Moon, key: "settings.theme.dark" },
  { value: "light", icon: Sun, key: "settings.theme.light" },
  { value: "system", icon: Monitor, key: "settings.theme.system" },
];

export function ApplicationSettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const assistantEnabled = useAssistantPreferences((state) => state.enabled);
  const setAssistantEnabled = useAssistantPreferences((state) => state.setEnabled);

  return (
    <div className="page-shell stack-6">
      <header className="stack-2">
        <Button asChild variant="ghost" className="-ml-3 w-fit">
          <Link to="/espace">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
            {t("space.back")}
          </Link>
        </Button>
        <p className="text-sm font-medium text-primary">{t("space.title")}</p>
        <h1 className="text-fluid-display-sm">{t("settings.title")}</h1>
        <p className="text-subtitle">{t("settings.desc")}</p>
      </header>

      <section className="stack-3">
        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="text-base font-semibold">{t("settings.language.title")}</h2>
        </div>
        <Surface variant="elevated" padding="md" bordered>
          <p className="text-sm text-muted-foreground">{t("settings.language.desc")}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(["fr", "en"] as const).map((value) => (
              <Button
                key={value}
                type="button"
                variant={locale === value ? "default" : "outline"}
                className="h-11"
                aria-pressed={locale === value}
                onClick={() => setLocale(value)}
              >
                {value === "fr" ? "Français" : "English"}
              </Button>
            ))}
          </div>
        </Surface>
      </section>

      <section className="stack-3">
        <div className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="text-base font-semibold">{t("settings.theme.title")}</h2>
        </div>
        <Surface variant="elevated" padding="md" bordered>
          <p className="text-sm text-muted-foreground">{t("settings.theme.desc")}</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;

              return (
                <Button
                  key={option.value}
                  type="button"
                  variant={mode === option.value ? "default" : "outline"}
                  className="h-11 justify-start"
                  aria-pressed={mode === option.value}
                  onClick={() => setMode(option.value)}
                >
                  <Icon className="mr-2 h-4 w-4" aria-hidden />
                  {t(option.key)}
                </Button>
              );
            })}
          </div>
        </Surface>
      </section>

      <section className="stack-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="text-base font-semibold">{t("settings.assistant.title")}</h2>
        </div>
        <Surface variant="elevated" padding="md" bordered>
          <p className="text-sm text-muted-foreground">{t("settings.assistant.desc")}</p>
          <Button
            type="button"
            variant={assistantEnabled ? "default" : "outline"}
            className="mt-3 w-full justify-between"
            aria-pressed={assistantEnabled}
            onClick={() => {
              const nextEnabled = !assistantEnabled;
              setAssistantEnabled(nextEnabled);
              if (nextEnabled) publishAssistantWelcome();
            }}
          >
            <span>{assistantEnabled ? t("settings.assistant.turnOff") : t("settings.assistant.turnOn")}</span>
            <span className="text-xs">{assistantEnabled ? t("settings.assistant.enabled") : t("settings.assistant.disabled")}</span>
          </Button>
        </Surface>
      </section>

      <Surface variant="sunken" padding="md" bordered>
        <p className="font-medium">{t("settings.more.title")}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {t("settings.more.desc")}
        </p>
      </Surface>
    </div>
  );
}
