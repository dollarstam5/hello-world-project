BEGIN;

-- Keep the existing private member topic and enrich its payload with a
-- delivery-only UUID. No business-row identifier or guest-session identifier
-- is ever broadcast to the client.
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
    jsonb_build_object(
      'kind', p_event_kind,
      'event_id', gen_random_uuid(),
      'created_at', (extract(epoch FROM clock_timestamp()) * 1000)::bigint
    ),
    'reel_activity',
    'reel-member:' || p_member_id::text,
    true
  );
END;
$$;

REVOKE ALL ON FUNCTION public.broadcast_reel_member_activity(UUID, TEXT)
  FROM PUBLIC, anon, authenticated;

-- A newly received guest/member bip is relevant to the member recipient.
-- Resolution is relevant to the member who sent the bip; the member who
-- accepted/declined already receives the inline result in the active screen.
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
    IF NEW.status = 'accepted' THEN
      PERFORM public.broadcast_reel_member_activity(
        NEW.sender_member_id,
        'bip_accepted'
      );
    ELSIF NEW.status = 'declined' THEN
      PERFORM public.broadcast_reel_member_activity(
        NEW.sender_member_id,
        'bip_declined'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Guest connections are already announced through the bip resolution event.
-- Only a later closure needs a distinct communication event.
CREATE OR REPLACE FUNCTION public.notify_reel_guest_connection_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status = 'closed' THEN
      PERFORM public.broadcast_reel_member_activity(
        NEW.participant_one_member_id,
        'connection_closed'
      );
      PERFORM public.broadcast_reel_member_activity(
        NEW.participant_two_member_id,
        'connection_closed'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_reel_member_bip_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.broadcast_reel_member_activity(
      NEW.recipient_id,
      'bip_received'
    );
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'accepted' THEN
      PERFORM public.broadcast_reel_member_activity(
        NEW.sender_id,
        'bip_accepted'
      );
    ELSIF NEW.status = 'declined' THEN
      PERFORM public.broadcast_reel_member_activity(
        NEW.sender_id,
        'bip_declined'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_reel_member_connection_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status
     AND NEW.status = 'closed' THEN
    PERFORM public.broadcast_reel_member_activity(
      NEW.participant_low,
      'connection_closed'
    );
    PERFORM public.broadcast_reel_member_activity(
      NEW.participant_high,
      'connection_closed'
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reel_member_bip_activity_broadcast ON public.reel_bips;
CREATE TRIGGER reel_member_bip_activity_broadcast
  AFTER INSERT OR UPDATE OF status
  ON public.reel_bips
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_reel_member_bip_activity();

DROP TRIGGER IF EXISTS reel_member_connection_activity_broadcast ON public.reel_connections;
CREATE TRIGGER reel_member_connection_activity_broadcast
  AFTER UPDATE OF status
  ON public.reel_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_reel_member_connection_activity();

REVOKE ALL ON FUNCTION public.notify_reel_guest_bip_activity()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notify_reel_guest_connection_activity()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notify_reel_member_bip_activity()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notify_reel_member_connection_activity()
  FROM PUBLIC, anon, authenticated;

COMMIT;
