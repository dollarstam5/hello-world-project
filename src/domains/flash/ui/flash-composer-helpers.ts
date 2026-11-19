import type { FlashCategory, FlashTimeSlot } from "@eco/core-contracts";
import { parseFlashIntent } from "@eco/core-logic";

type SpeechResultEvent = { results: ArrayLike<ArrayLike<{ transcript?: string }>> };
type SpeechErrorEvent = { error?: string };
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};
type ComposerUser = { id: string } | null;
type ComposerOptions = {
  user: ComposerUser;
  locale: string;
  t: (key: MessageKey) => string;
  onSaved: () => void;
};

export const CATEGORIES: FlashCategory[] = [
  "personal",
  "professional",
  "commercial",
  "home",
  "transport",
  "food",
  "education",
  "health",
  "events",
  "other",
];
export const TIME_SLOTS: FlashTimeSlot[] = ["now", "today", "tomorrow", "this_week"];

export function getSpeechConstructor() {
  if (typeof window === "undefined") return undefined;
  const speechWindow = window as SpeechWindow;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
}

export function expiryFor(timeSlot: FlashTimeSlot) {
  const phrases: Record<FlashTimeSlot, string> = {
    now: "maintenant",
    today: "aujourd'hui",
    tomorrow: "demain",
    this_week: "cette semaine",
  };
  return parseFlashIntent(phrases[timeSlot]).expiresAt;
}

