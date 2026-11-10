import type { RadarDraftInput, RadarRecord } from "@eco/core-contracts";
import { radarDraftSchema } from "./model/radar.schema";
import { radarsRepository, useLocalQuery } from "@/platform/offline";

export function useMyRadars() {
  return useLocalQuery<RadarRecord[]>(() => radarsRepository.list(), []);
}

export function createRadarDraft(input: RadarDraftInput) {
  const valid = radarDraftSchema.parse(input);
  return radarsRepository.create(valid);
}

export function activateRadar(id: string) {
  return radarsRepository.activate(id);
}

export function pauseRadar(id: string) {
  return radarsRepository.pause(id);
}

export function resumeRadar(id: string) {
  return radarsRepository.resume(id);
}

export function cancelRadar(id: string) {
  return radarsRepository.cancel(id);
}
