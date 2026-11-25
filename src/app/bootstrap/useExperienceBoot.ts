import { useEffect } from "react";
import { initTheme } from "@/lib/app/theme";
import { initI18n } from "@/platform/internationalization/useI18n";
import { useOnboarding } from "@/features/onboarding";

/** Initialise les fondations de l'expérience avant l'affichage du parcours. */
export function useExperienceBoot() {
  const hydrate = useOnboarding((state) => state.hydrate);

  useEffect(() => {
    initTheme();
    initI18n();
    hydrate();
  }, [hydrate]);
}
