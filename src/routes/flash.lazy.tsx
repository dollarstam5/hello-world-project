import { createLazyFileRoute } from "@tanstack/react-router";
import { FlashExperienceScreen } from "@/modules/flash/ui/FlashExperienceScreen";

export const Route = createLazyFileRoute("/flash")({
  component: FlashExperienceScreen,
});
