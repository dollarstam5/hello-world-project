import { createLazyFileRoute } from "@tanstack/react-router";
import { FlashExperienceScreen } from "@/modules/flash";

export const Route = createLazyFileRoute("/flash")({
  component: FlashExperienceScreen,
});
