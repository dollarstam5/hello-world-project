import { useState } from "react";
import { useAccessMode } from "@/domains/access-mode";
import type { MessageKey } from "@/lib/i18n/messages";

type Translate = (key: MessageKey) => string;

export function useReelGuestSession(access: ReturnType<typeof useAccessMode>, t: Translate) {
  const [guestSessionLoading, setGuestSessionLoading] = useState(false);
  const [guestSessionMessage, setGuestSessionMessage] = useState<string | null>(null);

  const beginGuestSession = async () => {
    setGuestSessionLoading(true);
    setGuestSessionMessage(null);
    try {
      await access.startGuestSession();
      setGuestSessionMessage(t("reel.controller.guestSessionReady"));
    } catch (error) {
      setGuestSessionMessage(
        error instanceof Error ? error.message : t("reel.controller.guestSessionOpenFailed"),
      );
    } finally {
      setGuestSessionLoading(false);
    }
  };

  return { guestSessionLoading, guestSessionMessage, beginGuestSession };
}
