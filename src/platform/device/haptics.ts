/**
 * Retours sensoriels haptiques pour mobile (PWA).
 * Silencieux et sans erreur si l'appareil ou le navigateur ne les supportent pas.
 */
export const haptic = {
  tap: () => {
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
    try { navigator.vibrate(10); } catch { /* optionnel */ }
  },
  toggle: () => {
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
    try { navigator.vibrate([15, 60, 20]); } catch { /* optionnel */ }
  },
  pulse: () => {
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
    try { navigator.vibrate([30, 40, 30]); } catch { /* optionnel */ }
  },
};
export const hapticFeedback = haptic;
