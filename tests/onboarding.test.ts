import { beforeEach, describe, expect, it } from "vitest";
import { useOnboarding } from "@/lib/experience/onboarding";

describe("onboarding persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useOnboarding.setState({
      hydrated: false,
      completed: false,
      shouldShow: false,
    });
  });

  it("persists dismissal so the welcome sheet does not reopen next time", () => {
    useOnboarding.setState({ hydrated: true, shouldShow: true });

    useOnboarding.getState().dismiss();

    expect(window.localStorage.getItem("eco.onboarding.v1")).toBe("1");
    expect(useOnboarding.getState()).toMatchObject({
      completed: true,
      shouldShow: false,
    });
  });

  it("shows the welcome sheet only when no completion flag exists", () => {
    useOnboarding.getState().hydrate();

    expect(useOnboarding.getState()).toMatchObject({
      hydrated: true,
      completed: false,
      shouldShow: true,
    });
  });
});
