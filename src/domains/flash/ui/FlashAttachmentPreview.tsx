import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/useI18n";
import { listLocalFlashAttachments, useLocalQuery } from "@/platform/offline";

type FlashAttachmentPreviewProps = { flashId: string; mediaIds: string[] };

export function FlashAttachmentPreview({ flashId, mediaIds }: FlashAttachmentPreviewProps) {
  const { t } = useI18n();
  const files = useLocalQuery(() => listLocalFlashAttachments(flashId), [flashId]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  useEffect(() => {
    const created = Object.fromEntries(
      (files ?? []).map((file) => [file.id, URL.createObjectURL(file.blob)]),
    );
    setUrls(created);
    return () => Object.values(created).forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  if (!mediaIds.length) {
    return <p className="text-muted-foreground">{t("flash.mine.detailNoMedia")}</p>;
  }
  if (files === undefined) {
    return <p className="text-xs text-muted-foreground">{t("flash.mine.localMediaLoading")}</p>;
  }
  if (!files.length) {
    return <p className="text-xs text-muted-foreground">{t("flash.mine.localMediaMissing")}</p>;
  }

  return (
    <ul className="grid gap-3">
      {files.map((file) => (
        <li key={file.id} className="rounded-xl border border-border p-3">
          <p className="truncate text-sm font-medium">{file.fileName}</p>
          <p className="text-xs text-muted-foreground">
            {file.mimeType} · {(file.byteSize / 1024 / 1024).toFixed(2)} Mo ·{" "}
            {t("flash.mine.localOnly")}
          </p>
          {file.mimeType.startsWith("image/") && urls[file.id] ? (
            <img
              src={urls[file.id]}
              alt={file.fileName}
              className="mt-2 max-h-64 w-full rounded-lg object-contain"
            />
          ) : file.mimeType.startsWith("video/") && urls[file.id] ? (
            <video
              src={urls[file.id]}
              controls
              preload="metadata"
              className="mt-2 max-h-64 w-full rounded-lg"
            />
          ) : file.mimeType.startsWith("audio/") && urls[file.id] ? (
            <audio src={urls[file.id]} controls preload="metadata" className="mt-2 w-full" />
          ) : null}
          {urls[file.id] ? (
            <a
              href={urls[file.id]}
              target="_blank"
              rel="noopener noreferrer"
              download={file.fileName}
              className="mt-2 inline-flex min-h-10 items-center rounded-full border border-border px-3 text-sm font-semibold text-primary"
            >
              {t("flash.mine.openLocalFile")}
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
