BEGIN;

-- Cross-mode interactions are deliberately isolated from member-only
-- reel_bips/reel_connections. A guest is represented only by its verified
-- temporary session; no synthetic auth.users/profiles row is created.
CREATE TABLE public.reel_guest_bips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_request_id UUID NOT NULL UNIQUE,
  sender_member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_guest_session_id UUID REFERENCES public.reel_guest_sessions(id) ON DELETE CASCADE,
  recipient_member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_guest_session_id UUID REFERENCES public.reel_guest_sessions(id) ON DELETE CASCADE,
  sender_presence_id UUID NOT NULL,
  recipient_presence_id UUID NOT NULL,
  sender_actor_key TEXT GENERATED ALWAYS AS (
    CASE WHEN sender_member_id IS NOT NULL THEN 'm:' || sender_member_id::text
         ELSE 'g:' || sender_guest_session_id::text END
  ) STORED,
  recipient_actor_key TEXT GENERATED ALWAYS AS (
    CASE WHEN recipient_member_id IS NOT NULL THEN 'm:' || recipient_member_id::text
         ELSE 'g:' || recipient_guest_session_id::text END
  ) STORED,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  CONSTRAINT reel_guest_bip_sender_actor CHECK (
    (sender_member_id IS NOT NULL AND sender_guest_session_id IS NULL)
    OR (sender_member_id IS NULL AND sender_guest_session_id IS NOT NULL)
  ),
  CONSTRAINT reel_guest_bip_recipient_actor CHECK (
    (recipient_member_id IS NOT NULL AND recipient_guest_session_id IS NULL)
    OR (recipient_member_id IS NULL AND recipient_guest_session_id IS NOT NULL)
  ),
  CONSTRAINT reel_guest_bip_distinct_actors CHECK (sender_actor_key <> recipient_actor_key),
  CONSTRAINT reel_guest_bip_status CHECK (status IN ('pending','accepted','declined','withdrawn','expired')),
  CONSTRAINT reel_guest_bip_resolution CHECK (
    (status = 'pending' AND resolved_at IS NULL)
    OR (status <> 'pending' AND resolved_at IS NOT NULL)
  ),
  CONSTRAINT reel_guest_bip_expiry CHECK (expires_at > created_at)
);
CREATE UNIQUE INDEX reel_guest_bip_one_pending_per_pair
  ON public.reel_guest_bips (
    LEAST(sender_actor_key, recipient_actor_key),
    GREATEST(sender_actor_key, recipient_actor_key)
  ) WHERE status = 'pending';
CREATE INDEX reel_guest_bip_recipient_pending
  ON public.reel_guest_bips (recipient_member_id, recipient_guest_session_id, created_at DESC)
  WHERE status = 'pending';

CREATE TABLE public.reel_guest_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_one_member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_one_guest_session_id UUID REFERENCES public.reel_guest_sessions(id) ON DELETE CASCADE,
  participant_two_member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_two_guest_session_id UUID REFERENCES public.reel_guest_sessions(id) ON DELETE CASCADE,
  participant_one_actor_key TEXT GENERATED ALWAYS AS (
    CASE WHEN participant_one_member_id IS NOT NULL THEN 'm:' || participant_one_member_id::text
         ELSE 'g:' || participant_one_guest_session_id::text END
  ) STORED,
  participant_two_actor_key TEXT GENERATED ALWAYS AS (
    CASE WHEN participant_two_member_id IS NOT NULL THEN 'm:' || participant_two_member_id::text
         ELSE 'g:' || participant_two_guest_session_id::text END
  ) STORED,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  closed_at TIMESTAMPTZ,
  closed_by_member_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  closed_by_guest_session_id UUID REFERENCES public.reel_guest_sessions(id) ON DELETE SET NULL,
  CONSTRAINT reel_guest_connection_one_actor CHECK (
    (participant_one_member_id IS NOT NULL AND participant_one_guest_session_id IS NULL)
    OR (participant_one_member_id IS NULL AND participant_one_guest_session_id IS NOT NULL)
  ),
  CONSTRAINT reel_guest_connection_two_actor CHECK (
    (participant_two_member_id IS NOT NULL AND participant_two_guest_session_id IS NULL)
    OR (participant_two_member_id IS NULL AND participant_two_guest_session_id IS NOT NULL)
  ),
  CONSTRAINT reel_guest_connection_distinct CHECK (participant_one_actor_key <> participant_two_actor_key),
  CONSTRAINT reel_guest_connection_status CHECK (status IN ('active','closed')),
  CONSTRAINT reel_guest_connection_closer CHECK (
    (closed_by_member_id IS NULL OR closed_by_guest_session_id IS NULL)
  ),
  CONSTRAINT reel_guest_connection_closed_state CHECK (
    (status = 'active' AND closed_at IS NULL AND closed_by_member_id IS NULL AND closed_by_guest_session_id IS NULL)
    OR (status = 'closed' AND closed_at IS NOT NULL
      AND (closed_by_member_id IS NOT NULL OR closed_by_guest_session_id IS NOT NULL))
  ),
  CONSTRAINT reel_guest_connection_expiry CHECK (expires_at > created_at)
);
CREATE UNIQUE INDEX reel_guest_connection_pair
  ON public.reel_guest_connections (
    LEAST(participant_one_actor_key, participant_two_actor_key),
    GREATEST(participant_one_actor_key, participant_two_actor_key)
  );
CREATE INDEX reel_guest_connection_member_lookup
  ON public.reel_guest_connections (participant_one_member_id, participant_two_member_id, expires_at);

ALTER TABLE public.reel_guest_bips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reel_guest_connections ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.reel_guest_bips, public.reel_guest_connections FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.reel_guest_bips, public.reel_guest_connections TO service_role;

CREATE OR REPLACE FUNCTION public.send_reel_bip_to_guest(
  p_recipient_guest_presence_id UUID,
  p_client_request_id UUID
)
RETURNS public.reel_guest_bips
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_member UUID := public.reel_require_active_profile();
  v_sender public.reel_presences;
  v_recipient public.reel_guest_presences;
  v_sender_location extensions.geography;
  v_bip public.reel_guest_bips;
  v_expiry TIMESTAMPTZ;
BEGIN
  IF auth.role() <> 'authenticated' OR p_client_request_id IS NULL THEN
    RAISE EXCEPTION 'authenticated_member_required' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_sender FROM public.reel_presences
    WHERE owner_id = v_member AND status = 'active'
      AND expires_at > (extract(epoch FROM now()) * 1000)::bigint FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION 'active_sender_presence_required' USING ERRCODE = '42501'; END IF;

  SELECT * INTO v_recipient FROM public.reel_guest_presences guest
    JOIN public.reel_guest_sessions session ON session.id = guest.guest_session_id
    WHERE guest.id = p_recipient_guest_presence_id AND guest.status = 'active'
      AND guest.expires_at > now() AND session.revoked_at IS NULL
      AND session.expires_at > now() FOR SHARE OF guest;
  IF NOT FOUND THEN RAISE EXCEPTION 'active_guest_recipient_required' USING ERRCODE = '42501'; END IF;

  SELECT location INTO v_sender_location FROM public.reel_presence_locations
    WHERE presence_id = v_sender.id AND expires_at > now();
  IF v_sender_location IS NULL OR NOT extensions.ST_DWithin(v_sender_location, v_recipient.location, v_recipient.radius_m) THEN
    RAISE EXCEPTION 'recipient_outside_visibility_radius' USING ERRCODE = '42501';
  END IF;
  SELECT LEAST(now() + interval '24 hours', session.expires_at) INTO v_expiry
    FROM public.reel_guest_sessions session WHERE session.id = v_recipient.guest_session_id;

  INSERT INTO public.reel_guest_bips (
    client_request_id, sender_member_id, recipient_guest_session_id,
    sender_presence_id, recipient_presence_id, expires_at
  ) VALUES (
    p_client_request_id, v_member, v_recipient.guest_session_id,
    v_sender.id, v_recipient.id, v_expiry
  ) ON CONFLICT DO NOTHING RETURNING * INTO v_bip;

  IF NOT FOUND THEN
    SELECT * INTO v_bip FROM public.reel_guest_bips
    WHERE client_request_id = p_client_request_id
       OR (status = 'pending'
         AND LEAST(sender_actor_key, recipient_actor_key) = LEAST('m:' || v_member::text, 'g:' || v_recipient.guest_session_id::text)
         AND GREATEST(sender_actor_key, recipient_actor_key) = GREATEST('m:' || v_member::text, 'g:' || v_recipient.guest_session_id::text))
    ORDER BY (client_request_id = p_client_request_id) DESC LIMIT 1;
  END IF;
  IF v_bip.id IS NULL THEN RAISE EXCEPTION 'bip_creation_failed' USING ERRCODE = '40001'; END IF;
  RETURN v_bip;
END;
$$;

CREATE OR REPLACE FUNCTION public.send_reel_guest_bip(
  p_guest_session_id UUID,
  p_recipient_actor_kind TEXT,
  p_recipient_presence_id UUID,
  p_client_request_id UUID
)
RETURNS public.reel_guest_bips
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_sender public.reel_guest_presences;
  v_member_presence public.reel_presences;
  v_guest_presence public.reel_guest_presences;
  v_sender_session public.reel_guest_sessions;
  v_recipient_session_id UUID;
  v_recipient_member_id UUID;
  v_sender_location extensions.geography;
  v_recipient_location extensions.geography;
  v_recipient_radius INTEGER;
  v_recipient_expiry TIMESTAMPTZ;
  v_bip public.reel_guest_bips;
BEGIN
  IF auth.role() <> 'service_role' THEN RAISE EXCEPTION 'service_role_required' USING ERRCODE = '42501'; END IF;
  IF p_client_request_id IS NULL OR p_recipient_actor_kind NOT IN ('member','guest') THEN
    RAISE EXCEPTION 'invalid_guest_bip_request' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO v_sender_session FROM public.reel_guest_sessions
    WHERE id = p_guest_session_id AND purpose = 'reel_guest'
      AND revoked_at IS NULL AND expires_at > now() FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION 'active_guest_session_required' USING ERRCODE = '42501'; END IF;
  SELECT * INTO v_sender FROM public.reel_guest_presences
    WHERE guest_session_id = p_guest_session_id AND status = 'active'
      AND expires_at > now() FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION 'active_sender_presence_required' USING ERRCODE = '42501'; END IF;

  SELECT location INTO v_sender_location FROM public.reel_guest_presences
    WHERE id = v_sender.id;
  IF p_recipient_actor_kind = 'member' THEN
    SELECT presence.* INTO v_member_presence
      FROM public.reel_presences presence
      JOIN public.profiles profile ON profile.id = presence.owner_id
      WHERE presence.id = p_recipient_presence_id AND presence.status = 'active'
        AND presence.expires_at > (extract(epoch FROM now()) * 1000)::bigint
        AND profile.status = 'active' AND profile.deleted_at IS NULL FOR SHARE OF presence;
    IF NOT FOUND THEN RAISE EXCEPTION 'active_member_recipient_required' USING ERRCODE = '42501'; END IF;
    v_recipient_member_id := v_member_presence.owner_id;
    v_recipient_radius := v_member_presence.radius_m;
    SELECT location INTO v_recipient_location FROM public.reel_presence_locations
      WHERE presence_id = v_member_presence.id AND expires_at > now();
    v_recipient_expiry := to_timestamp(v_member_presence.expires_at / 1000.0);
  ELSE
    SELECT guest.* INTO v_guest_presence
      FROM public.reel_guest_presences guest
      JOIN public.reel_guest_sessions session ON session.id = guest.guest_session_id
      WHERE guest.id = p_recipient_presence_id AND guest.status = 'active'
        AND guest.expires_at > now() AND session.revoked_at IS NULL
        AND session.expires_at > now() AND guest.guest_session_id <> p_guest_session_id
      FOR SHARE OF guest;
    IF NOT FOUND THEN RAISE EXCEPTION 'active_guest_recipient_required' USING ERRCODE = '42501'; END IF;
    v_recipient_session_id := v_guest_presence.guest_session_id;
    v_recipient_radius := v_guest_presence.radius_m;
    v_recipient_location := v_guest_presence.location;
    v_recipient_expiry := v_guest_presence.expires_at;
  END IF;
  IF v_sender_location IS NULL OR v_recipient_location IS NULL
    OR NOT extensions.ST_DWithin(v_sender_location, v_recipient_location, v_recipient_radius) THEN
    RAISE EXCEPTION 'recipient_outside_visibility_radius' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.reel_guest_bips (
    client_request_id, sender_guest_session_id, recipient_member_id,
    recipient_guest_session_id, sender_presence_id, recipient_presence_id, expires_at
  ) VALUES (
    p_client_request_id, p_guest_session_id, v_recipient_member_id,
    v_recipient_session_id, v_sender.id, p_recipient_presence_id,
    LEAST(now() + interval '24 hours', v_sender_session.expires_at, v_recipient_expiry)
  ) ON CONFLICT DO NOTHING RETURNING * INTO v_bip;

  IF NOT FOUND THEN
    SELECT * INTO v_bip FROM public.reel_guest_bips
      WHERE client_request_id = p_client_request_id
        OR (status = 'pending'
          AND LEAST(sender_actor_key, recipient_actor_key) = LEAST('g:' || p_guest_session_id::text,
            CASE WHEN v_recipient_member_id IS NOT NULL THEN 'm:' || v_recipient_member_id::text
                 ELSE 'g:' || v_recipient_session_id::text END)
          AND GREATEST(sender_actor_key, recipient_actor_key) = GREATEST('g:' || p_guest_session_id::text,
            CASE WHEN v_recipient_member_id IS NOT NULL THEN 'm:' || v_recipient_member_id::text
                 ELSE 'g:' || v_recipient_session_id::text END))
      ORDER BY (client_request_id = p_client_request_id) DESC LIMIT 1;
  END IF;
  IF v_bip.id IS NULL THEN RAISE EXCEPTION 'bip_creation_failed' USING ERRCODE = '40001'; END IF;
  RETURN v_bip;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_reel_guest_connection_from_bip(p_bip_id UUID)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_bip public.reel_guest_bips;
  v_connection_id UUID;
BEGIN
  SELECT * INTO v_bip FROM public.reel_guest_bips WHERE id = p_bip_id FOR UPDATE;
  IF NOT FOUND OR v_bip.status <> 'accepted' THEN RAISE EXCEPTION 'accepted_guest_bip_required' USING ERRCODE = '42501'; END IF;
  INSERT INTO public.reel_guest_connections (
    participant_one_member_id, participant_one_guest_session_id,
    participant_two_member_id, participant_two_guest_session_id, expires_at
  ) VALUES (
    v_bip.sender_member_id, v_bip.sender_guest_session_id,
    v_bip.recipient_member_id, v_bip.recipient_guest_session_id, v_bip.expires_at
  )
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_connection_id FROM public.reel_guest_connections
    WHERE LEAST(participant_one_actor_key, participant_two_actor_key) = LEAST(v_bip.sender_actor_key, v_bip.recipient_actor_key)
      AND GREATEST(participant_one_actor_key, participant_two_actor_key) = GREATEST(v_bip.sender_actor_key, v_bip.recipient_actor_key);
  RETURN v_connection_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.command_reel_guest_bip_member(p_bip_id UUID, p_action TEXT)
RETURNS public.reel_guest_bips
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_member UUID := public.reel_require_active_profile();
  v_bip public.reel_guest_bips;
BEGIN
  IF auth.role() <> 'authenticated' OR p_action NOT IN ('accept','decline','withdraw') THEN
    RAISE EXCEPTION 'invalid_member_bip_action' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_bip FROM public.reel_guest_bips
    WHERE id = p_bip_id AND (sender_member_id = v_member OR recipient_member_id = v_member)
    FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'guest_bip_not_found' USING ERRCODE = '42501'; END IF;
  IF v_bip.status <> 'pending' OR v_bip.expires_at <= now() THEN
    RAISE EXCEPTION 'guest_bip_no_longer_pending' USING ERRCODE = '22023';
  END IF;
  IF p_action IN ('accept','decline') AND v_bip.recipient_member_id <> v_member THEN
    RAISE EXCEPTION 'recipient_action_required' USING ERRCODE = '42501';
  END IF;
  IF p_action = 'withdraw' AND v_bip.sender_member_id <> v_member THEN
    RAISE EXCEPTION 'sender_action_required' USING ERRCODE = '42501';
  END IF;
  UPDATE public.reel_guest_bips SET status = p_action,
    resolved_at = now(), updated_at = now()
    WHERE id = p_bip_id RETURNING * INTO v_bip;
  IF p_action = 'accept' THEN PERFORM public.create_reel_guest_connection_from_bip(p_bip_id); END IF;
  RETURN v_bip;
END;
$$;

CREATE OR REPLACE FUNCTION public.command_reel_guest_bip_guest(
  p_guest_session_id UUID, p_bip_id UUID, p_action TEXT
)
RETURNS public.reel_guest_bips
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_bip public.reel_guest_bips;
BEGIN
  IF auth.role() <> 'service_role' OR p_action NOT IN ('accept','decline','withdraw') THEN
    RAISE EXCEPTION 'service_role_required' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.reel_guest_sessions
    WHERE id = p_guest_session_id AND purpose = 'reel_guest'
      AND revoked_at IS NULL AND expires_at > now()) THEN
    RAISE EXCEPTION 'active_guest_session_required' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_bip FROM public.reel_guest_bips
    WHERE id = p_bip_id
      AND (sender_guest_session_id = p_guest_session_id OR recipient_guest_session_id = p_guest_session_id)
    FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'guest_bip_not_found' USING ERRCODE = '42501'; END IF;
  IF v_bip.status <> 'pending' OR v_bip.expires_at <= now() THEN
    RAISE EXCEPTION 'guest_bip_no_longer_pending' USING ERRCODE = '22023';
  END IF;
  IF p_action IN ('accept','decline') AND v_bip.recipient_guest_session_id <> p_guest_session_id THEN
    RAISE EXCEPTION 'recipient_action_required' USING ERRCODE = '42501';
  END IF;
  IF p_action = 'withdraw' AND v_bip.sender_guest_session_id <> p_guest_session_id THEN
    RAISE EXCEPTION 'sender_action_required' USING ERRCODE = '42501';
  END IF;
  UPDATE public.reel_guest_bips SET status = p_action,
    resolved_at = now(), updated_at = now()
    WHERE id = p_bip_id RETURNING * INTO v_bip;
  IF p_action = 'accept' THEN PERFORM public.create_reel_guest_connection_from_bip(p_bip_id); END IF;
  RETURN v_bip;
END;
$$;

CREATE OR REPLACE FUNCTION public.list_reel_guest_bips_for_member()
RETURNS SETOF public.reel_guest_bips
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT bip.* FROM public.reel_guest_bips bip
  WHERE auth.uid() IN (bip.sender_member_id, bip.recipient_member_id)
    AND bip.status = 'pending' AND bip.expires_at > now()
  ORDER BY bip.created_at DESC LIMIT 100;
$$;

CREATE OR REPLACE FUNCTION public.list_reel_guest_bips_for_session(p_guest_session_id UUID)
RETURNS SETOF public.reel_guest_bips
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF auth.role() <> 'service_role' OR NOT EXISTS (
    SELECT 1 FROM public.reel_guest_sessions
    WHERE id = p_guest_session_id AND revoked_at IS NULL AND expires_at > now()
  ) THEN RAISE EXCEPTION 'active_guest_session_required' USING ERRCODE = '42501'; END IF;
  RETURN QUERY SELECT bip.* FROM public.reel_guest_bips bip
    WHERE p_guest_session_id IN (bip.sender_guest_session_id, bip.recipient_guest_session_id)
      AND bip.status = 'pending' AND bip.expires_at > now()
    ORDER BY bip.created_at DESC LIMIT 100;
END;
$$;

CREATE OR REPLACE FUNCTION public.list_reel_guest_connections_for_member()
RETURNS SETOF public.reel_guest_connections
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT connection.* FROM public.reel_guest_connections connection
  WHERE auth.uid() IN (connection.participant_one_member_id, connection.participant_two_member_id)
    AND connection.expires_at > now()
    AND (connection.status = 'active' OR connection.closed_at >= now() - interval '6 months')
  ORDER BY connection.created_at DESC LIMIT 100;
$$;

CREATE OR REPLACE FUNCTION public.list_reel_guest_connections_for_session(p_guest_session_id UUID)
RETURNS SETOF public.reel_guest_connections
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF auth.role() <> 'service_role' OR NOT EXISTS (
    SELECT 1 FROM public.reel_guest_sessions
    WHERE id = p_guest_session_id AND revoked_at IS NULL AND expires_at > now()
  ) THEN RAISE EXCEPTION 'active_guest_session_required' USING ERRCODE = '42501'; END IF;
  RETURN QUERY SELECT connection.* FROM public.reel_guest_connections connection
    WHERE p_guest_session_id IN (connection.participant_one_guest_session_id, connection.participant_two_guest_session_id)
      AND connection.expires_at > now()
    ORDER BY connection.created_at DESC LIMIT 100;
END;
$$;

CREATE OR REPLACE FUNCTION public.close_reel_guest_connection_member(p_connection_id UUID)
RETURNS public.reel_guest_connections
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_member UUID := public.reel_require_active_profile();
  v_connection public.reel_guest_connections;
BEGIN
  SELECT * INTO v_connection FROM public.reel_guest_connections
    WHERE id = p_connection_id AND v_member IN (participant_one_member_id, participant_two_member_id)
    FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'guest_connection_not_found' USING ERRCODE = '42501'; END IF;
  IF v_connection.status = 'closed' THEN RETURN v_connection; END IF;
  UPDATE public.reel_guest_connections SET status = 'closed', closed_at = now(),
    closed_by_member_id = v_member WHERE id = p_connection_id RETURNING * INTO v_connection;
  RETURN v_connection;
END;
$$;

CREATE OR REPLACE FUNCTION public.close_reel_guest_connection_guest(p_guest_session_id UUID, p_connection_id UUID)
RETURNS public.reel_guest_connections
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_connection public.reel_guest_connections;
BEGIN
  IF auth.role() <> 'service_role' OR NOT EXISTS (
    SELECT 1 FROM public.reel_guest_sessions
    WHERE id = p_guest_session_id AND revoked_at IS NULL AND expires_at > now()
  ) THEN RAISE EXCEPTION 'active_guest_session_required' USING ERRCODE = '42501'; END IF;
  SELECT * INTO v_connection FROM public.reel_guest_connections
    WHERE id = p_connection_id AND p_guest_session_id IN (participant_one_guest_session_id, participant_two_guest_session_id)
    FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'guest_connection_not_found' USING ERRCODE = '42501'; END IF;
  IF v_connection.status = 'closed' THEN RETURN v_connection; END IF;
  UPDATE public.reel_guest_connections SET status = 'closed', closed_at = now(),
    closed_by_guest_session_id = p_guest_session_id WHERE id = p_connection_id RETURNING * INTO v_connection;
  RETURN v_connection;
END;
$$;

REVOKE ALL ON FUNCTION public.send_reel_bip_to_guest(UUID,UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.send_reel_guest_bip(UUID,TEXT,UUID,UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_reel_guest_connection_from_bip(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.command_reel_guest_bip_member(UUID,TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.command_reel_guest_bip_guest(UUID,UUID,TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.list_reel_guest_bips_for_member() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.list_reel_guest_bips_for_session(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.list_reel_guest_connections_for_member() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.list_reel_guest_connections_for_session(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.close_reel_guest_connection_member(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.close_reel_guest_connection_guest(UUID,UUID) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.send_reel_bip_to_guest(UUID,UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_reel_guest_bip(UUID,TEXT,UUID,UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.command_reel_guest_bip_member(UUID,TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.command_reel_guest_bip_guest(UUID,UUID,TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.list_reel_guest_bips_for_member() TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_reel_guest_bips_for_session(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.list_reel_guest_connections_for_member() TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_reel_guest_connections_for_session(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.close_reel_guest_connection_member(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.close_reel_guest_connection_guest(UUID,UUID) TO service_role;

COMMENT ON TABLE public.reel_guest_bips IS
  'Temporary cross-mode bip requests. Guest identity is a verified short-lived session, never a synthetic member account.';
COMMENT ON TABLE public.reel_guest_connections IS
  'Temporary cross-mode relations. Any relation involving a guest expires with that guest session and is deleted by session cascade.';

COMMIT;
