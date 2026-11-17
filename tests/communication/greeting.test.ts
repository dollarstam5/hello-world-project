import { describe, expect, it } from "vitest";
import {
  claimNameGreetingForSession,
  getHomeGreetingKey,
} from "@/lib/communication/greeting";

describe("getHomeGreetingKey", () => {
  it.each([
    [0, "home.greeting.veryLate"],
    [2, "home.greeting.veryLate"],
    [3, "home.greeting.earlyMorning"],
    [4, "home.greeting.earlyMorning"],
    [5, "home.greeting.morning"],
    [7, "home.greeting.morning"],
    [8, "home.greeting.lateMorning"],
    [10, "home.greeting.lateMorning"],
    [11, "home.greeting.midday"],
    [13, "home.greeting.midday"],
    [14, "home.greeting.afternoon"],
    [16, "home.greeting.afternoon"],
    [17, "home.greeting.evening"],
    [18, "home.greeting.evening"],
    [19, "home.greeting.night"],
    [21, "home.greeting.night"],
    [22, "home.greeting.late"],
    [23, "home.greeting.late"],
  ] as const)("maps local hour %i to %s", (hour, expected) => {
    expect(getHomeGreetingKey(hour)).toBe(expected);
  });

  it.each([-1, 24, 1.5, Number.NaN])("uses a neutral fallback for invalid hour %s", (hour) => {
    expect(getHomeGreetingKey(hour)).toBe("home.welcome");
  });

  it("uses a display name only once per browser tab session", () => {
    window.sessionStorage.clear();
    expect(claimNameGreetingForSession()).toBe(true);
    expect(claimNameGreetingForSession()).toBe(false);
  });
});
