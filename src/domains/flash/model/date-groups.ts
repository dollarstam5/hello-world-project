export type FlashDateGroup = "today" | "yesterday" | "twoDaysAgo" | "thisWeek" | "older";

export function getFlashDateGroup(createdAt: number, now = Date.now()): FlashDateGroup {
  const created = new Date(createdAt);
  const current = new Date(now);
  created.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);
  const days = Math.floor((current.getTime() - created.getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days === 2) return "twoDaysAgo";
  if (days < 7) return "thisWeek";
  return "older";
}
