import { Link } from "@tanstack/react-router";
import { Bell, Languages, LogOut, Moon, Sun, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/useI18n";
import { signOut, useAuth } from "@/domains/auth";
import { useThemeStore } from "@/lib/app/theme";

export function AppHeader({ onOpenCommunication }: { onOpenCommunication: () => void }) {
  const { t, locale, setLocale } = useI18n();
  const { user } = useAuth();
  const { mode, setMode } = useThemeStore();
  const isDark = mode === "dark";

  return (
    <header className="sticky top-0 z-30 border-b border-border-soft bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-screen-md items-center justify-between px-3 sm:px-4">
        <Link
          to="/"
          aria-label={t("nav.home")}
          className="rounded-md text-lg font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("app.name")}
        </Link>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={t("language.switch")}
            onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
            className="min-h-11 min-w-11 px-2 text-xs font-semibold"
          >
            <Languages aria-hidden className="mr-1 h-4 w-4" />
            {locale.toUpperCase()}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t(isDark ? "theme.switchToLight" : "theme.switchToDark")}
            title={t(isDark ? "theme.switchToLight" : "theme.switchToDark")}
            onClick={() => setMode(isDark ? "light" : "dark")}
            className="h-11 w-11"
          >
            {isDark ? <Sun aria-hidden /> : <Moon aria-hidden />}
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-11 w-11">
            <Link to="/espace" aria-label={t("profile.open")}>
              <UserRound aria-hidden />
            </Link>
          </Button>
          {user ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("auth.signOut")}
              onClick={() => void signOut().then(() => window.location.assign("/"))}
              className="h-11 w-11"
            >
              <LogOut aria-hidden />
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onOpenCommunication}
            aria-label={t("communication.open")}
            className="h-11 w-11"
          >
            <Bell aria-hidden />
          </Button>
        </div>
      </div>
    </header>
  );
}
