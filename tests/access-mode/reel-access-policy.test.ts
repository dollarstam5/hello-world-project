import { describe, expect, it } from "vitest";
import { evaluateReelAccess } from "@/domains/presence/policy/reel-access-policy";

const member = {
  mode: "member" as const,
  loading: false,
  memberProfileState: "active" as const,
};
const guest = {
  mode: "guest" as const,
  loading: false,
  memberProfileState: "not_applicable" as const,
};
const visitor = {
  mode: "visitor" as const,
  loading: false,
  memberProfileState: "not_applicable" as const,
};

describe("evaluateReelAccess", () => {
  it("allows a visitor to view the Réel entry only", () => {
    expect(evaluateReelAccess({ access: visitor }, "enter").status).toBe("deny");
    expect(evaluateReelAccess({ access: visitor }, "discover_presence").status).toBe("deny");
  });

  it("does not grant business actions to a guest session", () => {
    expect(evaluateReelAccess({ access: guest }, "enter").status).toBe("allow");
    expect(evaluateReelAccess({ access: guest }, "start_presence").status).toBe("deny");
    expect(evaluateReelAccess({ access: guest }, "send_bip").status).toBe("deny");
  });

  it("requires explicit Réel presence consent before starting", () => {
    expect(
      evaluateReelAccess({ access: member, presenceConsent: true, consents: [] }, "start_presence")
        .reason,
    ).toBe("consent_required");
    expect(
      evaluateReelAccess(
        { access: member, presenceConsent: true, consents: ["reel_presence"] },
        "start_presence",
      ).status,
    ).toBe("server_check");
  });

  it("requires the resource owner to stop their presence", () => {
    expect(
      evaluateReelAccess({ access: member, resourceOwned: false }, "stop_presence").status,
    ).toBe("deny");
    expect(
      evaluateReelAccess({ access: member, resourceOwned: true }, "stop_presence").status,
    ).toBe("server_check");
  });

  it("limits bip decisions to the correct participant", () => {
    expect(
      evaluateReelAccess(
        { access: member, presenceConsent: true, actorRole: "sender" },
        "accept_bip",
      ).status,
    ).toBe("deny");
    expect(
      evaluateReelAccess(
        { access: member, presenceConsent: true, actorRole: "recipient", resourceOwned: true },
        "accept_bip",
      ).status,
    ).toBe("server_check");
    expect(
      evaluateReelAccess(
        { access: member, presenceConsent: true, actorRole: "recipient", resourceOwned: true },
        "withdraw_bip",
      ).status,
    ).toBe("deny");
  });

  it("requires an online server check for presence and bip actions", () => {
    const decision = evaluateReelAccess(
      {
        access: member,
        consents: ["reel_presence"],
        presenceConsent: true,
        online: false,
      },
      "start_presence",
    );
    expect(decision.status).toBe("deny");
    expect(decision.mayQueueOffline).toBe(false);
  });

  it("keeps conversations, zone sharing and reports unavailable until implemented", () => {
    for (const operation of [
      "open_conversation",
      "send_message",
      "share_zone",
      "report",
    ] as const) {
      expect(evaluateReelAccess({ access: member }, operation).status).toBe("deny");
    }
  });

  it("keeps proximity, reactions and bips disabled when Réel location is ignored", () => {
    for (const operation of ["discover_presence", "list_bips", "send_bip", "accept_bip"] as const) {
      const decision = evaluateReelAccess(
        { access: member, discoveryConsent: false, presenceConsent: false },
        operation,
      );
      expect(decision.status).toBe("deny");
      expect(decision.reason).toBe("consent_required");
    }
    // Location is not required to manage an already established relationship.
    expect(
      evaluateReelAccess({ access: member, resourceOwned: true }, "close_connection").status,
    ).toBe("server_check");
  });

  it("keeps discovery and own-presence consent independent", () => {
    expect(
      evaluateReelAccess({ access: member, discoveryConsent: true }, "discover_presence").status,
    ).toBe("server_check");
    expect(
      evaluateReelAccess({ access: member, discoveryConsent: true }, "start_presence").reason,
    ).toBe("consent_required");
    expect(
      evaluateReelAccess(
        { access: member, presenceConsent: true, consents: ["reel_presence"] },
        "start_presence",
      ).status,
    ).toBe("server_check");
    expect(
      evaluateReelAccess({ access: member, presenceConsent: true }, "discover_presence").reason,
    ).toBe("consent_required");
  });

  it("always leaves final authorization to the server", () => {
    const decision = evaluateReelAccess(
      { access: member, discoveryConsent: true },
      "discover_presence",
    );
    expect(decision.status).toBe("server_check");
    expect(decision.requiresServerAuthorization).toBe(true);
  });
});
