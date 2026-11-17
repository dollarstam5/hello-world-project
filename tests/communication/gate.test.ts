import { describe, expect, it } from "vitest";
import { resolveCommunicationCandidates } from "@/lib/communication/gate";

describe("resolveCommunicationCandidates", () => {
  it("orders confirmed messages by priority and keeps stable order within a priority", () => {
    const result = resolveCommunicationCandidates([
      { key: "home.welcome", priority: "low" },
      { key: "common.error", priority: "critical" },
      { key: "common.retry", priority: "high" },
      { key: "common.close", priority: "high" },
    ]);

    expect(result.selected.map(({ key }) => key)).toEqual([
      "common.error",
      "common.retry",
      "common.close",
      "home.welcome",
    ]);
  });

  it("suppresses event IDs and repeat keys already delivered", () => {
    const result = resolveCommunicationCandidates(
      [
        { key: "common.error", priority: "critical", eventId: "event-1" },
        { key: "common.retry", priority: "high", repeatKey: "welcome-session" },
        { key: "common.close", priority: "normal", eventId: "event-2" },
      ],
      {
        deliveredEventIds: new Set(["event-1"]),
        deliveredRepeatKeys: new Set(["welcome-session"]),
      },
    );

    expect(result.selected.map(({ key }) => key)).toEqual(["common.close"]);
    expect(result.suppressed).toHaveLength(2);
  });

  it("deduplicates repeated IDs and repeat keys within one batch", () => {
    const result = resolveCommunicationCandidates([
      { key: "common.error", priority: "critical", eventId: "event-1" },
      { key: "common.retry", priority: "high", eventId: "event-1" },
      { key: "common.close", priority: "normal", repeatKey: "same-action" },
      { key: "common.cancel", priority: "low", repeatKey: "same-action" },
    ]);

    expect(result.selected.map(({ key }) => key)).toEqual(["common.error", "common.close"]);
    expect(result.suppressed).toHaveLength(2);
  });

  it("applies a non-negative integer display limit after priority sorting", () => {
    const result = resolveCommunicationCandidates(
      [
        { key: "home.welcome", priority: "low" },
        { key: "common.error", priority: "critical" },
      ],
      {},
      1.8,
    );

    expect(result.selected.map(({ key }) => key)).toEqual(["common.error"]);
    expect(result.suppressed.map(({ key }) => key)).toEqual(["home.welcome"]);
  });

  it("does not suppress candidates without stable deduplication keys", () => {
    const candidate = { key: "home.welcome", priority: "normal" } as const;
    const result = resolveCommunicationCandidates([candidate, candidate]);

    expect(result.selected).toHaveLength(2);
    expect(result.suppressed).toHaveLength(0);
  });
});
