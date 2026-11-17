import { useEffect, useMemo, useRef, useState } from "react";
import type {
  FlashCategory,
  FlashKind,
  FlashScope,
  FlashTimeSlot,
  FlashUrgency,
  UserId,
} from "@eco/core-contracts";
import { parseFlashIntent } from "@eco/core-logic";
import { reverseGeocodeFlashLocation } from "../api/flash-geocoding.functions";
import { createFlash } from "../data";
import type { MessageKey } from "@/lib/i18n/messages";
import { useCommunicationRuntime } from "@/lib/communication/CommunicationRuntimeProvider";
import { publishFlashCommunicationEvent } from "../communication-events";

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

const CATEGORIES: FlashCategory[] = [
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
const TIME_SLOTS: FlashTimeSlot[] = ["now", "today", "tomorrow", "this_week"];

function getSpeechConstructor() {
  if (typeof window === "undefined") return undefined;
  const speechWindow = window as SpeechWindow;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
}

function expiryFor(timeSlot: FlashTimeSlot) {
  const phrases: Record<FlashTimeSlot, string> = {
    now: "maintenant",
    today: "aujourd'hui",
    tomorrow: "demain",
    this_week: "cette semaine",
  };
  return parseFlashIntent(phrases[timeSlot]).expiresAt;
}

export function useFlashComposer({ user, locale, t, onSaved }: ComposerOptions) {
  const communication = useCommunicationRuntime();
  const [composerOpen, setComposerOpen] = useState(false);
  const [step, setStep] = useState<"write" | "review">("write");
  const [text, setText] = useState("");
  const [kind, setKind] = useState<FlashKind>("need");
  const [category, setCategory] = useState<FlashCategory>("other");
  const [timeSlot, setTimeSlot] = useState<FlashTimeSlot>("today");
  const [scope, setScope] = useState<FlashScope | null>(null);
  const [urgency, setUrgency] = useState<FlashUrgency | null>(null);
  const [recording, setRecording] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const [areaLabel, setAreaLabel] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const parsedIntent = useMemo(
    () => (text.trim().length >= 3 ? parseFlashIntent(text) : null),
    [text],
  );
  const speechSupported = Boolean(getSpeechConstructor());

  useEffect(
    () => () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    },
    [],
  );

  function openComposer() {
    setText("");
    setScope(null);
    setUrgency(null);
    setKind("need");
    setCategory("other");
    setTimeSlot("today");
    setStep("write");
    setVoiceMessage("");
    setPublishError(false);
    setLocation(null);
    setAreaLabel("");
    setLocationError("");
    setComposerOpen(true);
  }

  function closeComposer() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setRecording(false);
    setComposerOpen(false);
  }

  function startVoiceInput() {
    const SpeechRecognition = getSpeechConstructor();
    if (!SpeechRecognition) {
      setVoiceMessage(t("flash.voice.unsupported"));
      return;
    }

    recognitionRef.current?.stop();
    const recognition = new SpeechRecognition();
    recognition.lang = locale === "fr" ? "fr-FR" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .filter(Boolean)
        .join(" ");
      if (transcript) {
        setText((current) => (current.trim() ? `${current.trim()} ${transcript}` : transcript));
        setVoiceMessage(t("flash.voice.received"));
      }
    };
    recognition.onerror = (event) => {
      setVoiceMessage(
        event.error === "not-allowed" ? t("flash.voice.permission") : t("flash.voice.error"),
      );
    };
    recognition.onend = () => {
      setRecording(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    setVoiceMessage(t("flash.voice.listening"));
    setRecording(true);
    try {
      recognition.start();
    } catch {
      setRecording(false);
      recognitionRef.current = null;
      setVoiceMessage(t("flash.voice.error"));
    }
  }

  function continueToReview() {
    if (!parsedIntent || !text.trim()) return;
    setKind(parsedIntent.kind);
    setCategory(parsedIntent.category);
    setTimeSlot(parsedIntent.timeSlot);
    setStep("review");
  }

  async function detectFlashLocation() {
    if (!navigator.geolocation || locating) {
      setLocationError(t("flash.location.unavailable"));
      return;
    }
    setLocating(true);
    setLocationError("");
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 12_000,
        });
      });
      const point = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
      setLocation(point);
      try {
        const place = await reverseGeocodeFlashLocation({
          data: { latitude: point.latitude, longitude: point.longitude, consent: true },
        });
        setAreaLabel(place?.label ?? "");
        if (!place?.label) setLocationError(t("flash.location.manual"));
      } catch {
        setAreaLabel("");
        setLocationError(t("flash.location.manual"));
      }
    } catch (error) {
      const code = (error as GeolocationPositionError)?.code;
      setLocationError(
        code === 1
          ? t("flash.location.permission")
          : code === 3
            ? t("flash.location.timeout")
            : t("flash.location.error"),
      );
      setLocation(null);
    } finally {
      setLocating(false);
    }
  }

  async function saveFlashDraft() {
    if (!user || !scope || !urgency || !text.trim()) return;
    setPublishing(true);
    setPublishError(false);
    try {
      const body = text.trim();
      const savedFlash = await createFlash({
        authorId: user.id as UserId,
        title: body.length > 80 ? `${body.slice(0, 77)}…` : body,
        body,
        kind,
        category,
        timeSlot,
        scope,
        urgency,
        areaLabel: areaLabel.trim() || undefined,
        expiresAt: expiryFor(timeSlot),
      });
      publishFlashCommunicationEvent(communication, savedFlash, "draft-saved");
      closeComposer();
      onSaved();
    } catch {
      setPublishError(true);
    } finally {
      setPublishing(false);
    }
  }

  return {
    composerOpen,
    setComposerOpen,
    step,
    setStep,
    text,
    setText,
    kind,
    setKind,
    category,
    setCategory,
    timeSlot,
    setTimeSlot,
    scope,
    setScope,
    urgency,
    setUrgency,
    recording,
    setRecording,
    voiceMessage,
    setVoiceMessage,
    publishing,
    publishError,
    setPublishError,
    location,
    setLocation,
    areaLabel,
    setAreaLabel,
    locating,
    locationError,
    setLocationError,
    parsedIntent,
    speechSupported,
    recognitionRef,
    openComposer,
    closeComposer,
    startVoiceInput,
    continueToReview,
    detectFlashLocation,
    saveFlashDraft,
    categories: CATEGORIES,
    timeSlots: TIME_SLOTS,
  };
}
