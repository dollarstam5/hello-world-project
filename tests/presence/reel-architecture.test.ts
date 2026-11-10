import { describe, expect, it } from "vitest";
import screenSource from "../../src/domains/presence/ui/ReelProximityScreen.tsx?raw";
import controllerSource from "../../src/domains/presence/model/useReelProximityController.ts?raw";
import realtimeServiceSource from "../../src/domains/presence/services/reel-activity-realtime.service.ts?raw";

describe("Réel architecture boundaries", () => {
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
});
