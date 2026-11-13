BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(20);

SELECT has_function('public', 'assign_sync_revision', ARRAY[]::text[]);
SELECT has_function('public', 'protect_profile_system_fields', ARRAY[]::text[]);
SELECT has_function('public', 'handle_new_user', ARRAY[]::text[]);
SELECT has_trigger('public', 'profiles', 'a_protect_profile_system_fields',
  'profile system-field guard is installed');

SELECT ok(
  has_column_privilege('authenticated', 'public.profiles', 'display_name', 'UPDATE')
  AND has_column_privilege('authenticated', 'public.profiles', 'handle', 'UPDATE')
  AND has_column_privilege('authenticated', 'public.profiles', 'avatar_media_id', 'UPDATE')
  AND has_column_privilege('authenticated', 'public.profiles', 'locale', 'UPDATE'),
  'members retain the approved profile editing fields'
);
SELECT ok(
  NOT has_column_privilege('authenticated', 'public.profiles', 'status', 'UPDATE')
  AND NOT has_column_privilege('authenticated', 'public.profiles', 'trust_score', 'UPDATE')
  AND NOT has_column_privilege('authenticated', 'public.profiles', 'created_at', 'UPDATE')
  AND NOT has_column_privilege('authenticated', 'public.profiles', 'deleted_at', 'UPDATE')
  AND NOT has_column_privilege('authenticated', 'public.profiles', 'revision', 'UPDATE'),
  'members cannot update profile system and trust fields'
);
SELECT ok(
  NOT has_table_privilege('authenticated', 'public.profiles', 'INSERT'),
  'members cannot insert profiles directly'
);
SELECT ok(
  has_table_privilege('authenticated', 'public.profiles', 'SELECT'),
  'members retain profile read access'
);

SELECT ok(
  NOT has_table_privilege('authenticated', 'public.udi', 'INSERT')
  AND NOT has_table_privilege('authenticated', 'public.udi', 'UPDATE')
  AND NOT has_table_privilege('authenticated', 'public.udi', 'DELETE'),
  'UDI is server-managed for authenticated members'
);
SELECT ok(
  has_table_privilege('authenticated', 'public.udi', 'SELECT'),
  'members retain UDI read access subject to RLS'
);
SELECT policies_are(
  'public', 'udi',
  ARRAY['identity readable by owner and administrators']
);
SELECT ok(
  NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'udi'
      AND cmd IN ('INSERT', 'UPDATE', 'ALL')
      AND roles @> ARRAY['authenticated']::name[]
  ),
  'no authenticated UDI write policy remains'
);

SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND conname = 'profiles_status_check'
      AND contype = 'c'
  ),
  'profile status domain constraint exists'
);
SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND conname = 'profiles_trust_score_check'
      AND contype = 'c'
  ),
  'trust score range constraint exists'
);
SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.udi'::regclass
      AND conname = 'udi_level_check'
      AND contype = 'c'
  ),
  'UDI level domain constraint exists'
);

SELECT ok(
  (SELECT prosecdef FROM pg_proc
   WHERE oid = 'public.handle_new_user()'::regprocedure),
  'new-user provisioning remains SECURITY DEFINER'
);
SELECT ok(
  (SELECT COALESCE(array_to_string(proconfig, ','), '') LIKE '%search_path=pg_catalog, public%'
   FROM pg_proc WHERE oid = 'public.handle_new_user()'::regprocedure),
  'new-user provisioning pins a safe search_path'
);
SELECT ok(
  (SELECT COALESCE(array_to_string(proconfig, ','), '') LIKE '%search_path=pg_catalog, public%'
   FROM pg_proc WHERE oid = 'public.assign_sync_revision()'::regprocedure),
  'revision trigger pins a safe search_path'
);
SELECT ok(
  (SELECT COALESCE(array_to_string(proconfig, ','), '') LIKE '%search_path=pg_catalog, public%'
   FROM pg_proc WHERE oid = 'public.protect_profile_system_fields()'::regprocedure),
  'profile guard pins a safe search_path'
);

SELECT ok(
  has_function_privilege('authenticated', 'public.has_role(uuid,public.app_role)', 'EXECUTE'),
  'RLS identity policy can continue to use the existing role helper'
);

SELECT * FROM finish();
ROLLBACK;
