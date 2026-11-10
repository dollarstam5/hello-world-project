import { ArrowLeft, EyeOff, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Indicator } from "@/components/app/Indicator";
import { Surface } from "@/components/app/Surface";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/useI18n";

export function ProfileVisibilitySettingsPage() {
  const { t } = useI18n();
  return (
    <div className="page-shell stack-6">
      <header className="stack-2">
        <Button asChild variant="ghost" className="-ml-3 w-fit"><Link to="/espace"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden />{t("space.back")}</Link></Button>
        <p className="text-sm font-medium text-primary">{t("space.title")}</p>
        <h1 className="text-fluid-display-sm">{t("profile.visibility.title")}</h1>
        <p className="text-subtitle">{t("profile.visibility.desc")}</p>
      </header>
      <Surface variant="sunken" padding="lg" bordered className="stack-3">
        <div className="flex items-center gap-2"><EyeOff className="h-5 w-5 text-muted-foreground" aria-hidden /><Indicator tone="neutral" label={t("common.soon")} /></div>
        <h2 className="font-semibold">{t("profile.visibility.private.title")}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("profile.visibility.private.desc")}</p>
      </Surface>
      <Surface variant="elevated" padding="md" bordered className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <p className="text-sm leading-relaxed text-muted-foreground">{t("profile.visibility.guardrail")}</p>
      </Surface>
    </div>
  );
}
