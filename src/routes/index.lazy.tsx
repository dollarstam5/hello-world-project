import { createLazyFileRoute } from "@tanstack/react-router";
import { HomeFoundation } from "@/components/experience/HomeFoundation";

export const Route = createLazyFileRoute("/")({
  component: HomeFoundation,
});
