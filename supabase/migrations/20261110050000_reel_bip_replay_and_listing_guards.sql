BEGIN;
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
  v_user_id UUID := public.reel_require_active_profile();
  v_now BIGINT := (extract(epoch FROM clock_timestamp()) * 1000)::bigint;
  v_sender public.reel_presences;
  v_recipient public.reel_presences;
  v_bip public.reel_bips;
BEGIN
  IF p_client_request_id IS NULL THEN
    RAISE EXCEPTION 'client_request_id_required' USING ERRCODE = '22023';
  END IF;
  PERFORM public.purge_expired_reel_bips();
  SELECT * INTO v_bip FROM public.reel_bips WHERE client_request_id = p_client_request_id;
  IF FOUND THEN
    IF v_bip.sender_id <> v_user_id THEN
      RAISE EXCEPTION 'request_id_not_owned' USING ERRCODE = '42501';
    END IF;
    RETURN v_bip;
  END IF;
  SELECT * INTO v_sender FROM public.reel_presences
  WHERE owner_id = v_user_id AND status = 'active' AND expires_at > v_now
  FOR SHARE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'active_sender_presence_required' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_recipient FROM public.reel_presences
  WHERE id = p_recipient_presence_id AND status = 'active' AND expires_at > v_now
  FOR SHARE;
  IF NOT FOUND OR v_recipient.owner_id = v_user_id THEN
    RAISE EXCEPTION 'active_recipient_presence_required' USING ERRCODE = '42501';
  END IF;
  IF v_sender.zone_key <> v_recipient.zone_key THEN
    RAISE EXCEPTION 'recipient_outside_shared_zone' USING ERRCODE = '42501';
  END IF;
  INSERT INTO public.reel_bips (
    client_request_id, sender_id, recipient_id, sender_presence_id, recipient_presence_id,
    status, created_at, updated_at, expires_at
  ) VALUES (
    p_client_request_id, v_user_id, v_recipient.owner_id, v_sender.id, v_recipient.id,
    'pending', v_now, v_now, least(v_sender.expires_at, v_recipient.expires_at) + 86400000
  )
  ON CONFLICT DO NOTHING RETURNING * INTO v_bip;
  IF NOT FOUND THEN
    SELECT * INTO v_bip FROM public.reel_bips
    WHERE client_request_id = p_client_request_id
       OR (status = 'pending'
         AND LEAST(sender_id, recipient_id) = LEAST(v_user_id, v_recipient.owner_id)
         AND GREATEST(sender_id, recipient_id) = GREATEST(v_user_id, v_recipient.owner_id))
    ORDER BY (client_request_id = p_client_request_id) DESC
    LIMIT 1;
  END IF;
  IF v_bip.id IS NULL THEN
    RAISE EXCEPTION 'bip_creation_failed' USING ERRCODE = '40001';
  END IF;
  RETURN v_bip;
END;
$$;

-- This function performs expiry cleanup, so it must not be declared STABLE.
CREATE OR REPLACE FUNCTION public.list_reel_bips()
RETURNS SETOF public.reel_bips
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := public.reel_require_active_profile();
  PERFORM public.purge_expired_reel_bips();
  RETURN QUERY
  SELECT bip.* FROM public.reel_bips bip
  WHERE v_user_id IN (bip.sender_id, bip.recipient_id)
    AND bip.status = 'pending'
    AND bip.expires_at > (extract(epoch FROM now()) * 1000)::bigint
  ORDER BY bip.created_at DESC
  LIMIT 100;
END;
$$;

REVOKE ALL ON FUNCTION public.send_reel_bip(UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.list_reel_bips() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.send_reel_bip(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_reel_bips() TO authenticated;
COMMIT;
