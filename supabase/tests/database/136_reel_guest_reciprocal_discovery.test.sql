BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(8);

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
) VALUES (
  'e4000000-0000-4000-8000-000000000001',
  'authenticated', 'authenticated', 'reel-guest-discovery-member@example.invalid',
  '', now(), '{}', '{"display_name":"Mina"}'
);

INSERT INTO public.reel_guest_sessions (id, token_hash, purpose, expires_at)
VALUES
  ('e4000000-0000-4000-8000-000000000011', repeat('b', 64), 'reel_guest', now() + interval '30 minutes'),
  ('e4000000-0000-4000-8000-000000000012', repeat('c', 64), 'reel_guest', now() + interval '30 minutes');

SET LOCAL ROLE service_role;
SELECT set_config('request.jwt.claims', '{"role":"service_role"}', true);

SELECT lives_ok(
  $$SELECT public.create_reel_guest_presence(
    'e4000000-0000-4000-8000-000000000011',
    'Awa', 'avatar-blue', 'Bonamoussadi', 'Disponible pour aider',
    100, 9.7000, 4.0500, 30, true
  )$$,
  'an active guest can publish a temporary presence for discovery'
);

SELECT lives_ok(
  $$SELECT public.create_reel_guest_discovery_location(
    'e4000000-0000-4000-8000-000000000012',
    9.7000, 4.0500, now() + interval '15 minutes'
  )$$,
  'a guest discovery point is stored through the service-only function'
);

SELECT is(
  (SELECT count(*)::integer
   FROM public.list_reel_guest_discovery_presence(
     'e4000000-0000-4000-8000-000000000012', 30
   )
   WHERE actor_kind = 'guest' AND display_name = 'Awa'),
  1,
  'a guest can discover another guest within the publisher radius'
);

SELECT lives_ok(
  $$SELECT public.create_reel_discovery_location(
    'e4000000-0000-4000-8000-000000000001',
    9.7000, 4.0500, now() + interval '15 minutes'
  )$$,
  'an active member discovery point can be prepared by the server'
);

SET LOCAL ROLE authenticated;
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"e4000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

SELECT is(
  (SELECT count(*)::integer
   FROM public.list_reel_guest_presence_for_member(30)
   WHERE display_name = 'Awa'),
  1,
  'a member can discover a guest presence inside its published radius'
);

SELECT ok(
  NOT has_table_privilege('authenticated', 'public.reel_guest_discovery_locations', 'SELECT')
  AND NOT has_table_privilege('anon', 'public.reel_guest_discovery_locations', 'SELECT')
  AND NOT has_table_privilege('authenticated', 'public.reel_guest_presences', 'SELECT'),
  'browser roles cannot read exact guest locations or private guest records'
);

SELECT ok(
  NOT has_function_privilege(
    'authenticated',
    'public.list_reel_guest_discovery_presence(uuid,integer)',
    'EXECUTE'
  )
  AND has_function_privilege(
    'authenticated',
    'public.list_reel_guest_presence_for_member(integer)',
    'EXECUTE'
  ),
  'guest discovery remains server-only while member discovery uses its authenticated guard'
);

SELECT is(
  (SELECT count(*)::integer FROM public.reel_guest_discovery_locations
   WHERE guest_session_id = 'e4000000-0000-4000-8000-000000000012'),
  1,
  'the discovery point remains temporary and separate from the public card response'
);

SELECT * FROM finish();
ROLLBACK;
