export type RadarServerCommand = "activate" | "pause" | "resume" | "revalidate" | "cancel";

/**
 * Maps a locally requested status to the only database command that can
 * perform it. The database function remains authoritative and rechecks expiry,
 * ownership and the lifecycle transition.
 */
export function radarCommandForTransition(
  currentStatus: string,
  targetStatus: string,
): RadarServerCommand | null {
  if (targetStatus === "active") {
    if (currentStatus === "draft") return "activate";
    if (currentStatus === "paused") return "resume";
    return null;
  }

  if (targetStatus === "paused") {
    if (["active", "watching", "matched"].includes(currentStatus)) return "pause";
    return null;
  }

  if (targetStatus === "cancelled") {
    if (!["expired", "cancelled"].includes(currentStatus)) return "cancel";
    return null;
  }

  // The SQL command function resolves an expired record before applying the
  // requested action. Any valid non-terminal command can therefore refresh
  // the local expired state without allowing the client to set it directly.
  if (targetStatus === "expired") {
    if (currentStatus === "draft") return "activate";
    if (["active", "watching", "matched"].includes(currentStatus)) return "pause";
    if (currentStatus === "paused") return "resume";
  }

  return null;
}
