BEGIN;

-- Keep active-profile enforcement inside SECURITY DEFINER entry points.
-- Ending one's own presence intentionally remains available to suspended
-- accounts so they can stop sharing their location immediately.
CREATE OR REPLACE FUNCTION public.reel_require_active_profile()
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.profiles profile
    WHERE profile.id = v_user_id
      AND profile.status = 'active'
      AND profile.deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'active_profile_required' USING ERRCODE = '42501';
  END IF;
  RETURN v_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.reel_require_active_profile() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reel_require_active_profile() TO authenticated;

-- A valid same-zone presence is not sufficient if the requesting profile
-- has since been suspended, closed or deleted.
CREATE OR REPLACE FUNCTION public.reel_can_read_zone(p_zone_key TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.profiles profile
      WHERE profile.id = auth.uid()
        AND profile.status = 'active'
        AND profile.deleted_at IS NULL
    )
    AND EXISTS (
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

-- Recheck the profile at command time, not only when the bip was created.
CREATE OR REPLACE FUNCTION public.command_reel_bip(p_bip_id UUID, p_action TEXT)
RETURNS public.reel_bips
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_user_id UUID;
  v_now BIGINT := (extract(epoch FROM clock_timestamp()) * 1000)::bigint;
  v_bip public.reel_bips;
  v_low UUID;
  v_high UUID;
BEGIN
  v_user_id := public.reel_require_active_profile();

  IF p_action IS NULL OR p_action NOT IN ('accept', 'decline', 'withdraw') THEN
    RAISE EXCEPTION 'invalid_bip_action' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_bip
  FROM public.reel_bips
  WHERE id = p_bip_id
    AND v_user_id IN (sender_id, recipient_id)
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'bip_not_found' USING ERRCODE = '42501';
  END IF;

  IF (p_action = 'accept' AND v_bip.status = 'accepted')
    OR (p_action = 'decline' AND v_bip.status = 'declined')
    OR (p_action = 'withdraw' AND v_bip.status = 'withdrawn')
  THEN
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
      expires_at = CASE WHEN p_action = 'accept' THEN least(expires_at, v_now + 86400000) ELSE expires_at END,
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
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := public.reel_require_active_profile();

  RETURN QUERY
  SELECT bip.*
  FROM public.reel_bips bip
  WHERE v_user_id IN (bip.sender_id, bip.recipient_id)
    AND bip.status = 'pending'
    AND bip.expires_at > (extract(epoch FROM now()) * 1000)::bigint
  ORDER BY bip.created_at DESC
  LIMIT 100;
END;
$$;

REVOKE ALL ON FUNCTION public.command_reel_bip(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.list_reel_bips() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.command_reel_bip(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_reel_bips() TO authenticated;

COMMIT;
