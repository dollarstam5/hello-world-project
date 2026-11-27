// Compatibility entrypoint: keep one canonical PWA implementation.
export { registerServiceWorker, useInstallPrompt } from "./pwa/install";
export { canApplyUpdate, useAppUpdate } from "./pwa/update";
