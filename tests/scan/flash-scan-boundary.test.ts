import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

describe("Flash and Scan engine boundaries", () => {
  it("Flash feed uses its own API entry, not Scan API", () => {
    const flashFeed = read("src/modules/flash/hooks/useFlashFeed.ts");
    expect(flashFeed).toContain("../api/flash.functions");
    expect(flashFeed).not.toContain("@/domains/scan/api/scan.functions");
  });

  it("Flash and Scan server entries use neutral shared discovery", () => {
    const flashServer = read("src/modules/flash/api/flash.server.ts");
    const scanServer = read("src/domains/scan/api/scan.server.ts");
    const sharedService = read("src/services/public-flash-discovery.server.ts");
    expect(flashServer).toContain("@/services/public-flash-discovery.server");
    expect(scanServer).toContain("@/services/public-flash-discovery.server");
    expect(sharedService).toContain(' "scan_public_flashes"');
  });

  it("keeps Scan presentation separate from its preferences state", () => {
    const scanPanel = read("src/domains/scan/ui/ScanPanel.tsx");
    const scanPreferences = read("src/domains/scan/hooks/useScanPreferences.ts");

    expect(scanPanel).toContain("export function ScanPanel()");
    expect(scanPanel).toContain("useScanFlow");
    expect(scanPreferences).toContain("const SCAN_RADII_KM");
    expect(scanPreferences).toContain("availableRadii: SCAN_RADII_KM");
  });
});
