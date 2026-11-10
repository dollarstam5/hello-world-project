BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(4);

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
) VALUES
  ('d4000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'reel-bip-sender@example.invalid', '', now(), '{}', '{"display_name":"Awa"}'),
  ('d4000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'reel-bip-recipient@example.invalid', '', now(), '{}', '{"display_name":"Moussa"}');

RESET ROLE;
SET LOCAL ROLE service_role;
INSERT INTO public.reel_zone_grants (id, owner_id, zone_key, purpose, expires_at, location)
VALUES
  ('d4000000-0000-4000-8000-000000000401', 'd4000000-0000-4000-8000-000000000001', 'z1_11111111111111111111111111111111111111111111111111111111', 'presence', now() + interval '5 minutes', extensions.ST_SetSRID(extensions.ST_MakePoint(0, 0), 4326)::extensions.geography),
  ('d4000000-0000-4000-8000-000000000402', 'd4000000-0000-4000-8000-000000000002', 'z1_22222222222222222222222222222222222222222222222222222222', 'presence', now() + interval '5 minutes', extensions.ST_SetSRID(extensions.ST_MakePoint(0.00005, 0), 4326)::extensions.geography);

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"d4000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
SELECT lives_ok(
  $$SELECT public.start_reel_presence_from_grant(
    'd4000000-0000-4000-8000-000000000401', 'Secteur A', 'Disponible', 100, 30, true
  )$$,
  'sender publishes a presence'
);

SELECT set_config('request.jwt.claims', '{"sub":"d4000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
SELECT lives_ok(
  $$SELECT public.start_reel_presence_from_grant(
    'd4000000-0000-4000-8000-000000000402', 'Secteur B', 'Disponible', 25, 30, true
  )$$,
  'recipient publishes a presence in a different opaque HMAC cell'
);

SELECT set_config('request.jwt.claims', '{"sub":"d4000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
SELECT lives_ok(
  $$SELECT public.send_reel_bip(
    (SELECT id FROM public.reel_presences WHERE owner_id = 'd4000000-0000-4000-8000-000000000002' AND status = 'active'),
    'd4000000-0000-4000-8000-000000000411'
  )$$,
  'a bip is allowed across different HMAC cells when PostGIS confirms the recipient visibility radius'
);

SELECT is(
  (SELECT count(*)::integer FROM public.list_reel_bips()),
  1,
  'the metric-radius bip is visible to its sender'
);

SELECT * FROM finish();
ROLLBACK;
