BEGIN;

-- Flash scope and urgency are persisted by the current shared contract.
ALTER TABLE public.flashes
  ADD COLUMN IF NOT EXISTS scope TEXT NOT NULL DEFAULT 'current_area',
  ADD COLUMN IF NOT EXISTS urgency TEXT NOT NULL DEFAULT 'anytime';

UPDATE public.flashes SET scope = 'current_area' WHERE scope IS NULL;
UPDATE public.flashes SET urgency = 'anytime' WHERE urgency IS NULL;

ALTER TABLE public.flashes
  ALTER COLUMN scope SET DEFAULT 'current_area',
  ALTER COLUMN scope SET NOT NULL,
  ALTER COLUMN urgency SET DEFAULT 'anytime',
  ALTER COLUMN urgency SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'flashes_scope_check'
      AND conrelid = 'public.flashes'::regclass
  ) THEN
    ALTER TABLE public.flashes
      ADD CONSTRAINT flashes_scope_check
      CHECK (scope IN ('current_area', 'expanded_area', 'half_city', 'whole_city'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'flashes_urgency_check'
      AND conrelid = 'public.flashes'::regclass
  ) THEN
    ALTER TABLE public.flashes
      ADD CONSTRAINT flashes_urgency_check
      CHECK (urgency IN ('urgent', 'very_urgent', 'today', 'as_soon_as_possible', 'anytime'));
  END IF;
END;
$$;

COMMENT ON COLUMN public.flashes.scope IS
  'Author-selected Flash publication scope; enforced by the scope-aware Scan RPC.';
COMMENT ON COLUMN public.flashes.urgency IS
  'Author-selected Flash urgency from the shared Vitalis contract.';

-- A private transaction-scoped authorization table prevents clients from
-- forging a lifecycle bypass through a session setting or request parameter.
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS private.flash_lifecycle_authorizations (
  transaction_id BIGINT NOT NULL,
  actor_id UUID NOT NULL,
  flash_id UUID NOT NULL,
  transition TEXT NOT NULL CHECK (transition IN ('publish', 'archive')),
  PRIMARY KEY (transaction_id, flash_id)
);
REVOKE ALL ON TABLE private.flash_lifecycle_authorizations FROM PUBLIC, anon, authenticated;

-- Every authenticated status transition must pass through a lifecycle RPC.
CREATE OR REPLACE FUNCTION public.guard_flash_status_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  authorized_transition TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.status IS DISTINCT FROM 'draft' THEN
      RAISE EXCEPTION 'flash_status_transition_requires_command'
        USING ERRCODE = '42501';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.status IS NOT DISTINCT FROM OLD.status THEN
    RETURN NEW;
  END IF;

  SELECT authorization.transition INTO authorized_transition
  FROM private.flash_lifecycle_authorizations AS authorization
  WHERE authorization.transaction_id = txid_current()
    AND authorization.actor_id = auth.uid()
    AND authorization.flash_id = NEW.id
  FOR UPDATE;

  IF OLD.status = 'draft'
     AND NEW.status = 'live'
     AND authorized_transition = 'publish' THEN
    DELETE FROM private.flash_lifecycle_authorizations
    WHERE transaction_id = txid_current()
      AND actor_id = auth.uid()
      AND flash_id = NEW.id;
    RETURN NEW;
  END IF;

  IF OLD.status = 'live'
     AND NEW.status = 'archived'
     AND authorized_transition = 'archive' THEN
    DELETE FROM private.flash_lifecycle_authorizations
    WHERE transaction_id = txid_current()
      AND actor_id = auth.uid()
      AND flash_id = NEW.id;
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'flash_status_transition_requires_command'
    USING ERRCODE = '42501';
END;
$$;

DROP TRIGGER IF EXISTS flashes_guard_status_transition ON public.flashes;
CREATE TRIGGER flashes_guard_status_transition
  BEFORE INSERT OR UPDATE OF status ON public.flashes
  FOR EACH ROW EXECUTE FUNCTION public.guard_flash_status_transition();
REVOKE ALL ON FUNCTION public.guard_flash_status_transition() FROM PUBLIC, anon, authenticated;

-- Publishing is one atomic operation: validate draft, save private coordinates,
-- and move to live. Execution stays revoked until Scan enforces author scope
-- and filters using raw metric distance before rounding.
CREATE OR REPLACE FUNCTION public.publish_flash(
  p_flash_id UUID,
  p_latitude DOUBLE PRECISION,
  p_longitude DOUBLE PRECISION,
  p_accuracy_meters DOUBLE PRECISION
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  flash_row public.flashes%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501';
  END IF;

  IF p_flash_id IS NULL
     OR p_latitude IS NULL
     OR p_longitude IS NULL
     OR p_accuracy_meters IS NULL
     OR NOT (p_latitude BETWEEN -90 AND 90)
     OR NOT (p_longitude BETWEEN -180 AND 180)
     OR NOT (p_accuracy_meters BETWEEN 0 AND 5000) THEN
    RAISE EXCEPTION 'invalid_location' USING ERRCODE = '22023';
  END IF;

  SELECT f.* INTO flash_row
  FROM public.flashes AS f
  WHERE f.id = p_flash_id
    AND f.author_id = auth.uid()
    AND f.deleted_at IS NULL
  FOR UPDATE;

  IF NOT FOUND OR flash_row.status <> 'draft' THEN
    RAISE EXCEPTION 'flash_not_found_or_not_owner_or_not_draft'
      USING ERRCODE = '42501';
  END IF;

  IF nullif(btrim(flash_row.title), '') IS NULL
     OR nullif(btrim(flash_row.body), '') IS NULL
     OR flash_row.expires_at IS NULL
     OR flash_row.expires_at <= (extract(epoch FROM now()) * 1000)::bigint
     OR flash_row.kind IS NULL
     OR flash_row.kind NOT IN ('need', 'offer')
     OR flash_row.category IS NULL
     OR flash_row.category NOT IN (
       'personal', 'professional', 'commercial', 'home', 'transport',
       'food', 'education', 'health', 'events', 'other'
     )
     OR flash_row.time_slot IS NULL
     OR flash_row.time_slot NOT IN ('now', 'today', 'tomorrow', 'this_week')
     OR nullif(btrim(flash_row.area_label), '') IS NULL
     OR flash_row.scope NOT IN ('current_area', 'expanded_area', 'half_city', 'whole_city')
     OR flash_row.urgency NOT IN ('urgent', 'very_urgent', 'today', 'as_soon_as_possible', 'anytime') THEN
    RAISE EXCEPTION 'flash_content_incomplete' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.flash_private_locations (
    flash_id, author_id, latitude, longitude, accuracy_meters
  ) VALUES (
    flash_row.id, flash_row.author_id, p_latitude, p_longitude, p_accuracy_meters
  )
  ON CONFLICT (flash_id) DO UPDATE
    SET author_id = EXCLUDED.author_id,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        accuracy_meters = EXCLUDED.accuracy_meters,
        updated_at = now();

  INSERT INTO private.flash_lifecycle_authorizations (
    transaction_id, actor_id, flash_id, transition
  ) VALUES (txid_current(), auth.uid(), flash_row.id, 'publish');

  UPDATE public.flashes
     SET status = 'live',
         updated_at = (extract(epoch FROM now()) * 1000)::bigint,
         server_updated_at = now()
   WHERE id = flash_row.id
     AND author_id = auth.uid()
     AND status = 'draft';

  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.publish_flash(UUID, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION)
  FROM PUBLIC, anon, authenticated;
COMMENT ON FUNCTION public.publish_flash(UUID, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION) IS
  'Atomic draft publication and private-location write. EXECUTE intentionally withheld until scope-aware metric Scan is deployed.';

-- The transition RPC can archive a live Flash only; it cannot publish drafts.
CREATE OR REPLACE FUNCTION public.transition_flash(p_flash_id UUID, p_status TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501';
  END IF;

  IF p_status IS DISTINCT FROM 'archived' THEN
    RAISE EXCEPTION 'invalid_status' USING ERRCODE = '22023';
  END IF;

  PERFORM 1
  FROM public.flashes AS f
  WHERE f.id = p_flash_id
    AND f.author_id = auth.uid()
    AND f.status = 'live'
    AND f.deleted_at IS NULL
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  INSERT INTO private.flash_lifecycle_authorizations (
    transaction_id, actor_id, flash_id, transition
  ) VALUES (txid_current(), auth.uid(), p_flash_id, 'archive');

  UPDATE public.flashes
     SET status = 'archived',
         updated_at = (extract(epoch FROM now()) * 1000)::bigint,
         server_updated_at = now()
   WHERE id = p_flash_id
     AND author_id = auth.uid()
     AND status = 'live'
     AND deleted_at IS NULL;

  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.transition_flash(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.transition_flash(UUID, TEXT) TO authenticated;

COMMENT ON FUNCTION public.transition_flash(UUID, TEXT) IS
  'Owner-only live-to-archived transition. Draft publication is exclusively reserved for publish_flash.';

COMMIT;
