import type { MessageKey } from "@/lib/i18n/messages";
import type { Person, RawNearbyPerson } from "./reel-proximity.types";
import type { MessageKey } from "@/lib/i18n/messages";

export function distributePeopleHarmoniously(
  rawPeople: RawNearbyPerson[],
  areaLabel: string,
  t: (key: MessageKey) => string,
): Person[] {
  const total = rawPeople.length;
  if (total === 0) return [];
  // Each orbit has its own evenly spaced angles; stagger the rings to avoid alignment.
  const ringGroups: number[][] = [[], [], []];
  rawPeople.forEach((_, index) => ringGroups[index % 3].push(index));
  const angles = new Array<number>(total);
  ringGroups.forEach((indices, ring) => {
    const count = indices.length;
    indices.forEach((personIndex, slot) => {
      const baseAngle = (360 / Math.max(count, 1)) * slot + ring * 23;
      const jitter = ((personIndex * 17) % 15) - 7.5;
      angles[personIndex] = (baseAngle + jitter + 360) % 360;
    });
  });
  return rawPeople.map((person, index) => {
    const displayName = person.display_name || t("reel.controller.guestName");
    return {
      id: person.presence_id,
      name: displayName,
      avatarUrl: null,
      avatarKey: person.avatar_key,
      initials: displayName.trim().split(/\s+/).slice(0, 2).map((part: string) => part[0]?.toUpperCase() ?? "").join(""),
      angle: angles[index],
      description: person.description,
      locationLabel: person.area_label || areaLabel,
      actorKind: person.actor_kind || (person.avatar_key ? "guest" : "member"),
    };
  });
}
