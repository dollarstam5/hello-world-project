import { createFileRoute } from "@tanstack/react-router";
import { PublicProfilePreviewPage } from "@/components/experience/PublicProfilePreviewPage";

export const Route = createFileRoute("/espace/apercu")({
  head: () => ({ meta: [{ title: "Aperçu du profil — Vitalis" }] }),
  component: PublicProfilePreviewPage,
});
