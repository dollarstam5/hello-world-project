import { MapPin } from "lucide-react";
import { SectionFoundation } from "@/components/experience/SectionFoundation";

export function RadarSpace() {
  return (
    <SectionFoundation
      eyebrowKey="page.radar.eyebrow"
      titleKey="page.radar.title"
      descKey="page.radar.desc"
      tone="info"
      icon={MapPin}
      sections={[
        { key: "near", titleKey: "page.radar.section.near", perf: "short" },
        { key: "area", titleKey: "page.radar.section.area", perf: "tall" },
      ]}
      footer="Vitalis · Radar"
    />
  );
}
