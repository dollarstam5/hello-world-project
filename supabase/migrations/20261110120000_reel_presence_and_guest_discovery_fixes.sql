BEGIN;

-- Fix the composite assignment: SELECT a composite-returning function INTO a
-- row variable must expand its columns, otherwise PostgreSQL treats the row
-- text as the first UUID field.
CREATE OR REPLACE FUNCTION public.start_reel_presence_from_grant(
  p_zone_grant_id UUID,
  p_area_label TEXT,
  p_description TEXT,
  p_radius_m INTEGER,
  p_duration_minutes INTEGER,
  p_consent BOOLEAN
)
RETURNS public.reel_presences
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_user_id UUID := public.reel_require_active_profile();
  v_grant public.reel_zone_grants;
  v_presence public.reel_presences;
BEGIN
  IF p_consent IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'presence_consent_required' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_grant
  FROM public.reel_zone_grants grant_row
  WHERE grant_row.id = p_zone_grant_id
    AND grant_row.owner_id = v_user_id
    AND grant_row.purpose = 'presence'
    AND grant_row.consumed_at IS NULL
    AND grant_row.expires_at > now()
    AND grant_row.location IS NOT NULL
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'reel_zone_grant_invalid_or_expired' USING ERRCODE = '42501';
  END IF;

  UPDATE public.reel_zone_grants
  SET consumed_at = now()
  WHERE id = v_grant.id;

  SELECT * INTO v_presence
  FROM public.start_reel_presence(
    v_grant.zone_key,
    p_area_label,
    p_description,
    p_radius_m,
    p_duration_minutes,
    p_consent
  );

  INSERT INTO public.reel_presence_locations (presence_id, location, created_at, expires_at)
  VALUES (v_presence.id, v_grant.location, now(), to_timestamp(v_presence.expires_at / 1000.0));

  DELETE FROM public.reel_zone_grants WHERE id = v_grant.id;
  RETURN v_presence;
END;
$$;

-- Qualify session expiry fields because RETURNS TABLE exposes an expires_at
-- PL/pgSQL output variable with the same name.
CREATE OR REPLACE FUNCTION public.list_reel_guest_presence_for_member(p_limit INTEGER DEFAULT 30)
RETURNS TABLE (
  presence_id UUID,
  display_name TEXT,
  avatar_key TEXT,
  area_label TEXT,
  description TEXT,
  radius_m INTEGER,
  started_at BIGINT,
  expires_at BIGINT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_user_id UUID := public.reel_require_active_profile();
  v_discovery extensions.geography;
BEGIN
  SELECT discovery.location INTO v_discovery
  FROM public.reel_discovery_locations discovery
  WHERE discovery.user_id = v_user_id AND discovery.expires_at > now();
  IF v_discovery IS NULL THEN
    RAISE EXCEPTION 'reel_discovery_consent_required' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT guest.id, guest.display_name, guest.avatar_key, guest.area_label,
    guest.description, guest.radius_m,
    (extract(epoch FROM guest.started_at) * 1000)::bigint,
    (extract(epoch FROM guest.expires_at) * 1000)::bigint
  FROM public.reel_guest_presences guest
  JOIN public.reel_guest_sessions guest_session
    ON guest_session.id = guest.guest_session_id
  WHERE guest.status = 'active' AND guest.expires_at > now()
    AND guest_session.revoked_at IS NULL
    AND guest_session.expires_at > now()
    AND extensions.ST_DWithin(v_discovery, guest.location, guest.radius_m)
  ORDER BY guest.started_at DESC
  LIMIT least(greatest(coalesce(p_limit, 30), 1), 50);
END;
$$;

CREATE OR REPLACE FUNCTION public.list_reel_guest_discovery_presence(
  p_guest_session_id UUID,
  p_limit INTEGER DEFAULT 30
)
RETURNS TABLE (
  presence_id UUID,
  actor_kind TEXT,
  display_name TEXT,
  avatar_media_id UUID,
  avatar_key TEXT,
  area_label TEXT,
  description TEXT,
  radius_m INTEGER,
  started_at BIGINT,
  expires_at BIGINT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_discovery extensions.geography;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service_role_required' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.reel_guest_sessions guest_session
    WHERE guest_session.id = p_guest_session_id
      AND guest_session.purpose = 'reel_guest'
      AND guest_session.revoked_at IS NULL
      AND guest_session.expires_at > now()
  ) THEN
    RAISE EXCEPTION 'active_guest_session_required' USING ERRCODE = '42501';
  END IF;

  SELECT discovery.location INTO v_discovery
  FROM public.reel_guest_discovery_locations discovery
  WHERE discovery.guest_session_id = p_guest_session_id
    AND discovery.expires_at > now();
  IF v_discovery IS NULL THEN
    RAISE EXCEPTION 'reel_discovery_consent_required' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT candidates.presence_id, candidates.actor_kind, candidates.display_name,
    candidates.avatar_media_id, candidates.avatar_key, candidates.area_label,
    candidates.description, candidates.radius_m, candidates.started_at, candidates.expires_at
  FROM (
    SELECT presence.id AS presence_id, 'member'::text AS actor_kind,
      profile.display_name, profile.avatar_media_id, NULL::text AS avatar_key,
      presence.area_label, presence.description, presence.radius_m,
      presence.started_at, presence.expires_at
    FROM public.reel_presences presence
    JOIN public.reel_presence_locations published
      ON published.presence_id = presence.id AND published.expires_at > now()
    JOIN public.profiles profile ON profile.id = presence.owner_id
    WHERE presence.status = 'active'
      AND presence.expires_at > (extract(epoch FROM now()) * 1000)::bigint
      AND profile.status = 'active' AND profile.deleted_at IS NULL
      AND extensions.ST_DWithin(v_discovery, published.location, presence.radius_m)
    UNION ALL
    SELECT guest.id, 'guest'::text, guest.display_name, NULL::uuid,
      guest.avatar_key, guest.area_label, guest.description, guest.radius_m,
      (extract(epoch FROM guest.started_at) * 1000)::bigint,
      (extract(epoch FROM guest.expires_at) * 1000)::bigint
    FROM public.reel_guest_presences guest
    JOIN public.reel_guest_sessions guest_session
      ON guest_session.id = guest.guest_session_id
    WHERE guest.guest_session_id <> p_guest_session_id
      AND guest.status = 'active' AND guest.expires_at > now()
      AND guest_session.revoked_at IS NULL
      AND guest_session.expires_at > now()
      AND extensions.ST_DWithin(v_discovery, guest.location, guest.radius_m)
  ) candidates
  ORDER BY candidates.started_at DESC
  LIMIT least(greatest(coalesce(p_limit, 30), 1), 50);
END;
$$;

COMMIT;
