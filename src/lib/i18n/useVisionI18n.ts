import { useCallback } from "react";
import { useI18nStore } from "./useI18n";
import { getVisionMessage, type VisionMessageKey } from "./vision-messages";

/** Keeps the long-form Vision translations in the lazy route chunk. */
export function useVisionI18n() {
  const locale = useI18nStore((state) => state.locale);
  const t = useCallback(
    (key: VisionMessageKey): string => getVisionMessage(locale, key),
    [locale]);
  return { locale, t };
}
