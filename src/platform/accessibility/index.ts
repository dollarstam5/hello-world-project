/** Accessibility preferences and shared reduced-motion behavior. */
export { useReducedMotion } from "@/shared/animations/useReducedMotion";

export interface A11yPreferences {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
}

export const defaultA11yPreferences: A11yPreferences = {
  reduceMotion: false,
  highContrast: false,
  largeText: false,
};
