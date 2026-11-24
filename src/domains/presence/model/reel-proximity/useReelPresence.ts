import { useState } from "react";
import { requestReelLocation } from "@/domains/presence/api/reel-location.client";
import { resolveReelZone } from "@/domains/presence/api/reel-zone.functions";
import {
  endReelPresence,
  startReelPresence,
  type ReelPresence,
} from "@/domains/presence/api/reel-presence.client";
import { endReelGuestPresence, getMyReelGuestPresence, startReelGuestPresence } from "@/domains/presence/api/reel-guest-session.functions";
import { useAccessMode } from "@/domains/access-mode";
import { evaluateReelAccess } from "@/domains/presence/policy/reel-access-policy";
import type { MessageKey } from "@/lib/i18n/messages";

type Translate = (key: MessageKey) => string;
type GuestPresence = {
  id: string;
  display_name: string;
  avatar_key: string;
  area_label: string;
  description: string;
  radius_m: number;
  started_at: string;
  expires_at: string;
} | null;

const DURATION_MINUTES: Record<string, number> = {
  "30 min": 30,
  "1 h": 60,
  "2 h": 120,
  "3 h": 180,
  "6 h": 360,
  "12 h": 720,
  "24 h": 1440,
};

export function useReelPresence({
  access,
  t,
}: {
  access: ReturnType<typeof useAccessMode>;
  t: Translate;
}) {
  const [radius, setRadius] = useState("100 m");
  const [duration, setDuration] = useState("2 h");
  const [presenceConsent, setPresenceConsent] = useState(false);
  const [guestPresenceConsent, setGuestPresenceConsent] = useState(false);
  const [presenceDescription, setPresenceDescription] = useState(t("reel.controller.presenceDescription"));
  const [presenceLoading, setPresenceLoading] = useState(false);
  const [presenceMessage, setPresenceMessage] = useState<string | null>(null);

  const activatePresence = async (setLoadedPresence: (value: { memberId: string; presence: ReelPresence | null }) => void) => {
    const decision = evaluateReelAccess(
      {
        access,
        presenceConsent: true,
        consents: ["reel_presence"],
        online: typeof navigator === "undefined" ? false : navigator.onLine,
      },
      "start_presence",
    );
    if (decision.status !== "server_check" || !presenceConsent) {
      setPresenceMessage(!presenceConsent ? t("reel.controller.consentRequired") : decision.message);
      return;
    }

    setPresenceLoading(true);
    setPresenceMessage(null);
    try {
      const fix = await requestReelLocation();
      const zone = await resolveReelZone({
        data: { latitude: fix.latitude, longitude: fix.longitude, purpose: "presence", consent: true },
      });
      if (!zone.grantId) throw new Error(t("reel.controller.presencePermissionFailed"));
      const radiusMeters = radius === "1 km" ? 1000 : Number.parseInt(radius, 10);
      const presence = await startReelPresence({
        zoneGrantId: zone.grantId,
        areaLabel: zone.areaLabel,
        description: presenceDescription,
        radiusMeters: radiusMeters as 10 | 25 | 50 | 100 | 1000,
        durationMinutes: DURATION_MINUTES[duration] as 30 | 60 | 120 | 180 | 360 | 720 | 1440,
        consent: true,
      });
      if (access.memberId) setLoadedPresence({ memberId: access.memberId, presence });
      setPresenceMessage(t("reel.controller.presenceVisible"));
    } catch (error) {
      setPresenceMessage(error instanceof Error ? error.message : t("reel.controller.presenceActivationFailed"));
    } finally {
      setPresenceLoading(false);
    }
  };

  const activateGuestPresence = async (guestProfile: {
    displayName: string;
    areaLabel: string;
    avatarKey: string;
  }, setGuestPresence: (value: GuestPresence) => void) => {
    if (access.mode !== "guest" || !guestPresenceConsent) {
      setPresenceMessage(t("reel.controller.visibilityConsent"));
      return;
    }
    const displayName = guestProfile.displayName.trim();
    const areaLabel = guestProfile.areaLabel.trim();
    const description = presenceDescription.trim();
    if (!displayName || !areaLabel || !description) {
      setPresenceMessage(t("reel.controller.guestFieldsRequired"));
      return;
    }
    setPresenceLoading(true);
    setPresenceMessage(null);
    try {
      const fix = await requestReelLocation();
      const radiusMeters = radius === "1 km" ? 1000 : Number.parseInt(radius, 10);
      const result = await startReelGuestPresence({
        data: {
          displayName,
          avatarKey: guestProfile.avatarKey,
          areaLabel,
          description,
          radiusM: radiusMeters as 10 | 25 | 50 | 100 | 1000,
          latitude: fix.latitude,
          longitude: fix.longitude,
          durationMinutes: Math.min(DURATION_MINUTES[duration], 60) as 30 | 60,
          consent: true,
        },
      });
      const nextPresence = await getMyReelGuestPresence();
      if (!nextPresence || nextPresence.id !== result.presenceId) throw new Error(t("reel.controller.presenceConfirmFailed"));
      setGuestPresence(nextPresence);
      setGuestPresenceConsent(false);
      setPresenceMessage(t("reel.controller.presenceVisibleNearby"));
    } catch (error) {
      setPresenceMessage(error instanceof Error ? error.message : t("reel.controller.presenceActivationFailed"));
    } finally {
      setPresenceLoading(false);
    }
  };

  const stopGuestPresence = async (guestPresence: NonNullable<GuestPresence>, setGuestPresence: (value: GuestPresence) => void) => {
    if (!guestPresence) return;
    setPresenceLoading(true);
    setPresenceMessage(null);
    try {
      const result = await endReelGuestPresence({ data: { presenceId: guestPresence.id } });
      if (!result.ended) throw new Error(t("reel.controller.presenceNotActive"));
      setGuestPresence(null);
      setPresenceMessage(t("reel.controller.presenceHidden"));
    } catch (error) {
      setPresenceMessage(error instanceof Error ? error.message : t("reel.controller.presenceStopFailed"));
    } finally {
      setPresenceLoading(false);
    }
  };

  const stopPresence = async (currentPresence: ReelPresence | null, setLoadedPresence: (value: { memberId: string; presence: ReelPresence | null }) => void) => {
    if (!currentPresence) return;
    setPresenceLoading(true);
    setPresenceMessage(null);
    try {
      const ended = await endReelPresence(currentPresence.id);
      if (access.memberId) setLoadedPresence({ memberId: access.memberId, presence: ended.status === "active" ? ended : null });
      setPresenceMessage(t("reel.controller.presenceHidden"));
    } catch (error) {
      setPresenceMessage(error instanceof Error ? error.message : t("reel.controller.presenceStopFailed"));
    } finally {
      setPresenceLoading(false);
    }
  };

  return {
    radius, setRadius, duration, setDuration, presenceConsent, setPresenceConsent,
    guestPresenceConsent, setGuestPresenceConsent, presenceDescription, setPresenceDescription,
    presenceLoading, presenceMessage, setPresenceMessage, activatePresence, activateGuestPresence,
    stopGuestPresence, stopPresence,
  };
}
