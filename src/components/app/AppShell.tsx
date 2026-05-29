import { useEffect, type ReactNode } from "react";
import { initTheme } from "@/lib/app/theme";
import { initI18n } from "@/lib/i18n/useI18n";

/**
 * AppShell — the single mount-point that boots foundation services
 * (theme, i18n, ...) and provides the calm, breathing canvas every
 * page renders into. Navigation, headers, and bottom-bar are NOT
 * defined here yet — that lands in a later phase.
 */
export function AppShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    initTheme();
    initI18n();
  }, []);

  return (
    <div className="relative min-h-dvh bg-background text-foreground antialiased">
      <main className="mx-auto w-full max-w-screen-md">{children}</main>
    </div>
  );
}
