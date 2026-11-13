import { describe, expect, it } from "vitest";
import screenSource from "../../src/domains/presence/ui/ReelProximityScreen.tsx?raw";
import controllerSource from "../../src/domains/presence/model/useReelProximityController.ts?raw";
import realtimeServiceSource from "../../src/domains/presence/services/reel-activity-realtime.service.ts?raw";
import memberAvatarSource from "../../src/domains/profile/api/profile-avatar.client.ts?raw";
import proximityCssSource from "../../src/domains/presence/ui/reel-proximity.css?raw";

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
    expect(screenSource).toContain("<h1>INSTANT</h1>");
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
    expect(screenSource).toContain('access.mode === "member" && memberAvatarUrl');
    expect(screenSource).toContain("<img");
  });

  it("keeps the Instant header and central profile usable on narrow mobile screens", () => {
    expect(proximityCssSource).toContain("@media (max-width: 420px)");
    expect(proximityCssSource).toContain("@media (max-width: 360px)");
    expect(proximityCssSource).toContain(".reel-proximity__header-actions");
    expect(proximityCssSource).toContain(".reel-radar__me-avatar img");
    expect(proximityCssSource).toContain(".reel-radar__me:focus-visible");
  });

  it("shows layered individual presence disks only after fifteen nearby profiles", () => {
    expect(screenSource).toContain("availablePeople.length > 15");
    expect(screenSource).toContain("availablePeople.slice(9, 16)");
    expect(screenSource).toContain('className="reel-presence-stack__disk"');
    expect(screenSource).toContain('onClick={() => setPanel("people")}');
    expect(screenSource).not.toContain("reel-nearby__count");
    expect(screenSource).not.toContain("+{additionalCount}");
  });
});
