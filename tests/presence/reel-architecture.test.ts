import { describe, expect, it } from "vitest";
import screenSource from "../../src/domains/presence/ui/ReelProximityScreen.tsx?raw";
import controllerSource from "../../src/domains/presence/model/useReelProximityController.ts?raw";
import realtimeServiceSource from "../../src/domains/presence/services/reel-activity-realtime.service.ts?raw";
import memberAvatarSource from "../../src/domains/profile/api/profile-avatar.client.ts?raw";

describe("Instant architecture boundaries", () => {
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
    expect(controller).toContain("subscribeToReelMemberActivity");
  });

  it("keeps private Realtime channel ownership inside its service", () => {
    const service = realtimeServiceSource;
    expect(service).toContain("config: { private: true }");
    expect(service).toContain("supabase.removeChannel(channel)");
    expect(service).not.toContain("guest_session_id");
    expect(service).not.toContain("presence_id");
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

  it("uses the header visibility control only for the user's own presence", () => {
    expect(screenSource).toContain("reel-proximity__presence-toggle");
    expect(screenSource).toContain("<h1>En direct</h1>");
    expect(screenSource).toContain("reel-proximity__live-indicator");
    expect(screenSource).toContain('<RadioTower aria-hidden="true" />');
    expect(screenSource).toContain('className="reel-proximity__header-actions"');
    expect(screenSource).toContain("reel-radar__me-avatar");
    expect(screenSource).toContain('className="reel-radar__me-label"');
    expect(screenSource).toContain("aria-pressed={isPresenceActive}");
    expect(screenSource).toContain("if (currentPresence) void stopPresence()");
    expect(screenSource).toContain("else if (guestPresence) void stopGuestPresence()");
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

  it("keeps the Instant header and central profile controls in the mobile screen composition", () => {
    expect(screenSource).toContain('className="reel-proximity__header-actions"');
    expect(screenSource).toContain("reel-radar__me-avatar");
    expect(screenSource).toContain("memberAvatarUrl");
    expect(screenSource).toContain("reel-radar__me-label");
  });

  it("opens the signed-in member profile from the central radar avatar", () => {
    expect(screenSource).toContain('to="/espace/profil"');
    expect(screenSource).toContain('access.mode === "member" ?');
    expect(screenSource).toContain('aria-label={t("profile.title")}');
  });

  it("does not expose an unsupported full-profile expansion from nearby presence data", () => {
    expect(screenSource).not.toContain("setShowFullProfile");
    expect(screenSource).not.toContain("reel.ui.fullProfile");
    expect(controllerSource).not.toContain("showFullProfile");
    expect(screenSource).toContain("selectedPerson.description");
    expect(screenSource).toContain("selectedPerson.locationLabel");
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

  it("builds the alerts view from live bips and active connections", () => {
    expect(controllerSource).toContain('activityTab !== "notifications"');
    expect(controllerSource).toContain("const refreshActivity = () =>");
    expect(controllerSource).toContain('"reel_bips"');
    expect(controllerSource).toContain('"reel_connections"');
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
    expect(screenSource).toContain("discoveryEnabled ? (");
    expect(screenSource).toContain('t("reel.ui.noNearby")');
    expect(screenSource).not.toContain("reel-nearby-preview__empty");
    expect(screenSource).not.toContain("reel-presence-stack");
  });

  it("offers a short, dismissible guided tour without enabling discovery or presence", () => {
    expect(screenSource).toContain('window.localStorage.getItem("vitalis-reel-tour-seen")');
    expect(screenSource).toContain("onClick={openTour}");
    expect(screenSource).toContain('aria-modal="true"');
    expect(screenSource).toContain('t("reel.ui.tour.finish")');
    const tourMarkup = screenSource.slice(
      screenSource.indexOf("{tourOpen && ("),
      screenSource.indexOf("{!discoveryEnabled && ("),
    );
    expect(tourMarkup).not.toContain("requestDiscovery");
    expect(tourMarkup).not.toContain("activatePresence");
  });
});
