import { createFileRoute } from "@tanstack/react-router";
import { ApplicationSettingsPage } from "@/app/settings/ApplicationSettingsPage";

export const Route = createFileRoute("/espace/parametres/application")({
  head: () => ({ meta: [{ title: "Paramètres de l'application — Vitalis" }] }),
  component: ApplicationSettingsPage,
});
