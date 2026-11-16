import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan — Vitalis" },
      {
        name: "description",
        content: "Repérez les Flash actifs dans la zone que vous choisissez.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
