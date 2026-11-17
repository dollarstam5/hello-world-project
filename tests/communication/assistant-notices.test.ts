import { describe, expect, it } from "vitest";
import { useAssistantPreferences } from "@/lib/app/assistant-preferences";
import {
  dismissAssistantNotice,
  markAssistantWelcomePresented,
  publishAssistantWelcome,
  useAssistantNotices,
} from "@/lib/app/assistant-notices";

describe("assistant welcome notice", () => {
  it(
    "persists the one-time welcome only after it is presented",
    () => {
    window.localStorage.removeItem("vitalis.assistant.welcome-shown");
    useAssistantPreferences.setState({ enabled: false });
    useAssistantNotices.setState({ notice: null });

    publishAssistantWelcome();
    expect(useAssistantNotices.getState().notice).toBeNull();

    useAssistantPreferences.setState({ enabled: true });
    publishAssistantWelcome();
    expect(useAssistantNotices.getState().notice?.kind).toBe("welcome");
    expect(window.localStorage.getItem("vitalis.assistant.welcome-shown")).toBeNull();

    markAssistantWelcomePresented();
    expect(window.localStorage.getItem("vitalis.assistant.welcome-shown")).toBe("true");

    dismissAssistantNotice();
    publishAssistantWelcome();
      expect(useAssistantNotices.getState().notice).toBeNull();
    },
  );
});
