import flashPhoto from "@/assets/images/experience/vision-flash.webp";
import scanPhoto from "@/assets/images/experience/vision-scan.webp";
import reelPhoto from "@/assets/images/experience/vision-reel.webp";
import radarPhoto from "@/assets/images/experience/vision-radar.webp";

export type VisionEngineId = "flash" | "scan" | "reel" | "radar";

type ArtworkLabels = {
  alt: string;
  flashTag: string;
  flashTitle: string;
  flashDescription: string;
  today: string;
  nearby: string;
  flashFooter: string;
  scan: string;
  live: string;
  radarSearch: string;
  radarCriteria: string;
  radarNew: string;
  radarSource: string;
  radarActions: string;
};

/** Licensed photographs (sources and credits: docs/00-foundation/photo-credits.md). */
const PHOTOS: Record<VisionEngineId, { src: string; position: string }> = {
  flash: { src: flashPhoto, position: "50% 40%" },
  scan: { src: scanPhoto, position: "50% 30%" },
  reel: { src: reelPhoto, position: "50% 45%" },
  radar: { src: radarPhoto, position: "65% 35%" },
};

function chipLabel(kind: VisionEngineId, labels: ArtworkLabels): string {
  if (kind === "flash") return labels.flashTag;
  if (kind === "scan") return labels.scan;
  if (kind === "reel") return labels.live;
  return labels.radarSearch;
}

export function VisionEngineArtwork({
  kind,
  labels,
}: {
  kind: VisionEngineId;
  labels: ArtworkLabels;
}) {
  const photo = PHOTOS[kind];
  return (
    <figure className="relative mx-auto aspect-[4/3] w-full min-w-0 max-w-md max-h-[22rem] overflow-hidden rounded-[2rem] border border-border/70 bg-muted shadow-sm">
      <img
        src={photo.src}
        alt={labels.alt}
        width={960}
        height={720}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 z-0 block size-full object-cover"
        style={{ objectPosition: photo.position }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background/45 via-transparent to-transparent"
      />
      <span className="absolute bottom-4 left-4 z-20 max-w-[calc(100%-2rem)] truncate rounded-full border border-border/70 bg-card/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-lg backdrop-blur">
        {chipLabel(kind, labels)}
      </span>
    </figure>
  );
}
