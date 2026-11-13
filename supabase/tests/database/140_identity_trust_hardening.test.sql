BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(27);

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
  'members retain the four approved profile edit fields'
);
SELECT ok(
  NOT has_table_privilege('authenticated', 'public.profiles', 'INSERT')
  AND NOT has_column_privilege('authenticated', 'public.profiles', 'status', 'UPDATE')
  AND NOT has_column_privilege('authenticated', 'public.profiles', 'trust_score', 'UPDATE')
  AND NOT has_column_privilege('authenticated', 'public.profiles', 'created_at', 'UPDATE')
  AND NOT has_column_privilege('authenticated', 'public.profiles', 'deleted_at', 'UPDATE')
  AND NOT has_column_privilege('authenticated', 'public.profiles', 'revision', 'UPDATE')
  AND NOT has_column_privilege('authenticated', 'public.profiles', 'server_updated_at', 'UPDATE'),
  'profile system fields and direct profile creation are blocked'
);
SELECT ok(has_table_privilege('authenticated', 'public.profiles', 'SELECT'),
  'members retain profile read access');

SELECT ok(
  NOT has_table_privilege('authenticated', 'public.udi', 'INSERT')
  AND NOT has_table_privilege('authenticated', 'public.udi', 'UPDATE')
  AND NOT has_table_privilege('authenticated', 'public.udi', 'DELETE'),
  'UDI writes are server-managed'
);
SELECT ok(has_table_privilege('authenticated', 'public.udi', 'SELECT'),
  'members retain RLS-filtered UDI read access');
SELECT policies_are('public', 'udi',
  ARRAY['identity readable by owner and administrators']);
SELECT ok(
  NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'udi'
      AND cmd IN ('INSERT', 'UPDATE', 'ALL')
      AND roles @> ARRAY['authenticated']::name[]
  ),
  'no authenticated UDI write policy remains'
);

SELECT ok(EXISTS (
  SELECT 1 FROM pg_constraint WHERE conrelid = 'public.profiles'::regclass
    AND conname = 'profiles_status_check' AND contype = 'c'
), 'profile status domain constraint exists');
SELECT ok(EXISTS (
  SELECT 1 FROM pg_constraint WHERE conrelid = 'public.profiles'::regclass
    AND conname = 'profiles_trust_score_check' AND contype = 'c'
), 'trust score range constraint exists');
SELECT ok(EXISTS (
  SELECT 1 FROM pg_constraint WHERE conrelid = 'public.udi'::regclass
    AND conname = 'udi_level_check' AND contype = 'c'
), 'UDI level domain constraint exists');

SELECT ok((SELECT prosecdef FROM pg_proc
  WHERE oid = 'public.handle_new_user()'::regprocedure),
  'new-user provisioning remains SECURITY DEFINER');
SELECT ok((SELECT COALESCE(array_to_string(proconfig, ','), '')
  LIKE '%search_path=pg_catalog, public%'
  FROM pg_proc WHERE oid = 'public.handle_new_user()'::regprocedure),
  'new-user provisioning pins a safe search_path');
SELECT ok((SELECT COALESCE(array_to_string(proconfig, ','), '')
  LIKE '%search_path=pg_catalog, public%'
  FROM pg_proc WHERE oid = 'public.assign_sync_revision()'::regprocedure),
  'revision trigger pins a safe search_path');
SELECT ok((SELECT COALESCE(array_to_string(proconfig, ','), '')
  LIKE '%search_path=pg_catalog, public%'
  FROM pg_proc WHERE oid = 'public.protect_profile_system_fields()'::regprocedure),
  'profile guard pins a safe search_path');

SELECT ok(has_function_privilege('authenticated',
  'public.has_role(uuid,public.app_role)', 'EXECUTE'),
  'UDI read policy can use the existing role helper');

-- Exercise the actual Auth provisioning trigger and member write boundary.
INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
  'd9000000-0000-4000-8000-000000000001',
  'authenticated', 'authenticated', 'trust-udi-test@example.invalid',
  '', now(), '{}', '{"display_name":"Trust test"}', now(), now()
);

SELECT is((SELECT level FROM public.udi
  WHERE user_id = 'd9000000-0000-4000-8000-000000000001'),
  'guest', 'new Auth users receive an initial guest UDI row');
SELECT is((SELECT display_name FROM public.profiles
  WHERE id = 'd9000000-0000-4000-8000-000000000001'),
  'Trust test', 'Auth provisioning preserves the display name');

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims',
  '{"sub":"d9000000-0000-4000-8000-000000000001","role":"authenticated"}', true);

SELECT lives_ok($$
  UPDATE public.profiles SET display_name = 'Updated name'
  WHERE id = auth.uid()
$$, 'member can update an approved profile field');

SELECT throws_ok($$
  UPDATE public.profiles SET trust_score = 99 WHERE id = auth.uid()
$$, '42501', 'permission denied for table profiles',
  'member cannot change their trust score');

SELECT throws_ok($$
  UPDATE public.profiles SET status = 'suspended' WHERE id = auth.uid()
$$, '42501', 'permission denied for table profiles',
  'member cannot change their account status');

SELECT throws_ok($$
  UPDATE public.udi SET level = 'trusted' WHERE user_id = auth.uid()
$$, '42501', 'permission denied for table udi',
  'member cannot elevate their UDI level');

SELECT is((SELECT count(*)::integer FROM public.udi
  WHERE user_id = auth.uid()), 1,
  'member can read their own UDI row');

RESET ROLE;
SELECT is((SELECT trust_score FROM public.profiles
  WHERE id = 'd9000000-0000-4000-8000-000000000001'), 0,
  'blocked trust-score update leaves the stored score unchanged');

SELECT * FROM finish();
ROLLBACK;
