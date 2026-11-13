import { supabase } from "@/integrations/supabase/client";

/**
 * Resolve only the signed-in member's own profile avatar.
 *
 * The public profile projection is deliberately not used here: Instant's
 * center is the current member's private self-view, not a public profile card.
 * A missing, local, deleted, foreign-owned or unresolvable asset falls back
 * to the neutral in-app avatar.
 */
export async function getMyProfileAvatarUrl(memberId: string): Promise<string | null> {
  if (!memberId) return null;

  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("avatar_media_id")
      .eq("id", memberId)
      .eq("status", "active")
      .is("deleted_at", null)
      .maybeSingle();

    if (profileError || !profile?.avatar_media_id) return null;

    const { data: media, error: mediaError } = await supabase
      .from("media")
      .select("remote_path,owner_id,kind,state,deleted_at")
      .eq("id", profile.avatar_media_id)
      .eq("owner_id", memberId)
      .eq("kind", "image")
      .eq("state", "remote")
      .is("deleted_at", null)
      .maybeSingle();

    if (mediaError || !media?.remote_path) return null;

    const path = media.remote_path.replace(/^\/+/, "");
    const segments = path.split("/");
    if (
      !path.startsWith(`${memberId}/`) ||
      segments.some((segment) => !segment || segment === "." || segment === "..") ||
      path.includes("\\")
    ) {
      return null;
    }

    const { data: signed, error: storageError } = await supabase.storage
      .from("avatars")
      .createSignedUrl(path, 60 * 60);

    if (storageError || !signed?.signedUrl) return null;
    return signed.signedUrl;
  } catch {
    return null;
  }
}
