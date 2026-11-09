import { createFileRoute } from "@tanstack/react-router";
import { SignInView } from "@/domains/auth/ui/SignInView";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion — Vitalis" },
      { name: "description", content: "Connectez-vous à Vitalis en toute sécurité." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Connexion — Vitalis" },
      { property: "og:description", content: "Connectez-vous à votre espace Vitalis." },
    ],
  }),
  component: SignInView,
});
