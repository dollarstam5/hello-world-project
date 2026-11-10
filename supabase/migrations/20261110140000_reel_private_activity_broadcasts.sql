BEGIN;

-- Private member topics carry only a coarse event kind. Guest session IDs,
-- bip IDs, presence IDs, names and coordinates never enter the broadcast.
-- Supabase already enables RLS on realtime.messages; do not alter that managed table.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'realtime'
      AND tablename = 'messages'
      AND policyname = 'reel_member_activity_read'
  ) THEN
    CREATE POLICY reel_member_activity_read
      ON realtime.messages
      FOR SELECT
      TO authenticated
      USING (
        extension = 'broadcast'
        AND realtime.topic() = 'reel-member:' || auth.uid()::text
      );
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.broadcast_reel_member_activity(
  p_member_id UUID,
  p_event_kind TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, realtime
AS $$
BEGIN
  IF p_member_id IS NULL THEN
    RETURN;
  END IF;

  PERFORM realtime.send(
    jsonb_build_object('kind', p_event_kind),
    'reel_activity',
    'reel-member:' || p_member_id::text,
    true
  );
END;
$$;

REVOKE ALL ON FUNCTION public.broadcast_reel_member_activity(UUID, TEXT)
  FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.notify_reel_guest_bip_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.broadcast_reel_member_activity(
      NEW.recipient_member_id,
      'bip_received'
    );
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM public.broadcast_reel_member_activity(
      NEW.sender_member_id,
      'bip_updated'
    );
    PERFORM public.broadcast_reel_member_activity(
      NEW.recipient_member_id,
      'bip_updated'
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER reel_guest_bip_activity_broadcast
  AFTER INSERT OR UPDATE OF status
  ON public.reel_guest_bips
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_reel_guest_bip_activity();

CREATE OR REPLACE FUNCTION public.notify_reel_guest_connection_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  PERFORM public.broadcast_reel_member_activity(
    NEW.participant_one_member_id,
    'connection_updated'
  );
  PERFORM public.broadcast_reel_member_activity(
    NEW.participant_two_member_id,
    'connection_updated'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER reel_guest_connection_activity_broadcast
  AFTER INSERT OR UPDATE OF status
  ON public.reel_guest_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_reel_guest_connection_activity();

REVOKE ALL ON FUNCTION public.notify_reel_guest_bip_activity()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notify_reel_guest_connection_activity()
  FROM PUBLIC, anon, authenticated;

COMMIT;
