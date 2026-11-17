import type { MessageKey } from "@/lib/i18n/messages";

/**
 * Selects a localized, prewritten greeting using the device's local hour.
 * The selector is deterministic and has no network, storage, or AI dependency.
 */
export function getHomeGreetingKey(hour: number): MessageKey {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    return "home.welcome";
  }

  if (hour < 3) return "home.greeting.veryLate";
  if (hour < 5) return "home.greeting.earlyMorning";
  if (hour < 8) return "home.greeting.morning";
  if (hour < 11) return "home.greeting.lateMorning";
  if (hour < 14) return "home.greeting.midday";
  if (hour < 17) return "home.greeting.afternoon";
  if (hour < 19) return "home.greeting.evening";
  if (hour < 22) return "home.greeting.night";
  return "home.greeting.late";
}

const NAME_GREETING_SESSION_KEY = "vitalis.communication.name-greeting-shown";

/**
 * Allows a personalized greeting once per browser tab session.
 * No profile data or name is written to storage.
 */
export function claimNameGreetingForSession(): boolean {
  if (typeof window === "undefined") return false;

  try {
    if (window.sessionStorage.getItem(NAME_GREETING_SESSION_KEY) === "1") return false;
    window.sessionStorage.setItem(NAME_GREETING_SESSION_KEY, "1");
    return true;
  } catch {
    // If session storage is unavailable, prefer a neutral greeting.
    return false;
  }
}
