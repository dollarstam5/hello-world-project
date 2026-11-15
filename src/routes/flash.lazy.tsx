import { createLazyFileRoute } from "@tanstack/react-router";
import { FlashExperienceScreen } from "@/domains/flash/ui/FlashExperienceScreen";

export const Route = createLazyFileRoute("/flash")({
  component: FlashExperienceScreen,
});
