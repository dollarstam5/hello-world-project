import { createLazyFileRoute } from "@tanstack/react-router";
import { VitalisVisionPage } from "@/composition/experiences/vision/VitalisVisionPage";

export const Route = createLazyFileRoute("/vision")({
  component: VitalisVisionPage,
});
