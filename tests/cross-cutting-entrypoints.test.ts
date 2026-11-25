import { describe, expect, it } from "vitest";
import sharedUiIndex from "../src/shared/ui/index.ts?raw";
import legacyButton from "../src/components/ui/button.tsx?raw";
import legacyDialog from "../src/components/ui/dialog.tsx?raw";
import componentsConfig from "../components.json?raw";
import featureIndex from "../src/features/index.ts?raw";
import communicationIndex from "../src/features/communication/index.ts?raw";
import communicationFacade from "../src/lib/communication/CommunicationRuntimeProvider.tsx?raw";
import onboardingIndex from "../src/features/onboarding/index.ts?raw";
import onboardingFacade from "../src/lib/experience/onboarding.ts?raw";
import discoveryIndex from "../src/features/discovery/index.ts?raw";
import discoveryFacade from "../src/lib/experience/discovery.ts?raw";
import offlineIndex from "../src/platform/offline/index.ts?raw";
import syncIndicator from "../src/platform/offline/SyncIndicator.tsx?raw";
import syncFacade from "../src/shared/components/SyncIndicator.tsx?raw";
import modalSource from "../src/shared/components/Modal.tsx?raw";
import sheetSource from "../src/shared/components/Sheet.tsx?raw";
import skeletonsSource from "../src/shared/components/Skeletons.tsx?raw";
import modulesIndex from "../src/modules/index.ts?raw";

describe("cross-cutting canonical entrypoints", () => {
  it("makes shared/ui canonical and keeps components/ui compatibility facades", () => {
    expect(sharedUiIndex).toContain('from "./button"');
    expect(sharedUiIndex).toContain('from "./sheet"');
    expect(legacyButton).toContain('@/shared/ui/button');
    expect(legacyDialog).toContain('@/shared/ui/dialog');
    expect(componentsConfig).toContain('"ui": "@/shared/ui"');
  });

  it("exposes communication, onboarding and discovery through feature entrypoints", () => {
    expect(featureIndex).toContain('export * as communication from "./communication"');
    expect(featureIndex).toContain('export * as onboarding from "./onboarding"');
    expect(featureIndex).toContain('export * as presence from "./presence"');
    expect(communicationIndex).toContain('from "./CommunicationRuntimeProvider"');
    expect(communicationFacade).toContain('@/features/communication');
    expect(onboardingIndex).toContain('./model/onboarding');
    expect(onboardingFacade).toContain('@/features/onboarding');
    expect(discoveryIndex).toContain('./model/discovery-registry');
    expect(discoveryFacade).toContain('@/features/discovery');
  });

  it("owns sync presentation in the offline platform layer", () => {
    expect(offlineIndex).toContain('export { SyncIndicator } from "./SyncIndicator"');
    expect(syncIndicator).toContain('from "./sync-status"');
    expect(syncFacade).toContain('@/platform/offline/SyncIndicator');
  });

  it("keeps shared composed components independent of legacy UI paths", () => {
    expect(modalSource).toContain('@/shared/ui/dialog');
    expect(sheetSource).toContain('@/shared/ui/sheet');
    expect(skeletonsSource).toContain('@/shared/ui/skeleton');
    expect(modalSource).not.toContain('@/components/ui/');
    expect(sheetSource).not.toContain('@/components/ui/');
    expect(skeletonsSource).not.toContain('@/components/ui/');
  });

  it("retains public entrypoints for the autonomous modules", () => {
    expect(modulesIndex).toContain('export * as auth from "./auth"');
    expect(modulesIndex).toContain('export * as profile from "./profile"');
    expect(modulesIndex).toContain('export * as flash from "./flash"');
    expect(modulesIndex).toContain('export * as scan from "./scan"');
    expect(modulesIndex).toContain('export * as radar from "./radar"');
    expect(modulesIndex).toContain('export * as reel from "./reel"');
  });
});
