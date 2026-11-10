BEGIN;

-- A discovery session is a short-lived, purpose-specific permission to observe
-- nearby public presences. It is independent from publishing one's own presence.
CREATE TABLE public.reel_discovery_sessions (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  zone_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (user_id, zone_key),
  CONSTRAINT reel_discovery_zone_key CHECK (zone_key ~ '^z1_[a-f0-9]{56}$'),
  CONSTRAINT reel_discovery_expiry CHECK (expires_at > created_at)
);
CREATE INDEX reel_discovery_sessions_expiry
  ON public.reel_discovery_sessions (expires_at);
ALTER TABLE public.reel_discovery_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.reel_discovery_sessions FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.reel_discovery_sessions TO service_role;

-- A one-use grant prevents clients from inventing a zone key when publishing.
CREATE TABLE public.reel_zone_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  zone_key TEXT NOT NULL,
  purpose TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  CONSTRAINT reel_zone_grant_zone_key CHECK (zone_key ~ '^z1_[a-f0-9]{56}$'),
  CONSTRAINT reel_zone_grant_purpose CHECK (purpose = 'presence'),
  CONSTRAINT reel_zone_grant_expiry CHECK (expires_at > created_at)
);
CREATE INDEX reel_zone_grants_expiry
  ON public.reel_zone_grants (expires_at);
ALTER TABLE public.reel_zone_grants ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.reel_zone_grants FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.reel_zone_grants TO service_role;

-- Discovery no longer requires the user to publish their own presence.
CREATE OR REPLACE FUNCTION public.reel_can_read_zone(p_zone_key TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.profiles profile
      WHERE profile.id = auth.uid()
        AND profile.status = 'active'
        AND profile.deleted_at IS NULL
    )
    AND (
      EXISTS (
        SELECT 1 FROM public.reel_presences own_presence
        WHERE own_presence.owner_id = auth.uid()
          AND own_presence.zone_key = p_zone_key
          AND own_presence.status = 'active'
          AND own_presence.expires_at > (extract(epoch FROM now()) * 1000)::bigint
      )
      OR EXISTS (
        SELECT 1 FROM public.reel_discovery_sessions discovery
        WHERE discovery.user_id = auth.uid()
          AND discovery.zone_key = p_zone_key
          AND discovery.expires_at > now()
      )
    );
$$;
REVOKE ALL ON FUNCTION public.reel_can_read_zone(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reel_can_read_zone(TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.list_reel_discovery_presence(p_limit INTEGER DEFAULT 30)
RETURNS TABLE (
  presence_id UUID,
  user_id UUID,
  display_name TEXT,
  avatar_media_id UUID,
  area_label TEXT,
  description TEXT,
  radius_m INTEGER,
  started_at BIGINT,
  expires_at BIGINT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_user_id UUID := public.reel_require_active_profile();
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.reel_discovery_sessions discovery
    WHERE discovery.user_id = v_user_id AND discovery.expires_at > now()
  ) THEN
    RAISE EXCEPTION 'reel_discovery_consent_required' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT DISTINCT ON (presence.id)
    presence.id,
    presence.owner_id,
    profile.display_name,
    profile.avatar_media_id,
    presence.area_label,
    presence.description,
    presence.radius_m,
    presence.started_at,
    presence.expires_at
  FROM public.reel_presences presence
  JOIN public.profiles profile ON profile.id = presence.owner_id
  JOIN public.reel_discovery_sessions discovery
    ON discovery.user_id = v_user_id
   AND discovery.zone_key = presence.zone_key
   AND discovery.expires_at > now()
  WHERE presence.owner_id <> v_user_id
    AND presence.status = 'active'
    AND presence.expires_at > (extract(epoch FROM now()) * 1000)::bigint
    AND profile.status = 'active'
    AND profile.deleted_at IS NULL
  ORDER BY presence.id, presence.started_at DESC
  LIMIT least(greatest(coalesce(p_limit, 30), 1), 50);
END;
$$;
REVOKE ALL ON FUNCTION public.list_reel_discovery_presence(INTEGER) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_reel_discovery_presence(INTEGER) TO authenticated;

-- The browser cannot choose a zone key directly. It must consume a short-lived
-- one-use grant created by the authenticated server resolver.
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
SET search_path = pg_catalog, public
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
  FROM public.reel_zone_grants
  WHERE id = p_zone_grant_id
    AND owner_id = v_user_id
    AND purpose = 'presence'
    AND consumed_at IS NULL
    AND expires_at > now()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'reel_zone_grant_invalid_or_expired' USING ERRCODE = '42501';
  END IF;

  UPDATE public.reel_zone_grants
  SET consumed_at = now()
  WHERE id = v_grant.id;

  SELECT public.start_reel_presence(
    v_grant.zone_key,
    p_area_label,
    p_description,
    p_radius_m,
    p_duration_minutes,
    p_consent
  ) INTO v_presence;

  RETURN v_presence;
END;
$$;

REVOKE ALL ON FUNCTION public.start_reel_presence(TEXT, TEXT, TEXT, INTEGER, INTEGER, BOOLEAN)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.start_reel_presence_from_grant(UUID, TEXT, TEXT, INTEGER, INTEGER, BOOLEAN)
  TO authenticated;

-- Remove expired ephemeral grants on each resolver pass; no scheduled job required.
CREATE OR REPLACE FUNCTION public.purge_reel_location_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_deleted INTEGER := 0;
  v_count INTEGER := 0;
BEGIN
  DELETE FROM public.reel_discovery_sessions WHERE expires_at <= now();
  GET DIAGNOSTICS v_count = ROW_COUNT;
  v_deleted := v_deleted + v_count;
  DELETE FROM public.reel_zone_grants WHERE expires_at <= now() OR consumed_at IS NOT NULL;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  v_deleted := v_deleted + v_count;
  RETURN v_deleted;
END;
$$;
REVOKE ALL ON FUNCTION public.purge_reel_location_sessions() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_reel_location_sessions() TO service_role;


CREATE OR REPLACE FUNCTION public.get_my_active_reel_presence()
RETURNS SETOF public.reel_presences
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $
  SELECT presence.*
  FROM public.reel_presences presence
  WHERE presence.owner_id = public.reel_require_active_profile()
    AND presence.status = 'active'
    AND presence.expires_at > (extract(epoch FROM now()) * 1000)::bigint
  LIMIT 1;
$;
REVOKE ALL ON FUNCTION public.get_my_active_reel_presence() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_active_reel_presence() TO authenticated;

COMMIT;
