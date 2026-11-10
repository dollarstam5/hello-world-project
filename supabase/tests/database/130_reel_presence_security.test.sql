BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(24);

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
) VALUES
  ('d1000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'reel-a@example.invalid', '', now(), '{}', '{"display_name":"Awa"}'),
  ('d1000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'reel-b@example.invalid', '', now(), '{}', '{"display_name":"Moussa"}'),
  ('d1000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'reel-c@example.invalid', '', now(), '{}', '{"display_name":"Nadia"}');

-- Nominal path first: all three profiles remain active while discovery,
-- bip delivery, idempotent retry and acceptance are exercised.
SET LOCAL ROLE authenticated;
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"d1000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

SELECT throws_ok(
  $$SELECT public.start_reel_presence(
    'douala-zone-0001', 'Akwa', 'Disponible pour un coup de main', 100, 60, false
  )$$,
  '42501',
  'presence_consent_required',
  'presence cannot start without explicit consent'
);

SELECT lives_ok(
  $$SELECT public.start_reel_presence(
    'douala-zone-0001', 'Akwa', 'Disponible pour un coup de main', 100, 60, true
  )$$,
  'member A starts an opted-in presence'
);

SELECT is(
  (SELECT count(*)::integer FROM public.reel_presences WHERE owner_id = auth.uid() AND status = 'active'),
  1,
  'member A has one active presence'
);

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"d1000000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);

SELECT lives_ok(
  $$SELECT public.start_reel_presence(
    'douala-zone-0001', 'Akwa', 'Je peux aider pour un déménagement', 100, 120, true
  )$$,
  'member B starts in the same approximate zone'
);

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"d1000000-0000-4000-8000-000000000003","role":"authenticated"}',
  true
);

SELECT lives_ok(
  $$SELECT public.start_reel_presence(
    'bonanjo-zone-0001', 'Bonanjo', 'Disponible pour une course', 1000, 30, true
  )$$,
  'member C starts in a different approximate zone'
);

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"d1000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

SELECT is(
  (SELECT count(*)::integer FROM public.list_reel_presence('douala-zone-0001', 50)),
  1,
  'presence discovery returns only the other active member in the same zone'
);

SELECT is(
  (SELECT count(*)::integer FROM public.reel_presences),
  2,
  'row-level security hides members outside the caller active zone'
);

SELECT lives_ok(
  $$SELECT public.send_reel_bip(
    (SELECT id FROM public.reel_presences WHERE owner_id = 'd1000000-0000-4000-8000-000000000002'),
    'd1000000-0000-4000-8000-000000000101'
  )$$,
  'member A can send a bip to a visible active presence'
);

SELECT is(
  (SELECT count(*)::integer FROM public.list_reel_bips()),
  1,
  'sender can see the pending bip in Reel'
);

SELECT lives_ok(
  $$SELECT public.send_reel_bip(
    (SELECT id FROM public.reel_presences WHERE owner_id = 'd1000000-0000-4000-8000-000000000002'),
    'd1000000-0000-4000-8000-000000000101'
  )$$,
  'retrying the same client request is idempotent'
);

SELECT is(
  (
    SELECT id
    FROM public.send_reel_bip(
      (SELECT id FROM public.reel_presences WHERE owner_id = 'd1000000-0000-4000-8000-000000000002'),
      'd1000000-0000-4000-8000-000000000102'
    )
  ),
  (
    SELECT id FROM public.reel_bips
    WHERE client_request_id = 'd1000000-0000-4000-8000-000000000101'
  ),
  'a second pending bip for the same pair reuses the existing request'
);

SELECT lives_ok(
  $reel$SELECT public.end_reel_presence(
    (SELECT id FROM public.reel_presences WHERE owner_id = auth.uid() AND status = 'active')
  )$reel$,
  'member A can end their own presence'
);

SELECT ok(
  (
    SELECT expires_at BETWEEN
      (extract(epoch FROM now()) * 1000)::bigint + 86390000
      AND (extract(epoch FROM now()) * 1000)::bigint + 86410000
    FROM public.reel_bips
    WHERE client_request_id = 'd1000000-0000-4000-8000-000000000101'
  ),
  'ending a presence starts the 24-hour pending-bip retention window'
);

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"d1000000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);

SELECT lives_ok(
  $reel$SELECT public.command_reel_bip(
    (SELECT id FROM public.reel_bips WHERE client_request_id = 'd1000000-0000-4000-8000-000000000101'),
    'accept'
  )$reel$,
  'only the recipient accepts the bip'
);

SELECT is(
  (SELECT count(*)::integer FROM public.reel_connections
   WHERE participant_low = 'd1000000-0000-4000-8000-000000000001'
     AND participant_high = 'd1000000-0000-4000-8000-000000000002'
     AND status = 'active'),
  1,
  'acceptance creates one durable connection'
);

SELECT is(
  (SELECT count(*)::integer FROM public.list_reel_bips()),
  0,
  'accepted bip disappears from the pending bip list'
);

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"d1000000-0000-4000-8000-000000000003","role":"authenticated"}',
  true
);

SELECT is(
  (SELECT count(*)::integer FROM public.reel_connections),
  0,
  'a third member cannot read a connection between two other people'
);

SELECT ok(
  NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'reel_presences'
      AND column_name IN ('latitude', 'longitude', 'gps_coordinates')
  ),
  'presence storage contains no exact GPS coordinate columns'
);

SELECT ok(
  NOT has_table_privilege('anon', 'public.reel_presences', 'SELECT')
  AND NOT has_table_privilege('anon', 'public.reel_bips', 'SELECT')
  AND NOT has_function_privilege('anon', 'public.start_reel_presence(text,text,text,integer,integer,boolean)', 'EXECUTE'),
  'anonymous visitors cannot read or start a presence'
);

-- Suspension checks are intentionally last so they cannot invalidate the
-- normal discovery and connection scenarios above.
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"d1000000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);
UPDATE public.profiles SET status = 'suspended'
WHERE id = 'd1000000-0000-4000-8000-000000000002';

SELECT throws_ok(
  $$SELECT public.list_reel_bips()$$,
  '42501',
  'active_profile_required',
  'a suspended member cannot list bips'
);

SELECT throws_ok(
  $$SELECT public.command_reel_bip(
    (SELECT id FROM public.reel_bips WHERE client_request_id = 'd1000000-0000-4000-8000-000000000101'),
    'accept'
  )$$,
  '42501',
  'active_profile_required',
  'a suspended member cannot replay a previously accepted bip command'
);

SELECT lives_ok(
  $$SELECT public.end_reel_presence(
    (SELECT id FROM public.reel_presences WHERE owner_id = 'd1000000-0000-4000-8000-000000000002' AND status = 'active')
  )$$,
  'a suspended member can still stop their own presence'
);

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"d1000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);
UPDATE public.profiles SET status = 'suspended'
WHERE id = 'd1000000-0000-4000-8000-000000000001';

SELECT throws_ok(
  $$SELECT public.send_reel_bip(
    (SELECT id FROM public.reel_presences WHERE owner_id = 'd1000000-0000-4000-8000-000000000002'),
    'd1000000-0000-4000-8000-000000000101'
  )$$,
  '42501',
  'active_profile_required',
  'a suspended sender cannot replay an old idempotent request'
);

SELECT is(
  (SELECT provolatile::text FROM pg_proc
   WHERE oid = 'public.list_reel_bips()'::regprocedure),
  'v',
  'bip listing is VOLATILE because it performs expiry cleanup'
);

SELECT * FROM finish();
ROLLBACK;
