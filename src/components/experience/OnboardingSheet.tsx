import { useNavigate } from "@tanstack/react-router";
import { Sheet } from "@/components/app/Sheet";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/lib/experience/onboarding";
import { useI18n } from "@/lib/i18n/useI18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

/**
 * First-run onboarding is a required step before the explanatory Home.
 * The existing onboarding state remains local to the device.
 */
export function OnboardingSheet() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const shouldShow = useOnboarding((s) => s.shouldShow);
  const hydrated = useOnboarding((s) => s.hydrated);
  const markCompleted = useOnboarding((s) => s.markCompleted);

  if (!hydrated) return null;

  return (
    <Sheet
      open={shouldShow}
      onOpenChange={() => undefined}
      showCloseButton={false}
      title={t("onboarding.title")}
      description={t("onboarding.desc")}
    >
      <div className="space-y-4 pt-2">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <ol className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary text-xs font-medium">
              1
            </span>
            <span>{t("home.section.flash")}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary text-xs font-medium">
              2
            </span>
            <span>{t("home.section.radar")}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary text-xs font-medium">
              3
            </span>
            <span>{t("home.section.discovery")}</span>
          </li>
        </ol>
        <div className="flex justify-end pt-2">
          <Button
            onClick={() => {
              markCompleted();
              void navigate({ to: "/" });
            }}
          >
            {t("onboarding.start")}
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
