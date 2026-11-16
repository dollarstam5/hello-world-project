import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Gestion — Écosystème" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "Poste de pilotage de l'écosystème." },
    ],
  }),
});
