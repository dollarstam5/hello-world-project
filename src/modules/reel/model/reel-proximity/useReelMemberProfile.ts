import { useEffect, useState } from "react";
import { useAccessMode } from "@/modules/access-mode";
import { getMyProfileAvatarUrl } from "@/modules/profile/api/profile-avatar.client";

type AccessMode = ReturnType<typeof useAccessMode>;

export function useReelMemberProfile(access: AccessMode) {
  const [memberAvatarUrl, setMemberAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setMemberAvatarUrl(null);

    if (
      access.loading ||
      access.mode !== "member" ||
      !access.memberId ||
      access.memberProfileState !== "active"
    ) {
      return () => {
        active = false;
      };
    }

    void getMyProfileAvatarUrl(access.memberId).then((avatarUrl) => {
      if (active) setMemberAvatarUrl(avatarUrl);
    });

    return () => {
      active = false;
    };
  }, [access.loading, access.mode, access.memberId, access.memberProfileState]);

  return { memberAvatarUrl };
}
