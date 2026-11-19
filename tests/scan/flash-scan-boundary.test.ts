import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

describe("Flash and Scan engine boundaries", () => {
  it("Flash feed uses its own API entry, not Scan API", () => {
    const flashFeed = read("src/domains/flash/hooks/useFlashFeed.ts");
    expect(flashFeed).toContain("../api/flash.functions");
    expect(flashFeed).not.toContain("@/domains/scan/api/scan.functions");
  });

  it("Flash and Scan server entries use neutral shared discovery", () => {
    const flashServer = read("src/domains/flash/api/flash.server.ts");
    const scanServer = read("src/domains/scan/api/scan.server.ts");
    const sharedService = read("src/services/public-flash-discovery.server.ts");
    expect(flashServer).toContain("@/services/public-flash-discovery.server");
    expect(scanServer).toContain("@/services/public-flash-discovery.server");
    expect(sharedService).toContain(' "scan_public_flashes"');
  });

  it("keeps Scan UI file unchanged as a presentation boundary", () => {
    const scanPanel = read("src/domains/scan/ui/ScanPanel.tsx");
    expect(scanPanel).toContain("export function ScanPanel()");
    expect(scanPanel).toContain("SCAN_RADII_KM");
  });
});
