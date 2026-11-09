// Compatibility entrypoint: keep one canonical PWA implementation.
export { registerServiceWorker, useInstallPrompt } from "./pwa/install";
export { useAppUpdate } from "./pwa/update";
