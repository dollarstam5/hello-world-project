import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  CommunicationRuntimeProvider,
  useCommunicationRuntime,
} from "@/features/communication/CommunicationRuntimeProvider";
import type { CommunicationRuntime } from "@/features/communication/model/runtime";

describe("communication runtime provider", () => {
  it("shares one runtime instance across the mounted application tree", () => {
    const runtimes: CommunicationRuntime[] = [];
    function Probe() {
      runtimes.push(useCommunicationRuntime());
      return null;
    }

    renderToString(
      createElement(CommunicationRuntimeProvider, null, createElement(Probe), createElement(Probe)),
    );

    expect(runtimes).toHaveLength(2);
    expect(runtimes[0]).toBe(runtimes[1]);
  });
});
