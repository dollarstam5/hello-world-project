BEGIN;

-- Guest presences are isolated from auth.users/profiles and are never visible
-- through browser SQL roles. The server resolves the HttpOnly guest cookie first.
CREATE TABLE public.reel_guest_presences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_session_id UUID NOT NULL REFERENCES public.reel_guest_sessions(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_key TEXT NOT NULL,
  area_label TEXT NOT NULL,
  description TEXT NOT NULL,
  radius_m INTEGER NOT NULL,
  location extensions.geography(Point, 4326) NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  consented_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active',
  CONSTRAINT reel_guest_presence_name CHECK (char_length(btrim(display_name)) BETWEEN 1 AND 40),
  CONSTRAINT reel_guest_presence_avatar CHECK (avatar_key ~ '^[a-z0-9_-]{1,40}$'),
  CONSTRAINT reel_guest_presence_area CHECK (char_length(btrim(area_label)) BETWEEN 2 AND 80),
  CONSTRAINT reel_guest_presence_description CHECK (char_length(btrim(description)) BETWEEN 1 AND 180),
  CONSTRAINT reel_guest_presence_radius CHECK (radius_m IN (10, 25, 50, 100, 1000)),
  CONSTRAINT reel_guest_presence_expiry CHECK (expires_at > started_at AND expires_at <= started_at + interval '24 hours'),
  CONSTRAINT reel_guest_presence_status CHECK (status IN ('active', 'ended', 'expired')),
  CONSTRAINT reel_guest_presence_end_state CHECK (
    (status = 'active' AND ended_at IS NULL)
    OR (status IN ('ended', 'expired') AND ended_at IS NOT NULL)
  )
);

CREATE UNIQUE INDEX reel_guest_presence_one_active_per_session
  ON public.reel_guest_presences (guest_session_id)
  WHERE status = 'active';
CREATE INDEX reel_guest_presence_location_gist
  ON public.reel_guest_presences USING GIST (location);
CREATE INDEX reel_guest_presence_expiry
  ON public.reel_guest_presences (expires_at);

ALTER TABLE public.reel_guest_presences ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.reel_guest_presences FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.reel_guest_presences TO service_role;

CREATE OR REPLACE FUNCTION public.create_reel_guest_presence(
  p_guest_session_id UUID,
  p_display_name TEXT,
  p_avatar_key TEXT,
  p_area_label TEXT,
  p_description TEXT,
  p_radius_m INTEGER,
  p_latitude DOUBLE PRECISION,
  p_longitude DOUBLE PRECISION,
  p_duration_minutes INTEGER,
  p_consent BOOLEAN
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_presence_id UUID;
  v_session_expires TIMESTAMPTZ;
  v_now TIMESTAMPTZ := clock_timestamp();
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service_role_required' USING ERRCODE = '42501';
  END IF;
  IF p_consent IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'guest_presence_consent_required' USING ERRCODE = '42501';
  END IF;
  IF p_display_name IS NULL OR char_length(btrim(p_display_name)) NOT BETWEEN 1 AND 40
    OR p_avatar_key IS NULL OR p_avatar_key !~ '^[a-z0-9_-]{1,40}$'
    OR p_area_label IS NULL OR char_length(btrim(p_area_label)) NOT BETWEEN 2 AND 80
    OR p_description IS NULL OR char_length(btrim(p_description)) NOT BETWEEN 1 AND 180
    OR p_radius_m IS NULL OR p_radius_m NOT IN (10, 25, 50, 100, 1000)
    OR p_latitude IS NULL OR p_latitude NOT BETWEEN -90 AND 90
    OR p_longitude IS NULL OR p_longitude NOT BETWEEN -180 AND 180
    OR p_duration_minutes IS NULL OR p_duration_minutes NOT IN (30, 60, 120, 180, 360, 720, 1440)
  THEN
    RAISE EXCEPTION 'invalid_guest_presence_details' USING ERRCODE = '22023';
  END IF;

  SELECT expires_at INTO v_session_expires
  FROM public.reel_guest_sessions
  WHERE id = p_guest_session_id
    AND purpose = 'reel_guest'
    AND revoked_at IS NULL
    AND expires_at > v_now
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'active_guest_session_required' USING ERRCODE = '42501';
  END IF;

  -- Guest presence has no history: remove the previous point and record entirely.
  DELETE FROM public.reel_guest_presences
  WHERE guest_session_id = p_guest_session_id;

  INSERT INTO public.reel_guest_presences (
    guest_session_id, display_name, avatar_key, area_label, description,
    radius_m, location, started_at, expires_at, consented_at, status
  ) VALUES (
    p_guest_session_id, btrim(p_display_name), p_avatar_key, btrim(p_area_label), btrim(p_description),
    p_radius_m,
    extensions.ST_SetSRID(extensions.ST_MakePoint(p_longitude, p_latitude), 4326)::extensions.geography,
    v_now, LEAST(v_now + make_interval(mins => p_duration_minutes), v_session_expires), v_now, 'active'
  ) RETURNING id INTO v_presence_id;

  RETURN v_presence_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.end_reel_guest_presence(
  p_guest_session_id UUID,
  p_presence_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service_role_required' USING ERRCODE = '42501';
  END IF;
  DELETE FROM public.reel_guest_presences
  WHERE id = p_presence_id
    AND guest_session_id = p_guest_session_id
    AND status = 'active';
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.purge_reel_guest_presences()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  DELETE FROM public.reel_guest_presences
  WHERE expires_at <= now()
     OR guest_session_id IN (
       SELECT id FROM public.reel_guest_sessions
       WHERE revoked_at IS NOT NULL OR expires_at <= now()
     );
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

REVOKE ALL ON FUNCTION public.create_reel_guest_presence(UUID,TEXT,TEXT,TEXT,TEXT,INTEGER,DOUBLE PRECISION,DOUBLE PRECISION,INTEGER,BOOLEAN)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.end_reel_guest_presence(UUID,UUID)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.purge_reel_guest_presences()
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_reel_guest_presence(UUID,TEXT,TEXT,TEXT,TEXT,INTEGER,DOUBLE PRECISION,DOUBLE PRECISION,INTEGER,BOOLEAN)
  TO service_role;
GRANT EXECUTE ON FUNCTION public.end_reel_guest_presence(UUID,UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.purge_reel_guest_presences() TO service_role;

DO $cron$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    BEGIN
      PERFORM cron.schedule(
        'reel-expired-guest-presence-cleanup',
        '* * * * *',
        'SELECT public.purge_reel_guest_presences();'
      );
    EXCEPTION
      WHEN duplicate_object OR unique_violation THEN NULL;
      WHEN undefined_function OR invalid_schema_name THEN NULL;
    END;
  END IF;
END;
$cron$;

COMMENT ON TABLE public.reel_guest_presences IS
  'Temporary guest presence, isolated from Auth users and profiles. Exact point is service-role-only and removed on expiry/session revocation.';

COMMIT;
