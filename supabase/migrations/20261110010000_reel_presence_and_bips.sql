BEGIN;

-- Réel stores only an opaque approximate zone token. Exact GPS coordinates
-- are intentionally absent from this schema.
CREATE TABLE public.reel_presences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  zone_key TEXT NOT NULL,
  area_label TEXT NOT NULL,
  description TEXT NOT NULL,
  radius_m INTEGER NOT NULL,
  started_at BIGINT NOT NULL,
  expires_at BIGINT NOT NULL,
  ended_at BIGINT,
  consented_at BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT reel_presence_zone_key CHECK (zone_key ~ '^[a-z0-9_-]{8,64}$'),
  CONSTRAINT reel_presence_area_label CHECK (char_length(btrim(area_label)) BETWEEN 2 AND 80),
  CONSTRAINT reel_presence_description CHECK (char_length(btrim(description)) BETWEEN 1 AND 180),
  CONSTRAINT reel_presence_radius CHECK (radius_m IN (10, 25, 50, 100, 250, 500, 1000)),
  CONSTRAINT reel_presence_duration CHECK (expires_at > started_at AND expires_at - started_at IN (
    1800000, 3600000, 7200000, 10800000, 21600000, 43200000, 86400000
  )),
  CONSTRAINT reel_presence_status CHECK (status IN ('active', 'ended', 'expired')),
  CONSTRAINT reel_presence_end_state CHECK (
    (status = 'active' AND ended_at IS NULL)
    OR (status IN ('ended', 'expired') AND ended_at IS NOT NULL)
  )
);

CREATE UNIQUE INDEX reel_presence_one_active_per_owner
  ON public.reel_presences (owner_id)
  WHERE status = 'active';

CREATE INDEX reel_presence_zone_active
  ON public.reel_presences (zone_key, expires_at)
  WHERE status = 'active';

ALTER TABLE public.reel_presences ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.reel_presences FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.reel_presences TO authenticated;

CREATE TABLE public.reel_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_low UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_high UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ,
  closed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT reel_connection_pair CHECK (participant_low < participant_high),
  CONSTRAINT reel_connection_distinct CHECK (participant_low <> participant_high),
  CONSTRAINT reel_connection_status CHECK (status IN ('active', 'closed')),
  CONSTRAINT reel_connection_closed_state CHECK (
    (status = 'active' AND closed_at IS NULL AND closed_by IS NULL)
    OR (status = 'closed' AND closed_at IS NOT NULL AND closed_by IS NOT NULL)
  ),
  UNIQUE (participant_low, participant_high)
);

ALTER TABLE public.reel_connections ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.reel_connections FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.reel_connections TO authenticated;

CREATE TABLE public.reel_bips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_request_id UUID NOT NULL UNIQUE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_presence_id UUID NOT NULL REFERENCES public.reel_presences(id) ON DELETE CASCADE,
  recipient_presence_id UUID NOT NULL REFERENCES public.reel_presences(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  expires_at BIGINT NOT NULL,
  resolved_at BIGINT,
  CONSTRAINT reel_bip_distinct_people CHECK (sender_id <> recipient_id),
  CONSTRAINT reel_bip_status CHECK (status IN ('pending', 'accepted', 'declined', 'withdrawn', 'expired')),
  CONSTRAINT reel_bip_expiry CHECK (expires_at > created_at),
  CONSTRAINT reel_bip_resolution CHECK (
    (status = 'pending' AND resolved_at IS NULL)
    OR (status <> 'pending' AND resolved_at IS NOT NULL)
  )
);

CREATE UNIQUE INDEX reel_bip_one_pending_per_pair
  ON public.reel_bips (LEAST(sender_id, recipient_id), GREATEST(sender_id, recipient_id))
  WHERE status = 'pending';

CREATE INDEX reel_bip_participants_expiry
  ON public.reel_bips (recipient_id, sender_id, expires_at)
  WHERE status = 'pending';

ALTER TABLE public.reel_bips ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.reel_bips FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.reel_bips TO authenticated;

CREATE OR REPLACE FUNCTION public.reel_can_read_zone(p_zone_key TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1
    FROM public.reel_presences own_presence
    WHERE own_presence.owner_id = auth.uid()
      AND own_presence.zone_key = p_zone_key
      AND own_presence.status = 'active'
      AND own_presence.expires_at > (extract(epoch FROM now()) * 1000)::bigint
  );
$$;

REVOKE ALL ON FUNCTION public.reel_can_read_zone(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reel_can_read_zone(TEXT) TO authenticated;

CREATE POLICY reel_presence_owner_or_same_active_zone
  ON public.reel_presences
  FOR SELECT TO authenticated
  USING (
    (owner_id = auth.uid() AND status = 'active' AND expires_at > (extract(epoch FROM now()) * 1000)::bigint)
    OR (
      status = 'active'
      AND expires_at > (extract(epoch FROM clock_timestamp()) * 1000)::bigint
      AND public.reel_can_read_zone(zone_key)
    )
  );

CREATE POLICY reel_connection_participants_read
  ON public.reel_connections
  FOR SELECT TO authenticated
  USING (auth.uid() IN (participant_low, participant_high));

CREATE POLICY reel_bip_participants_read
  ON public.reel_bips
  FOR SELECT TO authenticated
  USING (
    auth.uid() IN (sender_id, recipient_id)
    AND status = 'pending'
    AND expires_at > (extract(epoch FROM now()) * 1000)::bigint
  );

CREATE OR REPLACE FUNCTION public.start_reel_presence(
  p_zone_key TEXT,
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
  v_user_id UUID := auth.uid();
  v_now BIGINT := (extract(epoch FROM clock_timestamp()) * 1000)::bigint;
  v_old public.reel_presences;
  v_new public.reel_presences;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'authentication_required' USING ERRCODE = '42501';
  END IF;
  IF p_consent IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'presence_consent_required' USING ERRCODE = '42501';
  END IF;
  IF p_zone_key IS NULL OR p_zone_key !~ '^[a-z0-9_-]{8,64}$'
    OR p_area_label IS NULL OR char_length(btrim(p_area_label)) NOT BETWEEN 2 AND 80
    OR p_description IS NULL OR char_length(btrim(p_description)) NOT BETWEEN 1 AND 180
    OR p_radius_m NOT IN (10, 25, 50, 100, 250, 500, 1000)
    OR p_duration_minutes NOT IN (30, 60, 120, 180, 360, 720, 1440)
  THEN
    RAISE EXCEPTION 'invalid_presence_details' USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = v_user_id AND status = 'active' AND deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'active_profile_required' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_old
  FROM public.reel_presences
  WHERE owner_id = v_user_id AND status = 'active'
  FOR UPDATE;

  IF FOUND THEN
    UPDATE public.reel_presences
    SET status = CASE WHEN expires_at <= v_now THEN 'expired' ELSE 'ended' END,
        ended_at = LEAST(v_now, expires_at),
        updated_at = now()
    WHERE id = v_old.id;

    UPDATE public.reel_bips
    SET expires_at = LEAST(expires_at, LEAST(v_now, v_old.expires_at) + 86400000),
        updated_at = v_now
    WHERE status = 'pending'
      AND (sender_presence_id = v_old.id OR recipient_presence_id = v_old.id);
  END IF;

  INSERT INTO public.reel_presences (
    owner_id, zone_key, area_label, description, radius_m,
    started_at, expires_at, consented_at, status
  ) VALUES (
    v_user_id, p_zone_key, btrim(p_area_label), btrim(p_description), p_radius_m,
    v_now, v_now + (p_duration_minutes * 60000), v_now, 'active'
  )
  RETURNING * INTO v_new;

  RETURN v_new;
END;
$$;

CREATE OR REPLACE FUNCTION public.end_reel_presence(p_presence_id UUID)
RETURNS public.reel_presences
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_now BIGINT := (extract(epoch FROM clock_timestamp()) * 1000)::bigint;
  v_presence public.reel_presences;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'authentication_required' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_presence
  FROM public.reel_presences
  WHERE id = p_presence_id AND owner_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'presence_not_found' USING ERRCODE = '42501';
  END IF;

  IF v_presence.status = 'active' THEN
    UPDATE public.reel_presences
    SET status = CASE WHEN expires_at <= v_now THEN 'expired' ELSE 'ended' END,
        ended_at = LEAST(v_now, expires_at),
        updated_at = now()
    WHERE id = p_presence_id
    RETURNING * INTO v_presence;

    UPDATE public.reel_bips
    SET expires_at = LEAST(expires_at, LEAST(v_now, v_presence.expires_at) + 86400000),
        updated_at = v_now
    WHERE status = 'pending'
      AND (sender_presence_id = p_presence_id OR recipient_presence_id = p_presence_id);
  END IF;

  RETURN v_presence;
END;
$$;

CREATE OR REPLACE FUNCTION public.list_reel_presence(p_zone_key TEXT, p_limit INTEGER DEFAULT 30)
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
BEGIN
  IF auth.uid() IS NULL OR NOT public.reel_can_read_zone(p_zone_key) THEN
    RAISE EXCEPTION 'active_presence_in_zone_required' USING ERRCODE = '42501';
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
  JOIN public.profiles profile ON profile.id = presence.owner_id
  WHERE presence.zone_key = p_zone_key
    AND presence.owner_id <> auth.uid()
    AND presence.status = 'active'
    AND presence.expires_at > (extract(epoch FROM clock_timestamp()) * 1000)::bigint
    AND profile.status = 'active'
    AND profile.deleted_at IS NULL
  ORDER BY presence.started_at DESC
  LIMIT least(greatest(coalesce(p_limit, 30), 1), 50);
END;
$$;

CREATE OR REPLACE FUNCTION public.purge_expired_reel_bips()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM public.reel_bips
  WHERE status IN ('pending', 'declined', 'withdrawn', 'expired')
    AND expires_at <= (extract(epoch FROM now()) * 1000)::bigint;
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$;

REVOKE ALL ON FUNCTION public.purge_expired_reel_bips() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_expired_reel_bips() TO service_role;

CREATE OR REPLACE FUNCTION public.send_reel_bip(
  p_recipient_presence_id UUID,
  p_client_request_id UUID
)
RETURNS public.reel_bips
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_now BIGINT := (extract(epoch FROM clock_timestamp()) * 1000)::bigint;
  v_sender public.reel_presences;
  v_recipient public.reel_presences;
  v_bip public.reel_bips;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'authentication_required' USING ERRCODE = '42501';
  END IF;
  IF p_client_request_id IS NULL THEN
    RAISE EXCEPTION 'client_request_id_required' USING ERRCODE = '22023';
  END IF;

  PERFORM public.purge_expired_reel_bips();

  SELECT * INTO v_bip
  FROM public.reel_bips
  WHERE client_request_id = p_client_request_id;

  IF FOUND THEN
    IF v_bip.sender_id <> v_user_id THEN
      RAISE EXCEPTION 'request_id_not_owned' USING ERRCODE = '42501';
    END IF;
    RETURN v_bip;
  END IF;

  SELECT * INTO v_sender
  FROM public.reel_presences
  WHERE owner_id = v_user_id
    AND status = 'active'
    AND expires_at > v_now
  FOR SHARE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'active_sender_presence_required' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_recipient
  FROM public.reel_presences
  WHERE id = p_recipient_presence_id
    AND status = 'active'
    AND expires_at > v_now
  FOR SHARE;

  IF NOT FOUND OR v_recipient.owner_id = v_user_id THEN
    RAISE EXCEPTION 'active_recipient_presence_required' USING ERRCODE = '42501';
  END IF;

  IF v_sender.zone_key <> v_recipient.zone_key THEN
    RAISE EXCEPTION 'recipient_outside_shared_zone' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.reel_bips (
    client_request_id, sender_id, recipient_id,
    sender_presence_id, recipient_presence_id,
    status, created_at, updated_at, expires_at
  ) VALUES (
    p_client_request_id, v_user_id, v_recipient.owner_id,
    v_sender.id, v_recipient.id,
    'pending', v_now, v_now,
    least(v_sender.expires_at, v_recipient.expires_at) + 86400000
  )
  ON CONFLICT DO NOTHING
  RETURNING * INTO v_bip;

  IF NOT FOUND THEN
    SELECT * INTO v_bip
    FROM public.reel_bips
    WHERE client_request_id = p_client_request_id
       OR (
         status = 'pending'
         AND LEAST(sender_id, recipient_id) = LEAST(v_user_id, v_recipient.owner_id)
         AND GREATEST(sender_id, recipient_id) = GREATEST(v_user_id, v_recipient.owner_id)
       )
    ORDER BY (client_request_id = p_client_request_id) DESC
    LIMIT 1;
  END IF;

  IF v_bip.id IS NULL THEN
    RAISE EXCEPTION 'bip_creation_failed' USING ERRCODE = '40001';
  END IF;

  RETURN v_bip;
END;
$$;

CREATE OR REPLACE FUNCTION public.command_reel_bip(p_bip_id UUID, p_action TEXT)
RETURNS public.reel_bips
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_now BIGINT := (extract(epoch FROM clock_timestamp()) * 1000)::bigint;
  v_bip public.reel_bips;
  v_low UUID;
  v_high UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'authentication_required' USING ERRCODE = '42501';
  END IF;
  IF p_action NOT IN ('accept', 'decline', 'withdraw') THEN
    RAISE EXCEPTION 'invalid_bip_action' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_bip
  FROM public.reel_bips
  WHERE id = p_bip_id
    AND auth.uid() IN (sender_id, recipient_id)
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'bip_not_found' USING ERRCODE = '42501';
  END IF;

  IF v_bip.status = CASE p_action
    WHEN 'accept' THEN 'accepted'
    WHEN 'decline' THEN 'declined'
    WHEN 'withdraw' THEN 'withdrawn'
  END THEN
    RETURN v_bip;
  END IF;

  IF v_bip.status <> 'pending' THEN
    RAISE EXCEPTION 'bip_no_longer_pending' USING ERRCODE = '22023';
  END IF;

  IF v_bip.expires_at <= v_now THEN
    UPDATE public.reel_bips
    SET status = 'expired', resolved_at = v_now, updated_at = v_now
    WHERE id = v_bip.id
    RETURNING * INTO v_bip;
    RETURN v_bip;
  END IF;

  IF p_action IN ('accept', 'decline') AND v_bip.recipient_id <> v_user_id THEN
    RAISE EXCEPTION 'recipient_action_required' USING ERRCODE = '42501';
  END IF;
  IF p_action = 'withdraw' AND v_bip.sender_id <> v_user_id THEN
    RAISE EXCEPTION 'sender_action_required' USING ERRCODE = '42501';
  END IF;

  UPDATE public.reel_bips
  SET status = CASE p_action
        WHEN 'accept' THEN 'accepted'
        WHEN 'decline' THEN 'declined'
        ELSE 'withdrawn'
      END,
      resolved_at = v_now,
      updated_at = v_now
  WHERE id = v_bip.id
  RETURNING * INTO v_bip;

  IF p_action = 'accept' THEN
    v_low := least(v_bip.sender_id, v_bip.recipient_id);
    v_high := greatest(v_bip.sender_id, v_bip.recipient_id);
    INSERT INTO public.reel_connections (participant_low, participant_high)
    VALUES (v_low, v_high)
    ON CONFLICT (participant_low, participant_high) DO NOTHING;
  END IF;

  RETURN v_bip;
END;
$$;

CREATE OR REPLACE FUNCTION public.list_reel_bips()
RETURNS SETOF public.reel_bips
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'authentication_required' USING ERRCODE = '42501';
  END IF;

  DELETE FROM public.reel_bips
  WHERE status IN ('pending', 'declined', 'withdrawn')
    AND expires_at <= (extract(epoch FROM clock_timestamp()) * 1000)::bigint
    AND auth.uid() IN (sender_id, recipient_id);

  RETURN QUERY
  SELECT bip.*
  FROM public.reel_bips bip
  WHERE auth.uid() IN (bip.sender_id, bip.recipient_id)
    AND bip.status = 'pending'
    AND bip.expires_at > (extract(epoch FROM clock_timestamp()) * 1000)::bigint
  ORDER BY bip.created_at DESC
  LIMIT 100;
END;
$$;

REVOKE ALL ON FUNCTION public.start_reel_presence(TEXT, TEXT, TEXT, INTEGER, INTEGER, BOOLEAN) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.end_reel_presence(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.list_reel_presence(TEXT, INTEGER) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.send_reel_bip(UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.command_reel_bip(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.list_reel_bips() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.start_reel_presence(TEXT, TEXT, TEXT, INTEGER, INTEGER, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.end_reel_presence(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_reel_presence(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_reel_bip(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.command_reel_bip(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_reel_bips() TO authenticated;

COMMENT ON TABLE public.reel_presences IS
  'Ephemeral opted-in presence. Stores an opaque approximate zone key only; never exact GPS coordinates.';
COMMENT ON TABLE public.reel_bips IS
  'Short-lived bip requests. Pending requests are private to the two participants and are not copied to notifications.';
COMMENT ON TABLE public.reel_connections IS
  'Durable pairwise relationship created when a recipient accepts a Reel bip.';

DO $
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    BEGIN
      PERFORM cron.schedule(
        'reel-expired-bip-cleanup',
        '*/15 * * * *',
        'SELECT public.purge_expired_reel_bips();'
      );
    EXCEPTION
      WHEN duplicate_object THEN NULL;
      WHEN undefined_function OR invalid_schema_name THEN NULL;
    END;
  END IF;
END;
$;

-- Supabase Postgres Changes can fan out only rows permitted by each subscriber's RLS.
ALTER TABLE public.reel_presences REPLICA IDENTITY FULL;
ALTER TABLE public.reel_bips REPLICA IDENTITY FULL;
ALTER TABLE public.reel_connections REPLICA IDENTITY FULL;

DO $
DECLARE
  v_table TEXT;
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    FOREACH v_table IN ARRAY ARRAY['reel_presences', 'reel_bips', 'reel_connections'] LOOP
      BEGIN
        EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', v_table);
      EXCEPTION WHEN duplicate_object THEN
        NULL;
      END;
    END LOOP;
  END IF;
END;
$;

COMMIT;
