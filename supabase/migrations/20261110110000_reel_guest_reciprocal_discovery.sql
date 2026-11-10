BEGIN;

-- A guest's discovery permission is independent from publishing a presence.
-- Its exact point is short-lived and readable only by service_role.
CREATE TABLE public.reel_guest_discovery_locations (
  guest_session_id UUID PRIMARY KEY REFERENCES public.reel_guest_sessions(id) ON DELETE CASCADE,
  location extensions.geography(Point, 4326) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT reel_guest_discovery_expiry CHECK (expires_at > created_at AND expires_at <= created_at + interval '16 minutes')
);
CREATE INDEX reel_guest_discovery_locations_geography
  ON public.reel_guest_discovery_locations USING GIST (location);
CREATE INDEX reel_guest_discovery_locations_expiry
  ON public.reel_guest_discovery_locations (expires_at);

ALTER TABLE public.reel_guest_discovery_locations ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.reel_guest_discovery_locations FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.reel_guest_discovery_locations TO service_role;

CREATE OR REPLACE FUNCTION public.create_reel_guest_discovery_location(
  p_guest_session_id UUID,
  p_latitude DOUBLE PRECISION,
  p_longitude DOUBLE PRECISION,
  p_expires_at TIMESTAMPTZ
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service_role_required' USING ERRCODE = '42501';
  END IF;
  IF p_latitude IS NULL OR p_latitude NOT BETWEEN -90 AND 90
    OR p_longitude IS NULL OR p_longitude NOT BETWEEN -180 AND 180
    OR p_expires_at <= now() OR p_expires_at > now() + interval '16 minutes'
  THEN
    RAISE EXCEPTION 'invalid_reel_guest_discovery_location' USING ERRCODE = '22023';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.reel_guest_sessions
    WHERE id = p_guest_session_id AND purpose = 'reel_guest'
      AND revoked_at IS NULL AND expires_at > now()
  ) THEN
    RAISE EXCEPTION 'active_guest_session_required' USING ERRCODE = '42501';
  END IF;
  INSERT INTO public.reel_guest_discovery_locations
    (guest_session_id, location, created_at, expires_at)
  VALUES (
    p_guest_session_id,
    extensions.ST_SetSRID(extensions.ST_MakePoint(p_longitude, p_latitude), 4326)::extensions.geography,
    now(), p_expires_at
  )
  ON CONFLICT (guest_session_id) DO UPDATE
    SET location = EXCLUDED.location,
        created_at = EXCLUDED.created_at,
        expires_at = EXCLUDED.expires_at;
END;
$$;

-- A member can see temporary guest cards, but never guest session identifiers
-- or exact coordinates. The publisher's radius controls visibility.
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
  SELECT location INTO v_discovery
  FROM public.reel_discovery_locations
  WHERE user_id = v_user_id AND expires_at > now();
  IF v_discovery IS NULL THEN
    RAISE EXCEPTION 'reel_discovery_consent_required' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT guest.id, guest.display_name, guest.avatar_key, guest.area_label,
    guest.description, guest.radius_m,
    (extract(epoch FROM guest.started_at) * 1000)::bigint,
    (extract(epoch FROM guest.expires_at) * 1000)::bigint
  FROM public.reel_guest_presences guest
  JOIN public.reel_guest_sessions session ON session.id = guest.guest_session_id
  WHERE guest.status = 'active' AND guest.expires_at > now()
    AND session.revoked_at IS NULL AND session.expires_at > now()
    AND extensions.ST_DWithin(v_discovery, guest.location, guest.radius_m)
  ORDER BY guest.started_at DESC
  LIMIT least(greatest(coalesce(p_limit, 30), 1), 50);
END;
$$;

-- Guest discovery returns a safe mixed card list. The guest's own presence is
-- excluded; member and guest publishers each enforce their own visibility radius.
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
    SELECT 1 FROM public.reel_guest_sessions
    WHERE id = p_guest_session_id AND purpose = 'reel_guest'
      AND revoked_at IS NULL AND expires_at > now()
  ) THEN
    RAISE EXCEPTION 'active_guest_session_required' USING ERRCODE = '42501';
  END IF;
  SELECT location INTO v_discovery
  FROM public.reel_guest_discovery_locations
  WHERE guest_session_id = p_guest_session_id AND expires_at > now();
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
      presence.started_at,
      presence.expires_at
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
    JOIN public.reel_guest_sessions session ON session.id = guest.guest_session_id
    WHERE guest.guest_session_id <> p_guest_session_id
      AND guest.status = 'active' AND guest.expires_at > now()
      AND session.revoked_at IS NULL AND session.expires_at > now()
      AND extensions.ST_DWithin(v_discovery, guest.location, guest.radius_m)
  ) candidates
  ORDER BY candidates.started_at DESC
  LIMIT least(greatest(coalesce(p_limit, 30), 1), 50);
END;
$$;

REVOKE ALL ON FUNCTION public.create_reel_guest_discovery_location(UUID, DOUBLE PRECISION, DOUBLE PRECISION, TIMESTAMPTZ)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.list_reel_guest_discovery_presence(UUID, INTEGER)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.list_reel_guest_presence_for_member(INTEGER)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_reel_guest_discovery_location(UUID, DOUBLE PRECISION, DOUBLE PRECISION, TIMESTAMPTZ)
  TO service_role;
GRANT EXECUTE ON FUNCTION public.list_reel_guest_discovery_presence(UUID, INTEGER)
  TO service_role;
GRANT EXECUTE ON FUNCTION public.list_reel_guest_presence_for_member(INTEGER)
  TO authenticated;

CREATE OR REPLACE FUNCTION public.purge_reel_guest_presences()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  DELETE FROM public.reel_guest_discovery_locations
  WHERE expires_at <= now()
     OR guest_session_id IN (
       SELECT id FROM public.reel_guest_sessions
       WHERE revoked_at IS NOT NULL OR expires_at <= now()
     );
  GET DIAGNOSTICS v_count = ROW_COUNT;
  DELETE FROM public.reel_guest_presences
  WHERE expires_at <= now()
     OR guest_session_id IN (
       SELECT id FROM public.reel_guest_sessions
       WHERE revoked_at IS NOT NULL OR expires_at <= now()
     );
  RETURN v_count + (SELECT count(*)::integer FROM public.reel_guest_presences WHERE false);
END;
$$;

COMMIT;
