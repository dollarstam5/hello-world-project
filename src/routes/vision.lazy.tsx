import { createLazyFileRoute } from "@tanstack/react-router";
import { VitalisVisionPage } from "@/components/experience/VitalisVisionPage";

export const Route = createLazyFileRoute("/vision")({
  component: VitalisVisionPage,
});
