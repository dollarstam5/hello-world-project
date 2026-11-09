import { Zap } from "lucide-react";
import { SectionFoundation } from "@/components/experience/SectionFoundation";
import { FlashComposer } from "./FlashComposer";
import { FlashFeed } from "./FlashFeed";

export function FlashSpace() {
  return (
    <SectionFoundation
      eyebrowKey="page.flash.eyebrow"
      titleKey="page.flash.title"
      descKey="page.flash.desc"
      tone="warning"
      icon={Zap}
      sections={[
        {
          key: "now",
          titleKey: "page.flash.section.now",
          perf: "short",
          render: () => (
            <div className="stack-4">
              <FlashComposer />
              <FlashFeed />
            </div>
          ),
        },
        { key: "soon", titleKey: "page.flash.section.soon", perf: "tall" },
      ]}
      footer="Vitalis · Flash"
    />
  );
}
