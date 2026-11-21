import { useEffect, useState } from "react";
import {
  getMyActiveReelPresence,
  type ReelPresence,
} from "@/domains/presence/api/reel-presence.client";

type Access = {
  mode: string;
  memberProfileState?: string;
  loading: boolean;
  memberId?: string | null;
};

type PresenceState = {
  memberId: string;
  presence: ReelPresence | null;
};

export function useReelMemberPresence(
  access: Access,
  t: (key: string) => string,
  setPresenceMessage: (message: string | null) => void,
) {
  const [loadedPresence, setLoadedPresence] = useState<PresenceState | null>(null);

  useEffect(() => {
    let cancelled = false;
    const memberId = access.memberId;
    if (
      access.mode !== "member" ||
      access.memberProfileState !== "active" ||
      access.loading ||
      !memberId
    ) {
      return;
    }
    void getMyActiveReelPresence()
      .then((presence) => {
        if (!cancelled) setLoadedPresence({ memberId, presence });
      })
      .catch(() => {
        if (!cancelled) setPresenceMessage(t("reel.controller.presenceCheckFailed"));
      });
    return () => {
      cancelled = true;
    };
  }, [access.mode, access.memberProfileState, access.loading, access.memberId, t, setPresenceMessage]);

  const currentPresence =
    access.mode === "member" &&
    access.memberProfileState === "active" &&
    loadedPresence?.memberId === access.memberId
      ? loadedPresence.presence
      : null;
  const canUseMemberReel =
    access.mode === "member" && access.memberProfileState === "active" && !access.loading;

  return { loadedPresence, setLoadedPresence, currentPresence, canUseMemberReel };
}
