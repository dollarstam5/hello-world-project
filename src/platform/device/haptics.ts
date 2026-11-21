export const hapticFeedback = {
  tap: () => {
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
    try {
      navigator.vibrate(12);
    } catch {
      // Haptics are optional and must never interrupt the interaction.
    }
  },
  pulse: () => {
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
    try {
      navigator.vibrate([35, 40, 35]);
    } catch {
      // Haptics are optional and must never interrupt the interaction.
    }
  },
};
