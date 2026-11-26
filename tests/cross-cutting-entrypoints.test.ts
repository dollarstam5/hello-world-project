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
import flashModule from "../src/modules/flash/index.ts?raw";
import scanModule from "../src/modules/scan/index.ts?raw";
import radarModule from "../src/modules/radar/index.ts?raw";
import flashCard from "../src/modules/flash/ui/FlashCard.tsx?raw";
import legacyFlashCard from "../src/components/app/FlashCard.tsx?raw";
import publicProfilePreview from "../src/modules/flash/ui/PublicProfilePreview.tsx?raw";
import radarCard from "../src/shared/components/RadarCard.tsx?raw";
import legacyRadarCard from "../src/components/app/RadarCard.tsx?raw";
import flashRoute from "../src/routes/flash.lazy.tsx?raw";
import scanRoute from "../src/routes/scan.lazy.tsx?raw";
import radarRoute from "../src/routes/radar.lazy.tsx?raw";
import reelRoute from "../src/routes/reel.lazy.tsx?raw";
import appShell from "../src/app/shell/AppShell.tsx?raw";
import appHeader from "../src/components/experience/AppHeader.tsx?raw";
import communicationSheet from "../src/components/experience/CommunicationSheet.tsx?raw";
import homeFoundation from "../src/composition/experiences/home/HomeFoundation.tsx?raw";
import onboardingSheet from "../src/components/experience/OnboardingSheet.tsx?raw";
import personalDashboard from "../src/components/experience/PersonalDashboard.tsx?raw";
import profileRoute from "../src/routes/espace.profil.tsx?raw";
import accountRoute from "../src/routes/espace.informations.tsx?raw";

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

  it("exposes engine UI through module entrypoints and keeps route imports public", () => {
    expect(flashModule).toContain('export { FlashExperienceScreen } from "./ui/FlashExperienceScreen"');
    expect(flashModule).toContain('export { FlashCard } from "./ui/FlashCard"');
    expect(scanModule).toContain('export { ScanPanel } from "./ui/ScanPanel"');
    expect(radarModule).toContain('export { RadarManagement } from "./ui/RadarManagement"');
    expect(flashModule).not.toContain('@/components/app/');
    expect(radarModule).not.toContain('@/components/app/');
    expect(flashCard).toContain('@/shared/components/SmartCard');
    expect(flashCard).toContain('./PublicProfilePreview');
    expect(publicProfilePreview).toContain('@/shared/components/Sheet');
    expect(legacyFlashCard).toContain('@/modules/flash/ui/FlashCard');
    expect(radarCard).toContain('from "./SmartCard"');
    expect(legacyRadarCard).toContain('@/shared/components/RadarCard');
    expect(flashRoute).toContain('@/modules/flash"');
    expect(scanRoute).toContain('@/modules/scan"');
    expect(radarRoute).toContain('@/modules/radar"');
    expect(reelRoute).toContain('import("@/modules/reel")');
    expect(flashRoute).not.toContain('@/modules/flash/ui/');
    expect(scanRoute).not.toContain('@/modules/scan/ui/');
    expect(radarRoute).not.toContain('@/modules/radar/ui/');
  });

  it("uses canonical feature, platform and module entrypoints in app composition", () => {
    expect(appShell).toContain('@/features/communication/CommunicationRuntimeProvider');
    expect(appShell).toContain('@/features/onboarding');
    expect(appShell).toContain('@/platform/internationalization/useI18n');
    expect(appHeader).toContain('@/features/communication/CommunicationRuntimeProvider');
    expect(communicationSheet).toContain('@/platform/network/useNetworkStatus');
    expect(homeFoundation).toContain('@/features/communication');
    expect(onboardingSheet).toContain('@/features/onboarding');
    expect(personalDashboard).toContain('@/modules/profile');
    expect(profileRoute).toContain('@/modules/profile');
    expect(accountRoute).toContain('@/modules/auth');
    expect(profileRoute).not.toContain('@/modules/profile/ui/');
    expect(accountRoute).not.toContain('@/modules/auth/ui/');
  });
});
