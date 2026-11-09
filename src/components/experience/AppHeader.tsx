import { Link } from "@tanstack/react-router";
import { Bell, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/useI18n";

export function AppHeader({ onOpenCommunication }: { onOpenCommunication: () => void }) {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-30 bg-transparent">
      <div className="mx-auto flex h-14 w-full max-w-screen-md items-center justify-between px-3 sm:px-4">
        <Link
          to="/"
          aria-label={t("nav.home")}
          className="flex h-12 w-12 items-center justify-center rounded-xl outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <img src="/icon-192.svg" alt="" aria-hidden="true" className="h-9 w-9 rounded-xl" />
        </Link>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onOpenCommunication}
            aria-label={t("communication.open")}
            className="h-12 w-12 rounded-full"
          >
            <Bell aria-hidden className="h-5 w-5" />
          </Button>

          <Button asChild variant="ghost" size="icon" className="h-12 w-12 rounded-full">
            <Link to="/espace" aria-label={t("menu.espace.open")}>
              <UserRound aria-hidden className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
