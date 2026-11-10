import { describe, expect, it } from "vitest";
import { evaluateEngineAccess, evaluateVitalisDecision, type VitalisEngine } from "@/domains/access-mode";

const state = (
  mode: "visitor" | "guest" | "member",
  memberProfileState: "not_applicable" | "loading" | "active" | "invited" | "suspended" | "closed" | "missing" | "error" = "not_applicable",
  loading = false,
) => ({ mode, memberProfileState, loading });

describe("evaluateVitalisDecision", () => {
  it.each(["reel", "flash", "scan", "radar", "grid"] as const)(
    "keeps public introductions available for %s without granting operations",
    (engine: VitalisEngine) => {
      expect(evaluateVitalisDecision({ access: state("visitor") }, engine, "view_intro").status).toBe("allow");
      expect(evaluateVitalisDecision({ access: state("visitor") }, engine, "create").status).toBe("deny");
    },
  );

  it("limits guest entry to the Réel journey", () => {
    expect(evaluateVitalisDecision({ access: state("guest") }, "reel", "enter").status).toBe("allow");
    expect(evaluateVitalisDecision({ access: state("guest") }, "flash", "enter").status).toBe("deny");
  });

  it("never authorizes a guest operation in the browser", () => {
    const decision = evaluateVitalisDecision({ access: state("guest") }, "reel", "contact");
    expect(decision.status).toBe("server_check");
    expect(decision.allowed).toBe(false);
    expect(decision.requiresServerAuthorization).toBe(true);
  });

  it("allows an active member to open engine spaces but checks protected operations on the server", () => {
    expect(evaluateVitalisDecision({ access: state("member", "active") }, "radar", "enter").status).toBe("allow");
    expect(evaluateVitalisDecision({ access: state("member", "active") }, "radar", "publish").status).toBe("server_check");
  });

  it.each(["invited", "suspended", "closed", "missing", "error"] as const)(
    "blocks member actions when the profile is %s",
    (profileState) => {
      expect(evaluateVitalisDecision({ access: state("member", profileState) }, "reel", "enter").status).toBe("deny");
    },
  );

  it("fails closed while access is loading", () => {
    expect(evaluateVitalisDecision({ access: state("member", "active", true) }, "reel", "enter").status).toBe("deny");
    expect(evaluateVitalisDecision({ access: state("member", "loading") }, "reel", "enter").status).toBe("deny");
  });

  it("requires consent for the exact requested purpose", () => {
    const context = { access: state("member", "active"), requiredConsent: "share_location", consents: [] };
    expect(evaluateVitalisDecision(context, "reel", "create").reason).toBe("consent_required");
    expect(evaluateVitalisDecision({ ...context, consents: ["share_location"] }, "reel", "create").status).toBe("server_check");
  });

  it("checks availability, ownership and quota before a protected operation", () => {
    const access = state("member", "active");
    expect(evaluateVitalisDecision({ access, featureAvailable: false }, "scan", "discover").reason).toBe("feature_unavailable");
    expect(evaluateVitalisDecision({ access, resourceOwned: false }, "flash", "update").reason).toBe("resource_not_owned");
    expect(evaluateVitalisDecision({ access, quotaAvailable: false }, "radar", "create").reason).toBe("quota_reached");
  });

  it("queues only explicitly queueable actions while offline", () => {
    const access = state("member", "active");
    const queued = evaluateVitalisDecision({ access, online: false, queueableOffline: true }, "radar", "create");
    expect(queued.status).toBe("defer");
    expect(queued.mayQueueOffline).toBe(true);
    expect(evaluateVitalisDecision({ access, online: false }, "reel", "contact").reason).toBe("offline_not_queueable");
  });

  it("keeps the original access API compatible", () => {
    expect(evaluateEngineAccess(state("guest"), "reel", "enter").status).toBe("allow");
    expect(evaluateEngineAccess(state("member", "active"), "reel", "operate").status).toBe("server_check");
  });
});
