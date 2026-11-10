import { describe, expect, it } from "vitest";
import { radarCommandForTransition } from "@/lib/sync/radar-command";

describe("Radar sync command mapping", () => {
  it("maps draft activation and paused resumption to guarded commands", () => {
    expect(radarCommandForTransition("draft", "active")).toBe("activate");
    expect(radarCommandForTransition("paused", "active")).toBe("resume");
  });

  it("maps active states to pause and cancellation commands", () => {
    expect(radarCommandForTransition("active", "paused")).toBe("pause");
    expect(radarCommandForTransition("watching", "paused")).toBe("pause");
    expect(radarCommandForTransition("matched", "cancelled")).toBe("cancel");
  });

  it("does not allow unsupported or terminal transitions", () => {
    expect(radarCommandForTransition("draft", "paused")).toBeNull();
    expect(radarCommandForTransition("expired", "cancelled")).toBeNull();
    expect(radarCommandForTransition("cancelled", "active")).toBeNull();
    expect(radarCommandForTransition("active", "watching")).toBeNull();
  });

  it("does not let a client command set the expired status", () => {
    expect(radarCommandForTransition("draft", "expired")).toBeNull();
    expect(radarCommandForTransition("active", "expired")).toBeNull();
    expect(radarCommandForTransition("paused", "expired")).toBeNull();
  });
});
