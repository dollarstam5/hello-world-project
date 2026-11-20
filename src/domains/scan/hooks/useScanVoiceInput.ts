import { useEffect, useRef, useState } from "react";

type SpeechResult = { transcript?: string };
type SpeechRecognitionResult = ArrayLike<SpeechResult>;
type SpeechRecognitionEventLike = { results: ArrayLike<SpeechRecognitionResult> };
type SpeechRecognitionErrorLike = { error?: string };
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

export function useScanVoiceInput(locale: string, onTranscript: (value: string) => void) {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [recording, setRecording] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "received" | "unsupported" | "permission" | "error">("idle");

  const SpeechRecognition = typeof window === "undefined"
    ? undefined
    : (window as SpeechWindow).SpeechRecognition ?? (window as SpeechWindow).webkitSpeechRecognition;
  const supported = Boolean(SpeechRecognition);

  useEffect(() => () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }, []);

  const toggleRecording = () => {
    if (recording) {
      recognitionRef.current?.stop();
      return;
    }
    if (!SpeechRecognition) {
      setVoiceStatus("unsupported");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = locale === "fr" ? "fr-FR" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .filter(Boolean)
        .join(" ")
        .trim();
      if (transcript) {
        onTranscript(transcript);
        setVoiceStatus("received");
      }
    };
    recognition.onerror = (event) => {
      setVoiceStatus(event.error === "not-allowed" ? "permission" : "error");
    };
    recognition.onend = () => {
      setRecording(false);
      recognitionRef.current = null;
      setVoiceStatus((current) => current === "listening" ? "idle" : current);
    };
    recognitionRef.current = recognition;
    setRecording(true);
    setVoiceStatus("listening");
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setRecording(false);
      setVoiceStatus("error");
    }
  };

  return { supported, recording, voiceStatus, toggleRecording };
}
