import { createFileRoute } from "@tanstack/react-router";
import { ProfileVisibilitySettingsPage } from "@/modules/profile/ui/pages/ProfileVisibilitySettingsPage";

export const Route = createFileRoute("/espace/parametres/profil")({
  head: () => ({ meta: [{ title: "Paramètres du profil — Vitalis" }] }),
  component: ProfileVisibilitySettingsPage,
});
