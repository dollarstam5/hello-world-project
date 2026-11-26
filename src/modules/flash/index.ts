/**
 * Flash module entrypoint.
 * Exposes the stable module marker, shared Flash card, and local data API.
 * Feature-specific screens, hooks and server functions remain explicit imports.
 */
export const FLASH_DOMAIN = "flash" as const;
export { FlashCard } from "./ui/FlashCard";
export { PublicProfilePreview } from "./ui/PublicProfilePreview";
export { FlashExperienceScreen } from "./ui/FlashExperienceScreen";
export * from "./data";
