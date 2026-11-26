/**
 * Flash module entrypoint.
 * Exposes the stable module marker, shared Flash card, and local data API.
 * Feature-specific screens, hooks and server functions remain explicit imports.
 */
export const FLASH_DOMAIN = "flash" as const;
export { FlashCard } from "@/components/app/FlashCard";
export * from "./data";
