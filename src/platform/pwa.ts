let registrationScheduled = false;

export function registerServiceWorker(): void {
  if (
    registrationScheduled ||
    typeof window === "undefined" ||
    !("serviceWorker" in navigator)
  ) {
    return;
  }
  registrationScheduled = true;

  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js", { scope: "/" });
  });
}
