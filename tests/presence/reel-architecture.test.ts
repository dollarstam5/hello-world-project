import { describe, expect, it } from "vitest";
import screenCompositionSource from "../../src/domains/presence/ui/ReelProximityScreen.tsx?raw";
import radarComponentsSource from "../../src/domains/presence/ui/components/ReelRadarIdentity.tsx?raw";
import guidedTourSource from "../../src/domains/presence/ui/components/ReelGuidedTour.tsx?raw";
import settingsHelpSource from "../../src/domains/presence/ui/components/ReelSettingsHelp.tsx?raw";
import profileSheetSource from "../../src/domains/presence/ui/components/ReelProfileSheet.tsx?raw";
import settingsPanelSource from "../../src/domains/presence/ui/components/ReelSettingsPanel.tsx?raw";
import activityPanelSource from "../../src/domains/presence/ui/components/ReelActivityPanel.tsx?raw";
import headerSource from "../../src/domains/presence/ui/components/ReelHeader.tsx?raw";
import discoveryPromptSource from "../../src/domains/presence/ui/components/ReelDiscoveryPrompt.tsx?raw";
import nearbyPreviewSource from "../../src/domains/presence/ui/components/ReelNearbyPreview.tsx?raw";
import globalPanelSource from "../../src/domains/presence/ui/components/ReelGlobalPanel.tsx?raw";
import peoplePanelSource from "../../src/domains/presence/ui/components/ReelPeoplePanel.tsx?raw";

import controllerSource from "../../src/domains/presence/model/useReelProximityController.ts?raw";
import realtimeServiceSource from "../../src/domains/presence/services/reel-activity-realtime.service.ts?raw";
import communicationBridgeSource from "../../src/domains/presence/model/ReelCommunicationBridge.tsx?raw";
import appShellSource from "../../src/components/app/AppShell.tsx?raw";
import memberAvatarSource from "../../src/domains/profile/api/profile-avatar.client.ts?raw";

const screenSource = `${screenCompositionSource}\n${radarComponentsSource}\n${guidedTourSource}\n${settingsHelpSource}\n${profileSheetSource}\n${settingsPanelSource}\n${activityPanelSource}\n${headerSource}\n${discoveryPromptSource}\n${nearbyPreviewSource}\n${globalPanelSource}\n${peoplePanelSource}`;

describe("En direct architecture boundaries", () => {
  it("keeps business services and access policy out of the screen component", () => {
    const screen = screenSource;
    expect(screen).not.toMatch(/from ["']@\/domains\/presence\/api\//);
    expect(screen).not.toMatch(/from ["']@\/integrations\/supabase\//);
    expect(screen).not.toMatch(/from ["']@\/domains\/presence\/policy\//);
    expect(screen).toContain("useReelProximityController");
  });

  it("keeps presentation dependencies out of the controller", () => {
    const controller = controllerSource;
    expect(controller).not.toMatch(/from ["']lucide-react["']/);
    expect(controller).not.toMatch(/from ["']\.\/.*\.css["']/);
    expect(controller).not.toMatch(/from ["']@\/domains\/presence\/ui\//);
    expect(controller).not.toMatch(/from ["']@\/integrations\/supabase\/client["']/);
    expect(controller).toContain("useCommunicationRuntime");
    expect(controller).not.toContain("subscribeToReelMemberActivity");
  });

  it("keeps private Realtime channel ownership inside its service", () => {
    const service = realtimeServiceSource;
    expect(service).toContain("config: { private: true }");
    expect(service).toContain("supabase.removeChannel(channel)");
    expect(service).toContain('channel.on("broadcast", { event: "reel_activity" }');
    expect(service).not.toContain("postgres_changes");
    expect(service).not.toContain("guest_session_id");
    expect(service).not.toContain("presence_id");
    expect(service).toContain('status === "SUBSCRIBED"');
    expect(service).toContain("onReconnect?.()");
  });

  it("mounts one app-scoped bridge and forwards only server-authored member events", () => {
    expect(appShellSource.match(/<ReelCommunicationBridge \/>/g)?.length).toBe(1);
    expect(communicationBridgeSource).toContain("subscribeToReelMemberActivity");
    expect(communicationBridgeSource).toContain("communication.publishEvent");
    expect(communicationBridgeSource).toContain('source: "reel"');
    expect(communicationBridgeSource).toContain('access.mode !== "member"');
    expect(communicationBridgeSource).not.toContain("guest_session_id");
  });

  it("keeps guest activity refresh event-driven with a low-frequency visible-only fallback", () => {
    expect(controllerSource).toContain(
      'document.addEventListener("visibilitychange", refreshWhenAvailable)',
    );
    expect(controllerSource).toContain('window.addEventListener("focus", refreshWhenAvailable)');
    expect(controllerSource).toContain('window.addEventListener("online", refreshWhenAvailable)');
    expect(controllerSource).toContain('document.visibilityState !== "visible"');
    expect(controllerSource).toContain("guestActivityRefreshInFlight.current");
    expect(controllerSource).toContain('"vitalis:reel-activity-reconnected"');
    expect(controllerSource).toContain("}, 30_000)");
    expect(controllerSource).not.toContain("}, 3000)");
    expect(controllerSource).toContain(
      'document.removeEventListener("visibilitychange", refreshWhenAvailable)',
    );
    expect(controllerSource).toContain('window.removeEventListener("focus", refreshWhenAvailable)');
    expect(controllerSource).toContain(
      'window.removeEventListener("online", refreshWhenAvailable)',
    );
  });

  it("does not couple guest presence activation to nearby discovery consent", () => {
    const controller = controllerSource;
    const start = controller.indexOf("const activateGuestPresence = async");
    const end = controller.indexOf("const stopGuestPresence = async", start);
    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);
    const guestPresenceActivation = controller.slice(start, end);
    expect(guestPresenceActivation).toContain("startReelGuestPresence");
    expect(guestPresenceActivation).not.toContain("requestDiscovery()");
  });

  it("keeps nearby discovery and personal presence as separate controls", () => {
    expect(screenSource).toContain("reel-proximity__discovery-toggle");
    expect(screenSource).toContain("if (discoveryEnabled) ignoreLocation()");
    expect(screenSource).toContain("else void requestDiscovery()");
    expect(screenSource).toContain("reel-radar__me");
    expect(screenSource).toContain("void stopPresence()");
    expect(screenSource).toContain("void stopGuestPresence()");
    expect(screenSource).toContain("void activatePresence()");
    expect(screenSource).toContain("void activateGuestPresence()");
    expect(screenSource).toContain("isPresenceActive && (");
    expect(screenSource).not.toContain("reel-proximity__presence-toggle");
    expect(headerSource).toContain('<h1>{t("page.reel.title")}</h1>');
    expect(screenSource).toContain("reel-proximity__live-indicator");
    expect(screenSource).toContain('<RadioTower aria-hidden="true" />');
    expect(screenSource).toContain('className="reel-proximity__header-actions"');
    expect(screenSource).toContain("reel-radar__me-avatar");
    expect(screenSource).toContain('className="reel-radar__me-label"');
    expect(screenSource).toContain("aria-pressed={isPresenceActive}");
    expect(screenSource).toContain("if (currentPresence) {");
    expect(screenSource).toContain("void stopPresence();");
    expect(screenSource).toContain("else if (guestPresence) {");
    expect(screenSource).toContain("void stopGuestPresence();");
    expect(screenSource).not.toContain("messagesHidden");
  });

  it("loads only the signed-in member avatar from the canonical profile and media records", () => {
    expect(memberAvatarSource).toContain('.from("profiles")');
    expect(memberAvatarSource).toContain('.select("avatar_media_id")');
    expect(memberAvatarSource).toContain('.from("media")');
    expect(memberAvatarSource).toContain('.eq("owner_id", memberId)');
    expect(memberAvatarSource).toContain('.from("avatars")');
    expect(memberAvatarSource).toContain("path.startsWith(`${memberId}/`)");
    expect(controllerSource).toContain('access.mode !== "member"');
    expect(screenSource).toContain('accessMode === "member" && memberAvatarUrl');
    expect(screenSource).toContain("<img");
  });

  it("keeps the En direct header and central profile controls in the mobile screen composition", () => {
    expect(screenSource).toContain('className="reel-proximity__header-actions"');
    expect(screenSource).toContain("reel-radar__me-avatar");
    expect(screenSource).toContain("memberAvatarUrl");
    expect(screenSource).toContain("reel-radar__me-label");
  });

  it("uses the central radar profile to activate or stop personal presence", () => {
    expect(screenSource).toContain(
      'className={`reel-radar__me${isPresenceActive ? " is-presence-active" : ""}`}',
    );
    expect(screenSource).toContain("aria-pressed={isPresenceActive}");
    expect(screenSource).toContain("void activatePresence()");
    expect(screenSource).toContain("void activateGuestPresence()");
    expect(screenSource).toContain("void stopPresence()");
    expect(screenSource).toContain("void stopGuestPresence()");
  });

  it("does not expose an unsupported full-profile expansion from nearby presence data", () => {
    expect(screenSource).not.toContain("setShowFullProfile");
    expect(screenSource).not.toContain("reel.ui.fullProfile");
    expect(controllerSource).not.toContain("showFullProfile");
    expect(profileSheetSource).toContain("person.description");
    expect(profileSheetSource).toContain("person.locationLabel");
  });

  it("refreshes both received bips and connections immediately after acceptance", () => {
    expect(controllerSource).toContain(
      'action === "accept" ? refreshConnections() : Promise.resolve()',
    );
    expect(controllerSource).toContain("await Promise.all([");
  });

  it("keeps live alerts disabled until nearby discovery or presence is authorized", () => {
    const activityStart = controllerSource.indexOf("const activityEnabled =");
    const activityEnd = controllerSource.indexOf("const availablePeople", activityStart);
    const activityBlock = controllerSource.slice(activityStart, activityEnd);
    expect(activityBlock).toContain("discoveryEnabled");
    expect(activityBlock).toContain("Boolean(currentPresence)");
    expect(activityBlock).toContain("Boolean(guestPresence)");
    expect(activityBlock).not.toContain("canUseMemberReel");
    expect(activityBlock).not.toContain('access.mode === "guest"');
  });

  it("builds the alerts view from existing bips and connection reads", () => {
    expect(controllerSource).toContain('activityTab === "notifications"');
    expect(controllerSource).toContain("Promise.all([refreshBips(), refreshConnections()])");
    expect(controllerSource).toContain("listReelBips()");
    expect(controllerSource).toContain("listReelConnections()");
    expect(screenSource).toContain("receivedGuestBips.map((bip)");
    expect(screenSource).toContain('connection.status === "active"');
    expect(screenSource).toContain("connectionsMessage");
    expect(screenSource).not.toContain("notificationHistory");
  });

  it("shows a compact nearby profile preview using only discovered people", () => {
    expect(screenSource).toContain("discoveryEnabled && availablePeople.length > 0");
    expect(screenSource).toContain("availablePeople.slice(0, 3)");
    expect(screenSource).toContain("reel-nearby-preview__list");
    expect(screenSource).toContain('onClick={() => setPanel("people")}');
    expect(screenSource).toContain("onClick={() => openProfile(person)}");
    expect(screenSource).toContain("onClick={() => openProfile(person)}");
    expect(nearbyPreviewSource).toContain("if (discoveryEnabled)");
    expect(screenSource).toContain('t("reel.ui.noNearby")');
    expect(screenSource).not.toContain("reel-nearby-preview__empty");
    expect(screenSource).not.toContain("reel-presence-stack");
  });

  it("explains discovery, presence, radar, radius and privacy in a settings help dialog", () => {
    expect(settingsPanelSource).toContain("onClick={onOpenHelp}");
    expect(screenSource).toContain('role="dialog"');
    expect(screenSource).toContain('t("reel.ui.helpDiscoveryTitle")');
    expect(screenSource).toContain('t("reel.ui.helpPresenceTitle")');
    expect(screenSource).toContain('t("reel.ui.helpRadarTitle")');
    expect(screenSource).toContain('t("reel.ui.helpRadiusTitle")');
    expect(screenSource).toContain('t("reel.ui.helpPrivacyTitle")');
    expect(screenSource).toContain('t("reel.ui.settingsHelpTitle")');
  });

  it("offers a short, dismissible guided tour without enabling discovery or presence", () => {
    expect(screenSource).toContain('window.localStorage.getItem("vitalis-reel-tour-seen")');
    expect(headerSource).toContain("onOpenTour();");
    expect(screenSource).toContain('aria-modal="true"');
    expect(screenSource).toContain('t("reel.ui.tour.finish")');
    expect(guidedTourSource).toContain('t("reel.ui.tour.finish")');
    expect(guidedTourSource).not.toContain("requestDiscovery");
    expect(guidedTourSource).not.toContain("activatePresence");
  });
});
