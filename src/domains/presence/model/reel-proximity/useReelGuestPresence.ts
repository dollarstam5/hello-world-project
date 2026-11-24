import { useEffect, useState } from "react";
import { getMyReelGuestPresence } from "@/domains/presence/api/reel-guest-session.functions";

type Access = {
  loading: boolean;
  mode: string;
  guest?: { startedAt?: number } | null;
};

export function useReelGuestPresence(
  access: Access,
  t: (key: string) => string,
  setDuration: (value: string) => void,
  setRadius: (value: string) => void,
  setPresenceDescription: (value: string) => void,
  setPresenceMessage: (message: string | null) => void,
) {
  const [guestDisplayName, setGuestDisplayName] = useState("");
  const [guestAreaLabel, setGuestAreaLabel] = useState(t("reel.controller.nearby"));
  const [guestAvatarKey, setGuestAvatarKey] = useState("avatar-blue");
  const [guestPresence, setGuestPresence] = useState<{
    id: string;
    display_name: string;
    avatar_key: string;
    area_label: string;
    description: string;
    radius_m: number;
    started_at: string;
    expires_at: string;
  } | null>(null);

  
  useEffect(() => {
    if (access.loading || access.mode !== "guest") {
      if (access.mode !== "guest") setGuestPresence(null);
      return;
    }
    let cancelled = false;
    setDuration("1 h");
    void getMyReelGuestPresence()
      .then((presence) => {
        if (cancelled) return;
        setGuestPresence(presence);
        if (presence) {
          setGuestDisplayName(presence.display_name);
          setGuestAreaLabel(presence.area_label);
          setGuestAvatarKey(presence.avatar_key);
          setPresenceDescription(presence.description);
          const radiusLabel = presence.radius_m === 1000 ? "1 km" : `${presence.radius_m} m`;
          setRadius(radiusLabel);
          const remainingMinutes = Math.max(
            0,
            Math.round((Date.parse(presence.expires_at) - Date.now()) / 60_000),
          );
          const durationLabel =
            remainingMinutes <= 30
              ? "30 min"
              : remainingMinutes <= 60
                ? "1 h"
                : remainingMinutes <= 120
                  ? "2 h"
                  : remainingMinutes <= 180
                    ? "3 h"
                    : remainingMinutes <= 360
                      ? "6 h"
                      : remainingMinutes <= 720
                        ? "12 h"
                        : "24 h";
          setDuration(durationLabel);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setPresenceMessage(
            error instanceof Error ? error.message : t("reel.controller.guestPresenceMissing"),
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [access.loading, access.mode, access.guest?.startedAt, t, setDuration, setRadius, setPresenceDescription, setPresenceMessage]);

  
  return {
    guestDisplayName,
    setGuestDisplayName,
    guestAreaLabel,
    setGuestAreaLabel,
    guestAvatarKey,
    setGuestAvatarKey,
    guestPresence,
    setGuestPresence,
  };
}
