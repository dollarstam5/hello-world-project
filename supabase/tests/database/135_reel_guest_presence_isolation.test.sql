BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(7);

INSERT INTO public.reel_guest_sessions (id, token_hash, purpose, expires_at)
VALUES (
  'e3000000-0000-4000-8000-000000000001',
  repeat('a', 64),
  'reel_guest',
  now() + interval '30 minutes'
);

SET LOCAL ROLE service_role;
SELECT set_config('request.jwt.claims', '{"role":"service_role"}', true);

SELECT lives_ok(
  $$SELECT public.create_reel_guest_presence(
    'e3000000-0000-4000-8000-000000000001',
    'Awa', 'avatar-blue', 'Bonamoussadi', 'Disponible pour aider',
    100, 9.7000, 4.0500, 60, true
  )$$,
  'an active temporary guest session can publish a consented presence'
);

SELECT is(
  (SELECT count(*)::integer FROM public.reel_guest_presences
   WHERE guest_session_id = 'e3000000-0000-4000-8000-000000000001' AND status = 'active'),
  1,
  'guest presence is stored separately from member presences'
);

SELECT ok(
  NOT has_table_privilege('authenticated', 'public.reel_guest_presences', 'SELECT')
  AND NOT has_table_privilege('anon', 'public.reel_guest_presences', 'SELECT')
  AND NOT has_table_privilege('authenticated', 'public.reel_guest_sessions', 'SELECT')
  AND NOT has_table_privilege('anon', 'public.reel_guest_sessions', 'SELECT'),
  'browser roles cannot read guest sessions or exact guest presence points'
);

SELECT is(
  (SELECT count(*)::integer FROM public.reel_presences),
  0,
  'guest publication does not create a member presence'
);

SELECT lives_ok(
  $$SELECT public.end_reel_guest_presence(
    'e3000000-0000-4000-8000-000000000001',
    (SELECT id FROM public.reel_guest_presences
     WHERE guest_session_id = 'e3000000-0000-4000-8000-000000000001' AND status = 'active')
  )$$,
  'a guest can end its own temporary presence through the server-only function'
);

SELECT is(
  (SELECT count(*)::integer FROM public.reel_guest_presences
   WHERE guest_session_id = 'e3000000-0000-4000-8000-000000000001'),
  0,
  'ending a guest presence immediately erases its exact location and temporary record'
);

UPDATE public.reel_guest_sessions
SET revoked_at = now()
WHERE id = 'e3000000-0000-4000-8000-000000000001';

SELECT throws_ok(
  $$SELECT public.create_reel_guest_presence(
    'e3000000-0000-4000-8000-000000000001',
    'Awa', 'avatar-blue', 'Bonamoussadi', 'Disponible pour aider',
    100, 9.7000, 4.0500, 60, true
  )$$,
  '42501',
  'active_guest_session_required',
  'a revoked guest session cannot publish a presence'
);

SELECT * FROM finish();
ROLLBACK;
