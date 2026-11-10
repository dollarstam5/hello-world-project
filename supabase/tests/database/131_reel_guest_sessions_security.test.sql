BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(7);

SELECT has_table('public', 'reel_guest_sessions', 'guest session table exists');

SELECT ok(
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.reel_guest_sessions'::regclass),
  'guest session table has row-level security enabled'
);

SELECT ok(
  NOT has_table_privilege('anon', 'public.reel_guest_sessions', 'SELECT')
  AND NOT has_table_privilege('anon', 'public.reel_guest_sessions', 'INSERT')
  AND NOT has_table_privilege('authenticated', 'public.reel_guest_sessions', 'SELECT')
  AND NOT has_table_privilege('authenticated', 'public.reel_guest_sessions', 'INSERT')
  AND NOT has_table_privilege('authenticated', 'public.reel_guest_sessions', 'UPDATE'),
  'browser roles cannot read or mutate guest sessions'
);

SELECT ok(
  has_table_privilege('service_role', 'public.reel_guest_sessions', 'SELECT')
  AND has_table_privilege('service_role', 'public.reel_guest_sessions', 'INSERT')
  AND has_table_privilege('service_role', 'public.reel_guest_sessions', 'UPDATE'),
  'only the server service role receives session table access'
);

SELECT ok(
  NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'reel_guest_sessions'
      AND column_name IN ('user_id', 'profile_id', 'email', 'phone', 'latitude', 'longitude')
  ),
  'guest sessions do not store member identity or exact location'
);

SELECT ok(
  (SELECT is_nullable = 'NO' FROM information_schema.columns
   WHERE table_schema = 'public' AND table_name = 'reel_guest_sessions' AND column_name = 'token_hash'),
  'token digest is mandatory'
);

SELECT ok(
  (SELECT column_default LIKE '%reel_guest%' FROM information_schema.columns
   WHERE table_schema = 'public' AND table_name = 'reel_guest_sessions' AND column_name = 'purpose'),
  'session purpose defaults to the Réel guest scope'
);

SELECT * FROM finish();
ROLLBACK;
