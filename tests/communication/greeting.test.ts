import { afterEach, describe, expect, it } from "vitest";
import { claimNameGreetingForSession, getHomeGreetingKey } from "@/features/communication/model/greeting";
import { formatCommunicationMessage } from "@/features/communication/model/format";
import type { MessageKey } from "@/platform/internationalization/messages";

describe("getHomeGreetingKey", () => {
  afterEach(() => {
    window.sessionStorage.clear();
  });
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

  it("formats catalog variables and removes missing placeholders", () => {
    const translate = (key: MessageKey) => (key === "home.welcome" ? "Welcome{name}!" : key);

    expect(formatCommunicationMessage(translate, "home.welcome", { name: ", Ada" })).toBe(
      "Welcome, Ada!",
    );
    expect(formatCommunicationMessage(translate, "home.welcome")).toBe("Welcome!");
  });

  it("uses a display name only once per browser tab session", () => {
    window.sessionStorage.clear();
    expect(claimNameGreetingForSession()).toBe(true);
    expect(claimNameGreetingForSession()).toBe(false);
  });
});
