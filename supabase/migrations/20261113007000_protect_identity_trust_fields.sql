-- Trust / UDI hardening.
-- Refuse unknown historical values rather than silently normalizing them.

DO $preflight$
DECLARE
  v_invalid_profiles BIGINT;
  v_invalid_udi BIGINT;
BEGIN
  SELECT count(*) INTO v_invalid_profiles
  FROM public.profiles
  WHERE status NOT IN ('active', 'invited', 'suspended', 'closed')
     OR trust_score NOT BETWEEN 0 AND 100;

  SELECT count(*) INTO v_invalid_udi
  FROM public.udi
  WHERE level NOT IN ('guest', 'identified', 'verified', 'trusted');

  IF v_invalid_profiles > 0 OR v_invalid_udi > 0 THEN
    RAISE EXCEPTION
      'trust_udi_preflight_failed: invalid_profiles=%, invalid_udi=%; no rows were modified',
      v_invalid_profiles, v_invalid_udi
      USING ERRCODE = '23514';
  END IF;
END;
$preflight$;

-- The function is shared by the baseline sync tables and Radar. Keep its
-- envelope consistent: epoch milliseconds for updated_at, global revision,
-- and a server timestamp. All current trigger targets define these columns.
CREATE OR REPLACE FUNCTION public.assign_sync_revision()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.revision := nextval('public.sync_revision_seq');
  NEW.updated_at := (EXTRACT(EPOCH FROM clock_timestamp()) * 1000)::BIGINT;
  NEW.server_updated_at := clock_timestamp();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.assign_sync_revision()
  FROM PUBLIC, anon, authenticated;

-- Members can edit only the four explicitly approved profile fields.
REVOKE INSERT, UPDATE ON public.profiles FROM authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (display_name, handle, avatar_media_id, locale)
  ON public.profiles TO authenticated;
DROP POLICY IF EXISTS "own profile insert" ON public.profiles;

CREATE OR REPLACE FUNCTION public.protect_profile_system_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF current_user = 'authenticated' AND (
    NEW.id IS DISTINCT FROM OLD.id
    OR NEW.status IS DISTINCT FROM OLD.status
    OR NEW.trust_score IS DISTINCT FROM OLD.trust_score
    OR NEW.created_at IS DISTINCT FROM OLD.created_at
    OR NEW.deleted_at IS DISTINCT FROM OLD.deleted_at
    OR NEW.revision IS DISTINCT FROM OLD.revision
    OR NEW.server_updated_at IS DISTINCT FROM OLD.server_updated_at
  ) THEN
    RAISE EXCEPTION 'protected_profile_field' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.protect_profile_system_fields()
  FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS a_protect_profile_system_fields ON public.profiles;
CREATE TRIGGER a_protect_profile_system_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_system_fields();

-- UDI is server-managed; members can read only their own row, while admins
-- and owners retain the established support/moderation read path.
REVOKE INSERT, UPDATE, DELETE ON public.udi FROM authenticated;
GRANT SELECT ON public.udi TO authenticated;

DROP POLICY IF EXISTS "own identity readable" ON public.udi;
DROP POLICY IF EXISTS "own identity insert" ON public.udi;
DROP POLICY IF EXISTS "own identity update" ON public.udi;
DROP POLICY IF EXISTS "identity readable by owner and administrators" ON public.udi;

CREATE POLICY "identity readable by owner and administrators"
ON public.udi
FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'owner')
);

-- Preserve the Auth trigger contract and create the initial UDI idempotently.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', ''))
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member')
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.udi (user_id, level, attributes)
  VALUES (NEW.id, 'guest', '{}'::jsonb)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user()
  FROM PUBLIC, anon, authenticated;

-- Backfill only missing UDI rows; existing identity values are never replaced.
INSERT INTO public.udi (user_id, level, attributes)
SELECT profile.id, 'guest', '{}'::jsonb
FROM public.profiles AS profile
WHERE NOT EXISTS (
  SELECT 1 FROM public.udi AS identity WHERE identity.user_id = profile.id
)
ON CONFLICT (user_id) DO NOTHING;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_status_check
    CHECK (status IN ('active', 'invited', 'suspended', 'closed')),
  ADD CONSTRAINT profiles_trust_score_check
    CHECK (trust_score BETWEEN 0 AND 100);

ALTER TABLE public.udi
  ADD CONSTRAINT udi_level_check
    CHECK (level IN ('guest', 'identified', 'verified', 'trusted'));
