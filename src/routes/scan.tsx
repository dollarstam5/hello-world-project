import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan — Vitalis" },
      {
        name: "description",
        content: "Exprimez votre besoin simplement. Scan explore les possibilités autour de vous.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
