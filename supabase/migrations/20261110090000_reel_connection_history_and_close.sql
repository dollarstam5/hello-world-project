BEGIN;

-- Keep resolved bip rows readable by their two participants for the short
-- retention window so Postgres Changes can deliver accept/decline events.
-- The list RPC still returns pending bips only.
DROP POLICY IF EXISTS reel_bip_participants_read ON public.reel_bips;
CREATE POLICY reel_bip_participants_read
  ON public.reel_bips
  FOR SELECT TO authenticated
  USING (
    auth.uid() IN (sender_id, recipient_id)
    AND status IN ('pending', 'accepted', 'declined', 'withdrawn')
    AND expires_at > (extract(epoch FROM now()) * 1000)::bigint
  );

CREATE OR REPLACE FUNCTION public.list_reel_connections()
RETURNS TABLE (
  connection_id UUID,
  partner_id UUID,
  partner_display_name TEXT,
  partner_avatar_media_id UUID,
  status TEXT,
  created_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  closed_by UUID
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'authentication_required' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    connection.id,
    CASE WHEN connection.participant_low = v_user_id
      THEN connection.participant_high ELSE connection.participant_low END,
    COALESCE(profile.display_name, 'Membre Vitalis'),
    profile.avatar_media_id,
    connection.status,
    connection.created_at,
    connection.closed_at,
    connection.closed_by
  FROM public.reel_connections connection
  LEFT JOIN public.profiles profile
    ON profile.id = CASE WHEN connection.participant_low = v_user_id
      THEN connection.participant_high ELSE connection.participant_low END
  WHERE v_user_id IN (connection.participant_low, connection.participant_high)
    AND (connection.status = 'active' OR connection.closed_at >= now() - interval '6 months')
  ORDER BY connection.created_at DESC
  LIMIT 200;
END;
$$;

CREATE OR REPLACE FUNCTION public.close_reel_connection(p_connection_id UUID)
RETURNS public.reel_connections
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_connection public.reel_connections;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'authentication_required' USING ERRCODE = '42501';
  END IF;
  IF p_connection_id IS NULL THEN
    RAISE EXCEPTION 'connection_id_required' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_connection
  FROM public.reel_connections
  WHERE id = p_connection_id
    AND v_user_id IN (participant_low, participant_high)
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'connection_not_found' USING ERRCODE = '42501';
  END IF;

  IF v_connection.status = 'closed' THEN
    RETURN v_connection;
  END IF;

  UPDATE public.reel_connections
  SET status = 'closed',
      closed_at = now(),
      closed_by = v_user_id
  WHERE id = p_connection_id
  RETURNING * INTO v_connection;

  RETURN v_connection;
END;
$$;

CREATE OR REPLACE FUNCTION public.purge_reel_connection_history()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM public.reel_connections
  WHERE status = 'closed'
    AND closed_at < now() - interval '6 months';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;

REVOKE ALL ON FUNCTION public.purge_reel_connection_history() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_reel_connection_history() TO service_role;

DO $cron$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    BEGIN
      PERFORM cron.schedule(
        'reel-connection-history-cleanup',
        '0 3 * * *',
        'SELECT public.purge_reel_connection_history();'
      );
    EXCEPTION
      WHEN duplicate_object OR unique_violation THEN NULL;
      WHEN undefined_function OR invalid_schema_name THEN NULL;
    END;
  END IF;
END;
$cron$;

REVOKE ALL ON FUNCTION public.list_reel_connections() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.close_reel_connection(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_reel_connections() TO authenticated;
GRANT EXECUTE ON FUNCTION public.close_reel_connection(UUID) TO authenticated;

COMMENT ON FUNCTION public.list_reel_connections() IS
  'Returns only the caller''s own Réel relationships and the related participant''s limited display identity.';
COMMENT ON FUNCTION public.close_reel_connection(UUID) IS
  'Allows either participant to close their shared Réel relationship.';

COMMIT;
