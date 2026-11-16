import { useI18n } from "@/lib/i18n/useI18n";

const TOUR_TITLE_KEYS = ["reel.ui.tour.title1", "reel.ui.tour.title2", "reel.ui.tour.title3", "reel.ui.tour.title4"] as const;
const TOUR_DESCRIPTION_KEYS = ["reel.ui.tour.description1", "reel.ui.tour.description2", "reel.ui.tour.description3", "reel.ui.tour.description4"] as const;
const TOUR_STEP_KEYS = ["reel.ui.tour.step1", "reel.ui.tour.step2", "reel.ui.tour.step3", "reel.ui.tour.step4"] as const;

export function ReelGuidedTour({ open, step, onClose, onStepChange }: {
  open: boolean; step: number; onClose: () => void; onStepChange: (step: number) => void;
}) {
  const { t } = useI18n();
  if (!open) return null;
  return (
    <div className="reel-tour-backdrop">
      <section className="reel-tour" role="dialog" aria-modal="true" aria-labelledby="reel-tour-title" aria-describedby="reel-tour-description">
        <div className="reel-tour__topline">
          <span>{t("reel.ui.tour.eyebrow")}</span>
          <button type="button" onClick={onClose} aria-label={t("reel.ui.tour.close")}><X aria-hidden="true" /></button>
        </div>
        <div className="reel-tour__progress" aria-label={t("reel.ui.tour.progress")}>
          {[0, 1, 2, 3].map((item) => <span key={item} className={item <= step ? "is-active" : ""} />)}
        </div>
        <p className="reel-tour__step">{t(TOUR_STEP_KEYS[step])}</p>
        <h2 id="reel-tour-title">{t(TOUR_TITLE_KEYS[step])}</h2>
        <p id="reel-tour-description">{t(TOUR_DESCRIPTION_KEYS[step])}</p>
        <div className="reel-tour__actions">
          <button type="button" className="reel-tour__skip" onClick={onClose}>{t("reel.ui.tour.skip")}</button>
          <div>
            {step > 0 && <button type="button" className="reel-tour__back" onClick={() => onStepChange(step - 1)}>{t("reel.ui.tour.back")}</button>}
            <button type="button" className="reel-tour__next" onClick={() => step === 3 ? onClose() : onStepChange(step + 1)}>
              {step === 3 ? t("reel.ui.tour.finish") : t("reel.ui.tour.next")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
