export type FlashDateGroup = "today" | "yesterday" | "twoDaysAgo" | "thisWeek" | "older";

export function getFlashDateGroup(createdAt: number, now = Date.now()): FlashDateGroup {
  const created = new Date(createdAt);
  const current = new Date(now);
  const createdDay = Date.UTC(created.getFullYear(), created.getMonth(), created.getDate());
  const currentDay = Date.UTC(current.getFullYear(), current.getMonth(), current.getDate());
  const days = Math.round((currentDay - createdDay) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days === 2) return "twoDaysAgo";
  if (days < 7) return "thisWeek";
  return "older";
}
