BEGIN;

-- PostGIS is used only inside private server-side tables and RPCs.
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;

ALTER TABLE public.reel_zone_grants
  ADD COLUMN location extensions.geography(Point, 4326);

CREATE TABLE public.reel_discovery_locations (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  location extensions.geography(Point, 4326) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT reel_discovery_location_expiry CHECK (expires_at > created_at)
);
CREATE INDEX reel_discovery_locations_expiry
  ON public.reel_discovery_locations (expires_at);

CREATE TABLE public.reel_presence_locations (
  presence_id UUID PRIMARY KEY REFERENCES public.reel_presences(id) ON DELETE CASCADE,
  location extensions.geography(Point, 4326) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT reel_presence_location_expiry CHECK (expires_at > created_at)
);
CREATE INDEX reel_presence_locations_geography
  ON public.reel_presence_locations USING GIST (location);
CREATE INDEX reel_presence_locations_expiry
  ON public.reel_presence_locations (expires_at);

ALTER TABLE public.reel_discovery_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reel_presence_locations ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.reel_discovery_locations, public.reel_presence_locations
  FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.reel_discovery_locations, public.reel_presence_locations TO service_role;
GRANT ALL ON public.reel_zone_grants TO service_role;

CREATE OR REPLACE FUNCTION public.create_reel_discovery_location(
  p_user_id UUID,
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
    RAISE EXCEPTION 'invalid_reel_discovery_location' USING ERRCODE = '22023';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = p_user_id AND status = 'active' AND deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'active_profile_required' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.reel_discovery_locations (user_id, location, created_at, expires_at)
  VALUES (
    p_user_id,
    extensions.ST_SetSRID(extensions.ST_MakePoint(p_longitude, p_latitude), 4326)::extensions.geography,
    now(),
    p_expires_at
  )
  ON CONFLICT (user_id) DO UPDATE
    SET location = EXCLUDED.location,
        created_at = EXCLUDED.created_at,
        expires_at = EXCLUDED.expires_at;
END;
$$;
REVOKE ALL ON FUNCTION public.create_reel_discovery_location(UUID, DOUBLE PRECISION, DOUBLE PRECISION, TIMESTAMPTZ)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_reel_discovery_location(UUID, DOUBLE PRECISION, DOUBLE PRECISION, TIMESTAMPTZ)
  TO service_role;

CREATE OR REPLACE FUNCTION public.create_reel_zone_grant_with_location(
  p_owner_id UUID,
  p_zone_key TEXT,
  p_latitude DOUBLE PRECISION,
  p_longitude DOUBLE PRECISION,
  p_expires_at TIMESTAMPTZ
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_grant_id UUID;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service_role_required' USING ERRCODE = '42501';
  END IF;
  IF p_latitude IS NULL OR p_latitude NOT BETWEEN -90 AND 90
    OR p_longitude IS NULL OR p_longitude NOT BETWEEN -180 AND 180
    OR p_zone_key IS NULL OR p_zone_key !~ '^z1_[a-f0-9]{56}$'
    OR p_expires_at <= now() OR p_expires_at > now() + interval '6 minutes'
  THEN
    RAISE EXCEPTION 'invalid_reel_presence_location' USING ERRCODE = '22023';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = p_owner_id AND status = 'active' AND deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'active_profile_required' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.reel_zone_grants (owner_id, zone_key, purpose, expires_at, location)
  VALUES (
    p_owner_id,
    p_zone_key,
    'presence',
    p_expires_at,
    extensions.ST_SetSRID(extensions.ST_MakePoint(p_longitude, p_latitude), 4326)::extensions.geography
  )
  RETURNING id INTO v_grant_id;
  RETURN v_grant_id;
END;
$$;
REVOKE ALL ON FUNCTION public.create_reel_zone_grant_with_location(UUID, TEXT, DOUBLE PRECISION, DOUBLE PRECISION, TIMESTAMPTZ)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_reel_zone_grant_with_location(UUID, TEXT, DOUBLE PRECISION, DOUBLE PRECISION, TIMESTAMPTZ)
  TO service_role;

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
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_user_id UUID := public.reel_require_active_profile();
  v_discovery extensions.geography;
BEGIN
  SELECT discovery.location INTO v_discovery
  FROM public.reel_discovery_locations discovery
  WHERE discovery.user_id = v_user_id
    AND discovery.expires_at > now();

  IF v_discovery IS NULL THEN
    RAISE EXCEPTION 'reel_discovery_consent_required' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
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
  JOIN public.reel_presence_locations published_location
    ON published_location.presence_id = presence.id
   AND published_location.expires_at > now()
  JOIN public.profiles profile ON profile.id = presence.owner_id
  WHERE presence.owner_id <> v_user_id
    AND presence.status = 'active'
    AND presence.expires_at > (extract(epoch FROM now()) * 1000)::bigint
    AND profile.status = 'active'
    AND profile.deleted_at IS NULL
    AND extensions.ST_DWithin(v_discovery, published_location.location, presence.radius_m)
  ORDER BY presence.started_at DESC
  LIMIT least(greatest(coalesce(p_limit, 30), 1), 50);
END;
$$;
REVOKE ALL ON FUNCTION public.list_reel_discovery_presence(INTEGER) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_reel_discovery_presence(INTEGER) TO authenticated;

CREATE OR REPLACE FUNCTION public.send_reel_bip(p_recipient_presence_id UUID,p_client_request_id UUID)
RETURNS public.reel_bips LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public, extensions AS $
DECLARE
  v_user_id UUID := public.reel_require_active_profile();
  v_now BIGINT := (extract(epoch FROM clock_timestamp()) * 1000)::bigint;
  v_sender public.reel_presences;
  v_recipient public.reel_presences;
  v_sender_location extensions.geography;
  v_recipient_location extensions.geography;
  v_bip public.reel_bips;
BEGIN
  IF p_client_request_id IS NULL THEN RAISE EXCEPTION 'client_request_id_required' USING ERRCODE = '22023'; END IF;
  PERFORM public.purge_expired_reel_bips();
  SELECT * INTO v_bip FROM public.reel_bips WHERE client_request_id = p_client_request_id;
  IF FOUND THEN
    IF v_bip.sender_id <> v_user_id THEN RAISE EXCEPTION 'request_id_not_owned' USING ERRCODE = '42501'; END IF;
    RETURN v_bip;
  END IF;
  SELECT * INTO v_sender FROM public.reel_presences
  WHERE owner_id = v_user_id AND status = 'active' AND expires_at > v_now FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION 'active_sender_presence_required' USING ERRCODE = '42501'; END IF;
  SELECT * INTO v_recipient FROM public.reel_presences
  WHERE id = p_recipient_presence_id AND status = 'active' AND expires_at > v_now FOR SHARE;
  IF NOT FOUND OR v_recipient.owner_id = v_user_id THEN
    RAISE EXCEPTION 'active_recipient_presence_required' USING ERRCODE = '42501';
  END IF;
  SELECT location INTO v_sender_location FROM public.reel_presence_locations
  WHERE presence_id = v_sender.id AND expires_at > now();
  SELECT location INTO v_recipient_location FROM public.reel_presence_locations
  WHERE presence_id = v_recipient.id AND expires_at > now();
  IF v_sender_location IS NULL OR v_recipient_location IS NULL
    OR NOT extensions.ST_DWithin(v_sender_location, v_recipient_location, v_recipient.radius_m) THEN
    RAISE EXCEPTION 'recipient_outside_visibility_radius' USING ERRCODE = '42501';
  END IF;
  INSERT INTO public.reel_bips (
    client_request_id,sender_id,recipient_id,sender_presence_id,recipient_presence_id,status,created_at,updated_at,expires_at
  ) VALUES (
    p_client_request_id,v_user_id,v_recipient.owner_id,v_sender.id,v_recipient.id,'pending',v_now,v_now,
    least(v_sender.expires_at,v_recipient.expires_at)+86400000
  ) ON CONFLICT DO NOTHING RETURNING * INTO v_bip;
  IF NOT FOUND THEN
    SELECT * INTO v_bip FROM public.reel_bips
    WHERE client_request_id=p_client_request_id OR (status='pending'
      AND LEAST(sender_id,recipient_id)=LEAST(v_user_id,v_recipient.owner_id)
      AND GREATEST(sender_id,recipient_id)=GREATEST(v_user_id,v_recipient.owner_id))
    ORDER BY (client_request_id=p_client_request_id) DESC LIMIT 1;
  END IF;
  IF v_bip.id IS NULL THEN RAISE EXCEPTION 'bip_creation_failed' USING ERRCODE = '40001'; END IF;
  RETURN v_bip;
END;
$;
REVOKE ALL ON FUNCTION public.send_reel_bip(UUID,UUID) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.send_reel_bip(UUID,UUID) TO authenticated;

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
  FROM public.reel_zone_grants
  WHERE id = p_zone_grant_id
    AND owner_id = v_user_id
    AND purpose = 'presence'
    AND consumed_at IS NULL
    AND expires_at > now()
    AND location IS NOT NULL
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

  INSERT INTO public.reel_presence_locations (presence_id, location, created_at, expires_at)
  VALUES (v_presence.id, v_grant.location, now(), to_timestamp(v_presence.expires_at / 1000.0));

  -- The one-use grant has served its purpose; remove its duplicate exact point.
  DELETE FROM public.reel_zone_grants WHERE id = v_grant.id;

  RETURN v_presence;
END;
$$;
REVOKE ALL ON FUNCTION public.start_reel_presence_from_grant(UUID, TEXT, TEXT, INTEGER, INTEGER, BOOLEAN)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.start_reel_presence_from_grant(UUID, TEXT, TEXT, INTEGER, INTEGER, BOOLEAN)
  TO authenticated;

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
  DELETE FROM public.reel_discovery_locations WHERE expires_at <= now();
  GET DIAGNOSTICS v_count = ROW_COUNT;
  v_deleted := v_deleted + v_count;
  DELETE FROM public.reel_presence_locations location
  USING public.reel_presences presence
  WHERE location.presence_id = presence.id
    AND (presence.status <> 'active' OR presence.expires_at <= (extract(epoch FROM now()) * 1000)::bigint
      OR location.expires_at <= now());
  GET DIAGNOSTICS v_count = ROW_COUNT;
  v_deleted := v_deleted + v_count;
  RETURN v_deleted;
END;
$$;
REVOKE ALL ON FUNCTION public.purge_reel_location_sessions() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_reel_location_sessions() TO service_role;


DO $cron$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    BEGIN
      PERFORM cron.schedule(
        'reel-private-location-cleanup',
        '* * * * *',
        'SELECT public.purge_reel_location_sessions();'
      );
    EXCEPTION
      WHEN duplicate_object OR unique_violation THEN NULL;
      WHEN undefined_function OR invalid_schema_name THEN NULL;
    END;
  END IF;
END;
$cron$;

CREATE OR REPLACE FUNCTION public.reel_delete_presence_location_on_end()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF NEW.status <> 'active' THEN
    DELETE FROM public.reel_presence_locations WHERE presence_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.reel_delete_presence_location_on_end() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER reel_presence_location_cleanup
AFTER UPDATE OF status ON public.reel_presences
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION public.reel_delete_presence_location_on_end();

COMMENT ON TABLE public.reel_discovery_locations IS
  'Private, short-lived PostGIS discovery point. Service-role only; never returned to clients.';
COMMENT ON TABLE public.reel_presence_locations IS
  'Private, short-lived PostGIS point for an opted-in presence. Deleted when presence ends or expires; never returned to clients.';

COMMIT;
