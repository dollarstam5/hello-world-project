import { UsersRound } from "lucide-react";
import { SectionFoundation } from "@/components/experience/SectionFoundation";

export function ReelSpace() {
  return (
    <SectionFoundation
      eyebrowKey="page.reel.eyebrow"
      titleKey="page.reel.title"
      descKey="page.reel.desc"
      tone="primary"
      icon={UsersRound}
      sections={[
        { key: "presence", titleKey: "page.reel.section.presence", perf: "short" },
        { key: "nearby", titleKey: "page.reel.section.nearby", perf: "tall" },
        { key: "connections", titleKey: "page.reel.section.connections", perf: "tall" },
      ]}
      footer="Vitalis · Réel"
    />
  );
}
