export type CommunicationIdentityState = "loading" | "guest" | "member";
export type CommunicationPermissionState = "unknown" | "granted" | "denied" | "not-required";

export interface CommunicationContextInput {
  /** Auth must be resolved before guest/member can be distinguished. */
  identity: CommunicationIdentityState;
  /** Current pathname only; never pass query strings or fragments. */
  pathname: string | null;
  /** Resolved UI locale, for example "fr" or "en". */
  locale: string | null;
  /** null means preferences have not finished hydrating. */
  assistantEnabled: boolean | null;
  permissions?: {
    discover?: CommunicationPermissionState;
    presence?: CommunicationPermissionState;
  };
}

export interface CommunicationContext {
  identity: CommunicationIdentityState;
  route: string | null;
  locale: string | null;
  assistantEnabled: boolean | null;
  assistantPreferenceReady: boolean;
  permissions: {
    discover: CommunicationPermissionState;
    presence: CommunicationPermissionState;
  };
  ready: boolean;
}

const permissionStates = new Set<CommunicationPermissionState>([
  "unknown",
  "granted",
  "denied",
  "not-required",
]);

function normalizePathname(pathname: string | null): string | null {
  if (!pathname || !pathname.startsWith("/") || pathname.startsWith("//")) return null;
  const pathOnly = pathname.split(/[?#]/, 1)[0];
  return pathOnly.length > 1 ? pathOnly.replace(/\/+$/, "") : "/";
}

function normalizePermission(
  value: CommunicationPermissionState | undefined,
): CommunicationPermissionState {
  return value && permissionStates.has(value) ? value : "unknown";
}

/**
 * Builds a minimal, privacy-safe snapshot from already-resolved application
 * state. It performs no auth lookup, permission request, navigation, I/O,
 * persistence, or business decision.
 */
export function resolveCommunicationContext(
  input: CommunicationContextInput,
): CommunicationContext {
  const route = normalizePathname(input.pathname);
  const locale = input.locale?.trim().toLowerCase() || null;

  return {
    identity: input.identity,
    route,
    locale,
    assistantEnabled: input.assistantEnabled,
    assistantPreferenceReady: input.assistantEnabled !== null,
    permissions: {
      discover: normalizePermission(input.permissions?.discover),
      presence: normalizePermission(input.permissions?.presence),
    },
    ready: input.identity !== "loading" && route !== null && locale !== null,
  };
}
