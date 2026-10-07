let registrationScheduled = false;

export function registerServiceWorker(): void {
  if (\n    registrationScheduled ||\n    typeof window === "undefined" ||\n    !("serviceWorker" in navigator)\n  ) {\n    return;\n  }
  registrationScheduled = true;

  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js", { scope: "/" });
  });
}
