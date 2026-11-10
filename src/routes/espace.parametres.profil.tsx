import { createFileRoute } from "@tanstack/react-router";
import { ProfileVisibilitySettingsPage } from "@/components/experience/ProfileVisibilitySettingsPage";

export const Route = createFileRoute("/espace/parametres/profil")({
  head: () => ({ meta: [{ title: "Paramètres du profil — Vitalis" }] }),
  component: ProfileVisibilitySettingsPage,
});
