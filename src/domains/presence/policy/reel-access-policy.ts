import type { AccessModeState } from "@/domains/access-mode";
import {
  evaluateVitalisDecision,
  type VitalisDecision,
  type VitalisDecisionContext,
} from "@/domains/access-mode";

export type ReelOperation =
  | "enter"
  | "start_presence"
  | "stop_presence"
  | "discover_presence"
  | "list_bips"
  | "send_bip"
  | "accept_bip"
  | "decline_bip"
  | "withdraw_bip"
  | "close_connection"
  | "open_conversation"
  | "send_message"
  | "share_zone"
  | "report";

export type ReelActorRole = "sender" | "recipient" | "participant";

export interface ReelAccessContext {
  access: Pick<AccessModeState, "mode" | "loading" | "memberProfileState">;
  consents?: readonly string[];
  /** Independent, current-visit approval to use device location inside Réel. */
  locationConsent?: boolean;
  online?: boolean;
  resourceOwned?: boolean;
  actorRole?: ReelActorRole;
}

const DENIED: VitalisDecision = {
  status: "deny",
  allowed: false,
  reason: "feature_unavailable",
  message: "Cette possibilité n’est pas encore disponible dans Réel.",
  requiresServerAuthorization: false,
  mayQueueOffline: false,
};

function denied(message: string, reason: VitalisDecision["reason"] = "resource_not_owned"): VitalisDecision {
  return {
    status: "deny",
    allowed: false,
    reason,
    message,
    requiresServerAuthorization: false,
    mayQueueOffline: false,
  };
}

/**
 * Client-side Réel operation policy. The matching SQL RPC remains the final
 * authority for identity, ownership, participant role, expiry and consent.
 */
export function evaluateReelAccess(
  context: ReelAccessContext,
  operation: ReelOperation,
): VitalisDecision {
  if (operation === "enter") {
    return evaluateVitalisDecision({ access: context.access }, "reel", "enter");
  }

  // Guest sessions exist as a separate server-side identity, but no Réel
  // business RPC currently accepts them. Do not imply that they can act.
  if (context.access.mode === "guest") {
    return denied("Le parcours Réel invité n’est pas encore ouvert pour cette action.", "account_required");
  }

  const locationGatedOperations: readonly ReelOperation[] = [
    "start_presence",
    "discover_presence",
    "list_bips",
    "send_bip",
    "accept_bip",
    "decline_bip",
    "withdraw_bip",
  ];
  if (locationGatedOperations.includes(operation) && context.locationConsent !== true) {
    return denied("Autorisez séparément la position pour utiliser les possibilités de proximité de Réel.", "consent_required");
  }

  const requiredRoles: Partial<Record<ReelOperation, ReelActorRole>> = {
    accept_bip: "recipient",
    decline_bip: "recipient",
    withdraw_bip: "sender",
    close_connection: "participant",
  };
  const requiredRole = requiredRoles[operation];
  if (requiredRole && context.actorRole !== requiredRole) {
    return denied("Cette action n’est pas disponible pour votre rôle dans cette interaction.");
  }

  const ownedOperations: readonly ReelOperation[] = [
    "stop_presence",
    "accept_bip",
    "decline_bip",
    "withdraw_bip",
    "close_connection",
  ];
  if (ownedOperations.includes(operation) && context.resourceOwned === false) {
    return denied("Vous ne pouvez pas agir sur cette présence ou cette interaction.");
  }

  const actionByOperation: Partial<Record<ReelOperation, Parameters<typeof evaluateVitalisDecision>[2]>> = {
    start_presence: "create",
    stop_presence: "delete",
    discover_presence: "discover",
    list_bips: "manage",
    send_bip: "contact",
    accept_bip: "update",
    decline_bip: "update",
    withdraw_bip: "update",
    close_connection: "delete",
  };
  const action = actionByOperation[operation];
  if (!action) return DENIED;

  const decisionContext: VitalisDecisionContext = {
    access: context.access,
    consents: context.consents,
    requiredConsent: operation === "start_presence" ? "reel_presence" : undefined,
    online: context.online,
    // Réel presence and bip commands are not placed in an offline outbox.
    queueableOffline: false,
  };
  return evaluateVitalisDecision(decisionContext, "reel", action);
}
