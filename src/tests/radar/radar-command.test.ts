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

  it("lets the database resolve an elapsed Radar to expired", () => {
    expect(radarCommandForTransition("draft", "expired")).toBe("activate");
    expect(radarCommandForTransition("active", "expired")).toBe("pause");
    expect(radarCommandForTransition("paused", "expired")).toBe("resume");
  });
});
