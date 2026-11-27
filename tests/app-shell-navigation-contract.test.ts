// @vitest-environment node

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const appShell = readFileSync(
  fileURLToPath(new URL("../src/components/app/AppShell.tsx", import.meta.url)),
  "utf8",
);

describe("AppShell route state contract", () => {
  it("does not force-remount the route subtree when the pathname changes", () => {
    expect(appShell).not.toContain("<div key={pathname}");
    expect(appShell).toContain("<main");
    expect(appShell).toContain("{children}");
  });

  it("still closes the global menu after navigation", () => {
    expect(appShell).toContain("useEffect(() => {\n    setMenuOpen(false);\n  }, [pathname]);");
  });
});
