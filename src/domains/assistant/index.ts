export const ASSISTANT_DOMAIN = "assistant" as const;
export * from "@/platform/ai";
export { useAssistantChat, type ChatMessage } from "./model/useAssistantChat";
