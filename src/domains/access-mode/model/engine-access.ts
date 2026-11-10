import type { AccessModeState, MemberProfileState } from "./access-mode";

export type VitalisEngine = "reel" | "flash" | "scan" | "radar" | "grid";
export type EngineAction = "view_intro" | "enter" | "operate";
export type AccessDecisionStatus = "allow" | "deny" | "server_check";

export interface AccessDecision {
  status: AccessDecisionStatus;
  allowed: boolean;
  reason:
    | "public_information"
    | "guest_reel_entry"
    | "active_member"
    | "loading"
    | "account_required"
    | "profile_incomplete"
    | "account_unavailable"
    | "server_authorization_required";
  message: string;
  /** True means the caller must ask the protected backend; it is not permission. */
  requiresServerAuthorization: boolean;
}

const GUEST_ENTRY_ENGINES: ReadonlySet<VitalisEngine> = new Set(["reel"]);

function decision(
  status: AccessDecisionStatus,
  reason: AccessDecision["reason"],
  message: string,
): AccessDecision {
  return {
    status,
    allowed: status === "allow",
    reason,
    message,
    requiresServerAuthorization: status === "server_check",
  };
}

/**
 * Front-end access guidance shared by every engine.
 *
 * "allow" only opens the corresponding interface. Any data read/write,
 * publication, contact, or real-time command must still be authorized server-side.
 * Unknown combinations fail closed.
 */
export function evaluateEngineAccess(
  access: Pick<AccessModeState, "mode" | "loading" | "memberProfileState">,
  engine: VitalisEngine,
  action: EngineAction,
): AccessDecision {
  if (access.loading || access.memberProfileState === "loading") {
    return decision("deny", "loading", "Nous vérifions votre accès. Un instant.");
  }

  if (action === "view_intro") {
    return decision("allow", "public_information", "Vous pouvez découvrir ce moteur.");
  }

  if (access.mode === "visitor") {
    return decision("deny", "account_required", "Commencez en invité si ce moteur le permet, ou connectez-vous.");
  }

  if (access.mode === "guest") {
    if (action === "enter" && GUEST_ENTRY_ENGINES.has(engine)) {
      return decision("allow", "guest_reel_entry", "Vous pouvez découvrir Réel en invité.");
    }
    if (action === "operate" && GUEST_ENTRY_ENGINES.has(engine)) {
      return decision(
        "server_check",
        "server_authorization_required",
        "Cette action doit être vérifiée avant de continuer.",
      );
    }
    return decision("deny", "account_required", "Cette possibilité demande un compte Vitalis.");
  }

  const profileState: MemberProfileState = access.memberProfileState;
  if (profileState === "invited" || profileState === "missing") {
    return decision("deny", "profile_incomplete", "Votre profil doit être complété avant de continuer.");
  }
  if (profileState !== "active") {
    return decision("deny", "account_unavailable", "Votre compte ne permet pas encore cette action.");
  }

  if (action === "enter") {
    return decision("allow", "active_member", "Vous pouvez accéder à cet espace.");
  }

  return decision(
    "server_check",
    "server_authorization_required",
    "Cette action doit être vérifiée avant de continuer.",
  );
}
