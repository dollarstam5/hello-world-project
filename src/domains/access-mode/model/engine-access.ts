import type { AccessModeState, MemberProfileState } from "./access-mode";

export type VitalisEngine = "reel" | "flash" | "scan" | "radar" | "grid";
export type VitalisAction =
  | "view_intro"
  | "enter"
  | "read_public"
  | "discover"
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "contact"
  | "manage"
  | "sync"
  | "export"
  | "operate";
export type DecisionStatus = "allow" | "deny" | "server_check" | "defer";
export type DecisionReason =
  | "public_information"
  | "active_member"
  | "guest_reel_entry"
  | "guest_server_validation"
  | "loading"
  | "account_required"
  | "profile_incomplete"
  | "account_unavailable"
  | "consent_required"
  | "quota_reached"
  | "feature_unavailable"
  | "resource_not_owned"
  | "offline_not_queueable"
  | "offline_queue"
  | "server_authorization_required";

export interface VitalisDecisionContext {
  access: Pick<AccessModeState, "mode" | "loading" | "memberProfileState">;
  /** Consent keys confirmed for this exact purpose, not global consent. */
  consents?: readonly string[];
  requiredConsent?: string;
  quotaAvailable?: boolean;
  featureAvailable?: boolean;
  resourceOwned?: boolean;
  online?: boolean;
  /** Only operations explicitly designed for the offline outbox may set this. */
  queueableOffline?: boolean;
}

export interface VitalisDecision {
  status: DecisionStatus;
  allowed: boolean;
  reason: DecisionReason;
  message: string;
  requiresServerAuthorization: boolean;
  /** True only when the caller may store a minimal pending command for later sync. */
  mayQueueOffline: boolean;
}

export type AccessDecision = VitalisDecision;
export type AccessDecisionStatus = DecisionStatus;
export type EngineAction = "view_intro" | "enter" | "operate";

const ENGINES: readonly VitalisEngine[] = ["reel", "flash", "scan", "radar", "grid"];
const MEMBER_PROFILE_BLOCKED: readonly MemberProfileState[] = [
  "invited",
  "suspended",
  "closed",
  "missing",
  "error",
];

function result(status: DecisionStatus, reason: DecisionReason, message: string): VitalisDecision {
  return {
    status,
    allowed: status === "allow",
    reason,
    message,
    requiresServerAuthorization: status === "server_check",
    mayQueueOffline: status === "defer",
  };
}

/**
 * Shared, fail-closed decision point for Vitalis interfaces.
 *
 * This function guides the client only. "allow" never replaces server-side
 * authorization for protected data or business operations.
 */
export function evaluateVitalisDecision(
  context: VitalisDecisionContext,
  engine: VitalisEngine,
  action: VitalisAction,
): VitalisDecision {
  if (!ENGINES.includes(engine)) {
    return result("deny", "feature_unavailable", "Cette possibilité n’est pas disponible.");
  }

  const access = context.access;
  if (access.loading || access.memberProfileState === "loading") {
    return result("deny", "loading", "Nous vérifions votre accès. Un instant.");
  }

  if (action === "view_intro" || action === "read_public") {
    return result("allow", "public_information", "Vous pouvez découvrir cet espace.");
  }

  if (access.mode === "visitor") {
    return result(
      "deny",
      "account_required",
      "Cette possibilité demande un accès adapté. Vous pouvez commencer en invité si elle le permet, ou vous connecter.",
    );
  }

  if (access.mode === "guest") {
    if (engine !== "reel" || (action === "enter" && engine !== "reel")) {
      return result("deny", "account_required", "Cette possibilité demande un compte Vitalis.");
    }
    if (action === "enter") {
      return result("allow", "guest_reel_entry", "Vous pouvez découvrir Réel en invité.");
    }
    // Guest business operations remain blocked until their dedicated server
    // policy, consent and abuse controls have been validated.
    return result(
      "server_check",
      "guest_server_validation",
      "Nous devons vérifier cette possibilité avant de continuer.",
    );
  }

  if (MEMBER_PROFILE_BLOCKED.includes(access.memberProfileState)) {
    const incomplete =
      access.memberProfileState === "invited" || access.memberProfileState === "missing";
    return result(
      "deny",
      incomplete ? "profile_incomplete" : "account_unavailable",
      incomplete
        ? "Votre profil doit être complété avant de continuer."
        : "Votre compte ne permet pas encore cette action.",
    );
  }

  if (access.memberProfileState !== "active") {
    return result("deny", "account_unavailable", "Votre compte ne permet pas encore cette action.");
  }

  if (context.featureAvailable === false) {
    return result("deny", "feature_unavailable", "Cette possibilité n’est pas encore disponible.");
  }
  if (context.resourceOwned === false) {
    return result("deny", "resource_not_owned", "Vous ne pouvez pas modifier cet élément.");
  }
  if (context.requiredConsent && !context.consents?.includes(context.requiredConsent)) {
    return result("deny", "consent_required", "Votre accord est nécessaire avant de continuer.");
  }
  if (context.quotaAvailable === false) {
    return result(
      "deny",
      "quota_reached",
      "Vous avez atteint la limite disponible pour le moment.",
    );
  }

  if (context.online === false) {
    if (context.queueableOffline) {
      return result(
        "defer",
        "offline_queue",
        "Votre demande sera gardée sur cet appareil et envoyée dès le retour de la connexion.",
      );
    }
    return result(
      "deny",
      "offline_not_queueable",
      "Cette action nécessite une connexion internet.",
    );
  }

  if (action === "enter") {
    return result("allow", "active_member", "Vous pouvez accéder à cet espace.");
  }

  return result(
    "server_check",
    "server_authorization_required",
    "Nous vérifions votre autorisation avant de continuer.",
  );
}

/** Compatibility adapter for the first access-manager API. */
export function evaluateEngineAccess(
  access: Pick<AccessModeState, "mode" | "loading" | "memberProfileState">,
  engine: VitalisEngine,
  action: EngineAction,
): AccessDecision {
  return evaluateVitalisDecision({ access }, engine, action);
}
