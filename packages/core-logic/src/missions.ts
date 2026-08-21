import type { MissionRecord, MissionStatus } from "@eco/core-contracts";

const ALLOWED: Record<MissionStatus, MissionStatus[]> = {
  open: ["assigned", "cancelled"],
  assigned: ["in_progress", "open", "cancelled"],
  in_progress: ["done", "cancelled"],
  done: [],
  cancelled: [],
};

/** State machine guard — the only place mission transitions are decided. */
export function canTransition(from: MissionStatus, to: MissionStatus): boolean {
  return ALLOWED[from].includes(to);
}

export function isMissionOverdue(mission: MissionRecord, now = Date.now()): boolean {
  if (mission.dueAt === null) return false;
  if (mission.status === "done" || mission.status === "cancelled") return false;
  return mission.dueAt < now;
}

/** Missions still requiring attention, most urgent first. */
export function sortMissionsByUrgency(missions: MissionRecord[]): MissionRecord[] {
  return [...missions].sort((a, b) => {
    const aDue = a.dueAt ?? Number.MAX_SAFE_INTEGER;
    const bDue = b.dueAt ?? Number.MAX_SAFE_INTEGER;
    return aDue - bDue;
  });
}
