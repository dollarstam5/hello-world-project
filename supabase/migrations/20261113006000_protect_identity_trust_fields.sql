-- Trust / UDI hardening.
-- This migration deliberately does not normalize or rewrite existing values.
-- It fails with diagnostics if historical values violate the intended domain.

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

-- Keep the sync revision server-owned and make the timestamp authoritative.
-- All baseline sync tables expose these three columns.
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

-- Profile fields editable by a member are explicitly allow-listed.
REVOKE INSERT, UPDATE ON public.profiles FROM authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (display_name, handle, avatar_media_id, locale)
  ON public.profiles TO authenticated;

DROP POLICY IF EXISTS "own profile insert" ON public.profiles;
-- Preserve the baseline own-profile UPDATE policy and member read policy.

CREATE OR REPLACE FUNCTION public.protect_profile_system_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF auth.role() = 'authenticated' AND (
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

-- UDI is server-managed. Members may read their own identity; administrators
-- and owners may read identities for support and moderation workflows.
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

-- Keep new-account provisioning in the existing auth trigger, but make it
-- idempotent and create the initial guest-level UDI record server-side.
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

-- Backfill only missing initial identity rows. Existing UDI records and values
-- are never overwritten, downgraded, or normalized.
INSERT INTO public.udi (user_id, level, attributes)
SELECT profile.id, 'guest', '{}'::jsonb
FROM public.profiles AS profile
WHERE NOT EXISTS (
  SELECT 1 FROM public.udi AS identity
  WHERE identity.user_id = profile.id
)
ON CONFLICT (user_id) DO NOTHING;

-- Add domain constraints only after the non-destructive preflight succeeded.
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_status_check
    CHECK (status IN ('active', 'invited', 'suspended', 'closed')),
  ADD CONSTRAINT profiles_trust_score_check
    CHECK (trust_score BETWEEN 0 AND 100);

ALTER TABLE public.udi
  ADD CONSTRAINT udi_level_check
    CHECK (level IN ('guest', 'identified', 'verified', 'trusted'));
