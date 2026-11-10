import { describe, expect, it } from "vitest";
import { evaluateEngineAccess } from "@/domains/access-mode";

const state = (
  mode: "visitor" | "guest" | "member",
  memberProfileState: "not_applicable" | "loading" | "active" | "invited" | "suspended" | "closed" | "missing" | "error" = "not_applicable",
  loading = false,
) => ({ mode, memberProfileState, loading });

describe("evaluateEngineAccess", () => {
  it("allows public introductions without opening protected engine features", () => {
    expect(evaluateEngineAccess(state("visitor"), "reel", "view_intro").status).toBe("allow");
    expect(evaluateEngineAccess(state("visitor"), "reel", "operate").status).toBe("deny");
  });

  it("limits guest entry to the Réel guest journey", () => {
    expect(evaluateEngineAccess(state("guest"), "reel", "enter").status).toBe("allow");
    expect(evaluateEngineAccess(state("guest"), "flash", "enter").status).toBe("deny");
  });

  it("never treats a guest operation as already authorized", () => {
    const result = evaluateEngineAccess(state("guest"), "reel", "operate");
    expect(result.status).toBe("server_check");
    expect(result.allowed).toBe(false);
    expect(result.requiresServerAuthorization).toBe(true);
  });

  it("allows an active member to enter an engine but requires server checks for operations", () => {
    expect(evaluateEngineAccess(state("member", "active"), "radar", "enter").status).toBe("allow");
    expect(evaluateEngineAccess(state("member", "active"), "radar", "operate").status).toBe("server_check");
  });

  it.each(["invited", "suspended", "closed", "missing", "error"] as const)(
    "blocks engine entry when the member profile is %s",
    (profileState) => {
      expect(evaluateEngineAccess(state("member", profileState), "reel", "enter").status).toBe("deny");
    },
  );

  it("fails closed while access or profile state is loading", () => {
    expect(evaluateEngineAccess(state("member", "active", true), "reel", "enter").status).toBe("deny");
    expect(evaluateEngineAccess(state("member", "loading"), "reel", "enter").status).toBe("deny");
  });
});
