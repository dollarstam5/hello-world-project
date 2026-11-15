import { describe, expect, it } from "vitest";
import styles from "../src/styles.css?raw";
import rootRoute from "../src/routes/__root.tsx?raw";
import manifestSource from "../public/manifest.webmanifest?raw";
import { renderErrorPage } from "../src/lib/error-page";

describe("installed PWA viewport contract", () => {
  it("uses dynamic viewport height with a legacy viewport fallback", () => {
    expect(styles).toContain("height: 100vh;\n  height: 100dvh;");
    expect(styles).toContain("min-height: 100vh;\n  min-height: 100dvh;");
    expect(rootRoute).not.toContain("min-h-screen");
    expect(rootRoute).toContain("min-h-dvh-full");
  });

  it("keeps the Réel screen sized to the dynamic visible viewport", async () => {
    const reelCss = await import("../src/domains/presence/ui/reel-proximity.css?raw");
    expect(reelCss.default).toContain(
      "min-height: calc(100dvh - var(--safe-top) - var(--safe-bottom));",
    );
  });

  it("declares standalone installation and edge-to-edge viewport support", () => {
    const manifest = JSON.parse(manifestSource) as { display: string };
    expect(manifest.display).toBe("standalone");
    expect(rootRoute).toContain("viewport-fit=cover");
  });

  it("uses the dynamic viewport on the standalone error fallback too", () => {
    const html = renderErrorPage();
    expect(html).toContain("viewport-fit=cover");
    expect(html).toContain("min-height: 100vh; min-height: 100dvh;");
    expect(html).toContain("safe-area-inset-bottom");
  });
});
