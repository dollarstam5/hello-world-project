import { createLazyFileRoute } from "@tanstack/react-router";
import { HomeFoundation } from "@/composition/experiences/home/HomeFoundation";

export const Route = createLazyFileRoute("/")({
  component: HomeFoundation,
});
