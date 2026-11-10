BEGIN;

-- A presence can outlive a later profile suspension. Recheck both parties
-- at the database boundary before a new bip is inserted.
CREATE OR REPLACE FUNCTION public.reel_check_bip_active_participants()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles profile
    WHERE profile.id = NEW.sender_id
      AND profile.status = 'active'
      AND profile.deleted_at IS NULL
  ) OR NOT EXISTS (
    SELECT 1 FROM public.profiles profile
    WHERE profile.id = NEW.recipient_id
      AND profile.status = 'active'
      AND profile.deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'active_profile_required' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.reel_check_bip_active_participants() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS reel_bip_active_participants_guard ON public.reel_bips;
CREATE TRIGGER reel_bip_active_participants_guard
BEFORE INSERT ON public.reel_bips
FOR EACH ROW
EXECUTE FUNCTION public.reel_check_bip_active_participants();

COMMIT;
