import { describe, expect, it } from "vitest";
import { createCommunicationRuntime } from "@/features/communication/model/runtime";
import { publishFlashCommunicationEvent } from "@/domains/flash/communication-events";
import { publishRadarCommunicationEvent } from "@/domains/radar/communication-events";

describe("domain communication event adapters", () => {
  function memberRuntime() {
    const runtime = createCommunicationRuntime();
    runtime.updateContext({
      identity: "member",
      pathname: "/",
      locale: "fr",
      assistantEnabled: false,
    });
    return runtime;
  }

  it("maps confirmed Flash lifecycle changes to localized center events", () => {
    const runtime = memberRuntime();

    publishFlashCommunicationEvent(runtime, { id: "flash-1" as never, updatedAt: 120 }, "updated");

    expect(runtime.getEvents()).toMatchObject([
      {
        id: "flash:flash-1:updated:120",
        source: "flash",
        titleKey: "communication.event.flash.title",
        messageKey: "communication.event.flash.updated",
        href: "/flash",
      },
    ]);
    expect(runtime.getUnreadEventCount()).toBe(0);
  });

  it("maps confirmed Radar lifecycle changes without exposing record content", () => {
    const runtime = memberRuntime();

    publishRadarCommunicationEvent(
      runtime,
      { id: "radar-1" as never, updatedAt: 240 },
      "cancelled",
    );

    expect(runtime.getEvents()).toMatchObject([
      {
        id: "radar:radar-1:cancelled:240",
        source: "radar",
        titleKey: "communication.event.radar.title",
        messageKey: "communication.event.radar.cancelled",
        href: "/radar",
      },
    ]);
    expect(JSON.stringify(runtime.getEvents())).not.toContain("temporary");
  });
});
