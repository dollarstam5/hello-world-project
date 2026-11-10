BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(6);

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
) VALUES
  ('d2000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'reel-discoverer@example.invalid', '', now(), '{}', '{"display_name":"Awa"}'),
  ('d2000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'reel-presence@example.invalid', '', now(), '{}', '{"display_name":"Moussa"}');

-- The trusted server resolver creates the short-lived discovery session and
-- the one-use publication grant. No browser role can write either table.
RESET ROLE;
SET LOCAL ROLE service_role;
INSERT INTO public.reel_discovery_sessions (user_id, zone_key, expires_at)
VALUES (
  'd2000000-0000-4000-8000-000000000001',
  'z1_cccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
  now() + interval '15 minutes'
);
INSERT INTO public.reel_zone_grants (id, owner_id, zone_key, purpose, expires_at)
VALUES (
  'd2000000-0000-4000-8000-000000000221',
  'd2000000-0000-4000-8000-000000000002',
  'z1_cccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
  'presence',
  now() + interval '5 minutes'
);
SET LOCAL ROLE authenticated;
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"d2000000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);
SELECT lives_ok(
  $$SELECT public.start_reel_presence_from_grant(
    'd2000000-0000-4000-8000-000000000221',
    'Votre secteur approximatif',
    'Disponible maintenant',
    100,
    30,
    true
  )$$,
  'another member publishes an approximate presence in the same zone'
);

SELECT throws_ok(
  $$SELECT public.list_reel_discovery_presence()$$,
  '42501',
  'reel_discovery_consent_required',
  'a presence owner cannot discover without separate discovery consent'
);

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"d2000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);
SELECT is(
  (SELECT count(*)::integer FROM public.reel_presences WHERE owner_id = auth.uid() AND status = 'active'),
  0,
  'discovery does not require publishing the discoverer presence'
);
SELECT is(
  (SELECT count(*)::integer FROM public.list_reel_discovery_presence()),
  1,
  'a discovery session can observe nearby presence without own presence'
);
SELECT ok(
  public.reel_can_read_zone('z1_cccccccccccccccccccccccccccccccccccccccccccccccccccccccc'),
  'discovery permission grants read access only to the server-issued zone'
);
SELECT ok(
  NOT has_function_privilege('anon', 'public.list_reel_discovery_presence(integer)', 'EXECUTE'),
  'anonymous visitors cannot call authenticated discovery'
);

SELECT * FROM finish();
ROLLBACK;
