import { beforeEach, describe, expect, it, vi } from "vitest";
import { useOnboarding } from "@/lib/experience/onboarding";

describe("Vitalis onboarding", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
    window.localStorage.clear();
    useOnboarding.setState({
      hydrated: false,
      completed: false,
      shouldShow: false,
      step: 0,
    });
  });

  it("guides the user through five steps without exceeding the final step", () => {
    useOnboarding.getState().next();
    useOnboarding.getState().next();
    useOnboarding.getState().next();
    useOnboarding.getState().next();
    useOnboarding.getState().next();
    useOnboarding.getState().next();

    expect(useOnboarding.getState().step).toBe(4);

    useOnboarding.getState().previous();
    expect(useOnboarding.getState().step).toBe(3);
  });

  it("skips the first-run sheet only for the development visual smoke route", () => {
    vi.stubEnv("DEV", true);
    try {
      window.history.replaceState({}, "", "/?__vitalis_smoke=1");

      useOnboarding.getState().hydrate();

      expect(useOnboarding.getState()).toMatchObject({
        hydrated: true,
        completed: true,
        shouldShow: false,
      });
      expect(window.localStorage.getItem("vitalis.onboarding.v2")).toBe("1");
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("persists completion so the introduction does not reopen next time", () => {
    useOnboarding.setState({ hydrated: true, shouldShow: true, step: 4 });

    useOnboarding.getState().complete();

    expect(window.localStorage.getItem("vitalis.onboarding.v2")).toBe("1");
    expect(useOnboarding.getState()).toMatchObject({
      completed: true,
      shouldShow: false,
      step: 0,
    });
  });

  it("can dismiss onboarding when browser storage is unavailable", () => {
    const storage = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    useOnboarding.setState({ hydrated: true, shouldShow: true, step: 2 });

    try {
      expect(() => useOnboarding.getState().dismiss()).not.toThrow();
      expect(useOnboarding.getState()).toMatchObject({
        completed: true,
        shouldShow: false,
        step: 0,
      });
    } finally {
      storage.mockRestore();
    }
  });

  it("shows onboarding when its stored completion flag cannot be read", () => {
    const storage = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });

    try {
      useOnboarding.getState().hydrate();
      expect(useOnboarding.getState()).toMatchObject({
        hydrated: true,
        completed: false,
        shouldShow: true,
        step: 0,
      });
    } finally {
      storage.mockRestore();
    }
  });

  it("shows the new introduction even when the previous welcome flag exists", () => {
    window.localStorage.setItem("eco.onboarding.v1", "1");

    useOnboarding.getState().hydrate();

    expect(useOnboarding.getState()).toMatchObject({
      hydrated: true,
      shouldShow: true,
      step: 0,
    });
  });

  it("does not show the introduction after it has been completed", () => {
    window.localStorage.setItem("vitalis.onboarding.v2", "1");

    useOnboarding.getState().hydrate();

    expect(useOnboarding.getState()).toMatchObject({
      hydrated: true,
      completed: true,
      shouldShow: false,
    });
  });
});
