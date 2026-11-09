import { useNavigate } from "@tanstack/react-router";
import { Sheet } from "@/components/app/Sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useOnboarding } from "@/lib/experience/onboarding";
import { useI18n } from "@/lib/i18n/useI18n";
import {
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  Languages,
  Radar,
  RadioTower,
  ScanSearch,
  Sparkles,
  Zap,
} from "lucide-react";

function EngineCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Zap;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border-soft bg-card/70 p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <div className="min-w-0 space-y-1">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

/** A short, five-step introduction to Vitalis, shown once per device. */
export function OnboardingSheet() {
  const { t, locale, setLocale } = useI18n();
  const navigate = useNavigate();
  const shouldShow = useOnboarding((state) => state.shouldShow);
  const hydrated = useOnboarding((state) => state.hydrated);
  const step = useOnboarding((state) => state.step);
  const next = useOnboarding((state) => state.next);
  const previous = useOnboarding((state) => state.previous);
  const dismiss = useOnboarding((state) => state.dismiss);
  const complete = useOnboarding((state) => state.complete);
  const handleEnter = () => {
    complete();
    void navigate({ to: "/" });
  };
  const handleSkip = () => {
    dismiss();
    void navigate({ to: "/" });
  };

  if (!hydrated) return null;

  const isLastStep = step === 4;

  return (
    <Sheet
      open={shouldShow}
      onOpenChange={(open) => !open && handleSkip()}
      title={t("onboarding.title")}
      description={t("onboarding.desc")}
      className="max-h-[88dvh] overflow-y-auto"
    >
      <div className="flex min-h-[min(64dvh,560px)] flex-col gap-6 pt-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{t("onboarding.stepLabel")}</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={t("language.switch")}
                onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
                className="min-h-12 min-w-12 px-2 text-xs font-semibold"
              >
                <Languages aria-hidden="true" className="mr-1 h-4 w-4" />
                {locale.toUpperCase()}
              </Button>
              <span aria-hidden="true">{step + 1}/5</span>
            </div>
          </div>
          <Progress value={((step + 1) / 5) * 100} aria-label={t("onboarding.progress")} />
        </div>

        <div key={step} aria-live="polite" className="flex flex-1 flex-col gap-5">
          {step === 0 && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Sparkles aria-hidden="true" className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {t("onboarding.intro.title")}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("onboarding.intro.body")}
                </p>
              </div>
              <div className="rounded-2xl border border-border-soft bg-muted/30 p-4">
                <div className="mb-2 flex items-center gap-2 font-medium">
                  <LayoutGrid aria-hidden="true" className="h-4 w-4 text-primary" />
                  {t("onboarding.intro.moreTitle")}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("onboarding.intro.moreBody")}
                </p>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {t("onboarding.discovery.title")}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("onboarding.discovery.body")}
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <EngineCard
                  icon={Zap}
                  title={t("onboarding.flash.title")}
                  description={t("onboarding.flash.body")}
                />
                <EngineCard
                  icon={ScanSearch}
                  title={t("onboarding.scan.title")}
                  description={t("onboarding.scan.body")}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {t("onboarding.connection.title")}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("onboarding.connection.body")}
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <EngineCard
                  icon={RadioTower}
                  title={t("onboarding.reel.title")}
                  description={t("onboarding.reel.body")}
                />
                <EngineCard
                  icon={Radar}
                  title={t("onboarding.radar.title")}
                  description={t("onboarding.radar.body")}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <LayoutGrid aria-hidden="true" className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {t("onboarding.spaces.title")}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("onboarding.spaces.body")}
                </p>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Sparkles aria-hidden="true" className="h-8 w-8" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {t("onboarding.ready.title")}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("onboarding.ready.body")}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">{t("onboarding.ready.guest")}</p>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border-soft pt-4">
          <div className="flex gap-2">
            {step > 0 ? (
              <Button type="button" variant="ghost" onClick={previous}>
                <ArrowLeft aria-hidden="true" />
                {t("onboarding.back")}
              </Button>
            ) : (
              <Button type="button" variant="ghost" onClick={handleSkip}>
                {t("onboarding.skip")}
              </Button>
            )}
          </div>
          {isLastStep ? (
            <Button type="button" onClick={handleEnter}>
              {t("onboarding.enter")}
              <ArrowRight aria-hidden="true" />
            </Button>
          ) : (
            <Button type="button" onClick={next}>
              {t("onboarding.next")}
              <ArrowRight aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </Sheet>
  );
}
