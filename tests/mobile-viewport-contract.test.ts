import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import rootRoute from "../src/routes/__root.tsx?raw";
import manifestSource from "../public/manifest.webmanifest?raw";
import { renderErrorPage } from "../src/lib/error-page";

const readSource = (path: string) =>
  readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");
const styles = readSource("../src/styles.css");
const reelCss = readSource("../src/domains/presence/ui/reel-proximity.css");
const serviceWorker = readSource("../public/sw.js");
const offlinePage = readSource("../public/offline.html");

describe("installed PWA viewport contract", () => {
  it("uses dynamic viewport height with a legacy viewport fallback", () => {
    expect(styles).toContain("height: 100vh;\n  height: 100dvh;");
    expect(styles).toContain("min-height: 100vh;\n  min-height: 100dvh;");
    expect(styles).toContain("@supports not (color: oklch(0 0 0))");
    expect(styles).toContain("@supports not (padding-inline: 1px)");
    expect(rootRoute).not.toContain("min-h-screen");
    expect(rootRoute).toContain("min-h-dvh-full");
  });

  it("keeps the Réel screen sized to the dynamic visible viewport", () => {
    expect(reelCss).toContain(
      "min-height: calc(100dvh - var(--safe-top) - var(--safe-bottom));",
    );
    expect(reelCss).toContain(
      "min-height: calc(100vh - var(--safe-top) - var(--safe-bottom));",
    );
  });

  it("declares standalone installation and edge-to-edge viewport support", () => {
    const manifest = JSON.parse(manifestSource) as { display: string };
    expect(manifest.display).toBe("standalone");
    expect(rootRoute).toContain("viewport-fit=cover");
  });

  it("provides every static resource required to install the offline shell", () => {
    expect(serviceWorker).toContain('const OFFLINE_URL = "/offline.html";');
    expect(serviceWorker).toContain('const VERSION = "vitalis-v5";');
    expect(offlinePage).toContain("Vous êtes momentanément hors connexion");
    expect(offlinePage).toContain('href="/"');
  });

  it("uses the dynamic viewport on the standalone error fallback too", () => {
    const html = renderErrorPage();
    expect(html).toContain("viewport-fit=cover");
    expect(html).toContain("min-height: 100vh; min-height: 100dvh;");
    expect(html).toContain("safe-area-inset-bottom");
  });
});
