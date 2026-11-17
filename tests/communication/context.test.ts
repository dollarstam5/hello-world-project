import { describe, expect, it } from "vitest";
import { resolveCommunicationContext } from "@/lib/communication/context";

describe("resolveCommunicationContext", () => {
  it("normalizes the route and locale while preserving separate permissions", () => {
    expect(
      resolveCommunicationContext({
        identity: "member",
        pathname: "/reel/activity/?from=header#bips",
        locale: " FR ",
        assistantEnabled: false,
        permissions: { discover: "granted", presence: "denied" },
      }),
    ).toEqual({
      identity: "member",
      route: "/reel/activity",
      locale: "fr",
      assistantEnabled: false,
      assistantPreferenceReady: true,
      permissions: { discover: "granted", presence: "denied" },
      ready: true,
    });
  });

  it("does not classify an unresolved auth session as a guest", () => {
    const context = resolveCommunicationContext({
      identity: "loading",
      pathname: "/",
      locale: "fr",
      assistantEnabled: false,
    });

    expect(context.identity).toBe("loading");
    expect(context.ready).toBe(false);
  });

  it("keeps core context ready while optional assistant preference is still hydrating", () => {
    const context = resolveCommunicationContext({
      identity: "guest",
      pathname: "/flash",
      locale: "fr",
      assistantEnabled: null,
    });

    expect(context.ready).toBe(true);
    expect(context.assistantPreferenceReady).toBe(false);
  });

  it("keeps incomplete or invalid context explicitly unready", () => {
    const context = resolveCommunicationContext({
      identity: "guest",
      pathname: null,
      locale: null,
      assistantEnabled: null,
      permissions: { discover: "invalid" as never },
    });

    expect(context.ready).toBe(false);
    expect(context.assistantPreferenceReady).toBe(false);
    expect(context.route).toBeNull();
    expect(context.locale).toBeNull();
    expect(context.permissions.discover).toBe("unknown");
  });

  it("rejects protocol-relative paths and strips query and fragment data", () => {
    expect(
      resolveCommunicationContext({
        identity: "guest",
        pathname: "//external.example/path?token=private",
        locale: "en",
        assistantEnabled: true,
      }).route,
    ).toBeNull();
    expect(
      resolveCommunicationContext({
        identity: "guest",
        pathname: "/flash?draft=private#step",
        locale: "en",
        assistantEnabled: true,
      }).route,
    ).toBe("/flash");
  });

  it("does not expose user identifiers, coordinates, or permission details beyond state", () => {
    const context = resolveCommunicationContext({
      identity: "member",
      pathname: "/",
      locale: "en",
      assistantEnabled: true,
    });

    expect(context).not.toHaveProperty("userId");
    expect(context).not.toHaveProperty("coordinates");
  });
});
