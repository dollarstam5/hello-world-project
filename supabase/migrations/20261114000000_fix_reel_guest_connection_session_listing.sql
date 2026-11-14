-- Fix the guest-session connection listing when its output column names
-- overlap with columns referenced by the PL/pgSQL guard.
CREATE OR REPLACE FUNCTION public.list_reel_guest_connections_for_session(p_guest_session_id UUID)
RETURNS TABLE (
  connection_id UUID,
  status TEXT,
  created_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  partner_display_name TEXT
)
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF auth.role() <> 'service_role' OR NOT EXISTS (
    SELECT 1
    FROM public.reel_guest_sessions AS guest_session
    WHERE guest_session.id = p_guest_session_id
      AND guest_session.revoked_at IS NULL
      AND guest_session.expires_at > now()
  ) THEN
    RAISE EXCEPTION 'active_guest_session_required' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT connection.id,
    connection.status,
    connection.created_at,
    connection.expires_at,
    connection.closed_at,
    CASE
      WHEN connection.participant_one_guest_session_id = p_guest_session_id
        THEN connection.participant_two_display_name
      ELSE connection.participant_one_display_name
    END
  FROM public.reel_guest_connections AS connection
  WHERE p_guest_session_id IN (
    connection.participant_one_guest_session_id,
    connection.participant_two_guest_session_id
  )
    AND connection.expires_at > now()
  ORDER BY connection.created_at DESC
  LIMIT 100;
END;
$$;

REVOKE ALL ON FUNCTION public.list_reel_guest_connections_for_session(UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.list_reel_guest_connections_for_session(UUID)
  TO service_role;
