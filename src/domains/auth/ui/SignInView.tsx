import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Languages, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/useI18n";
import { useThemeStore } from "@/lib/app/theme";
import { authService } from "../services/auth.service";

type Mode = "signIn" | "signUp" | "forgot";

/** Sign-in / sign-up / password-reset doorway. Public route: no gate, no redirect loop. */
export function SignInView() {
  const { t, locale, setLocale } = useI18n();
  const navigate = useNavigate();
  const { mode: themeMode, setMode } = useThemeStore();
  const isDark =
    themeMode === "dark" ||
    (themeMode === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [mode, setAuthMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "status">("status");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    try {
      if (mode === "forgot") {
        const { error } = await authService.requestPasswordReset(email);
        setMessageType(error ? "error" : "status");
        setMessage(error ? error.message : t("auth.resetSent"));
        return;
      }

      const result =
        mode === "signIn"
          ? await authService.signIn(email, password)
          : await authService.signUp(email, password);

      if (result.error) {
        setMessageType("error");
        setMessage(result.error.message);
        return;
      }
      if (result.data.session) {
        void navigate({ to: "/" });
        return;
      }
      setMessageType("status");
      setMessage(t("auth.checkEmail"));
    } catch {
      setMessageType("error");
      setMessage(t("auth.error.generic"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative grid min-h-dvh place-items-center bg-background px-4 py-16">
      <div className="absolute right-4 top-4 flex items-center gap-1">
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
      </div>

      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t(mode === "forgot" ? "auth.forgotTitle" : "auth.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(mode === "forgot" ? "auth.forgotSubtitle" : "auth.subtitle")}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <label className="block text-sm">
            <span className="text-muted-foreground">{t("auth.email")}</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-xl border border-border/60 bg-card/40 px-3 py-2 outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          {mode !== "forgot" ? (
            <label className="block text-sm">
              <span className="text-muted-foreground">{t("auth.password")}</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete={mode === "signIn" ? "current-password" : "new-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 min-h-11 w-full rounded-xl border border-border/60 bg-card/40 px-3 py-2 outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
          ) : null}

          <Button type="submit" disabled={busy} className="min-h-11 w-full">
            {busy
              ? t("app.loading")
              : t(
                  mode === "signIn"
                    ? "auth.signIn"
                    : mode === "signUp"
                      ? "auth.signUp"
                      : "auth.sendReset",
                )}
          </Button>
        </form>

        {message ? (
          <p
            className="mt-3 text-sm text-muted-foreground"
            role={messageType === "error" ? "alert" : "status"}
          >
            {message}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col items-center gap-2 text-sm">
          {mode === "signIn" ? (
            <button
              type="button"
              onClick={() => {
                setAuthMode("forgot");
                setMessage(null);
              }}
              className="min-h-11 rounded-md px-3 text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("auth.forgot")}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setAuthMode(mode === "signIn" ? "signUp" : "signIn");
              setMessage(null);
            }}
            className="min-h-11 rounded-md px-3 text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t(mode === "signIn" ? "auth.toSignUp" : "auth.toSignIn")}
          </button>
        </div>
      </div>
    </div>
  );
}
