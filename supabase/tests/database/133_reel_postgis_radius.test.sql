BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(8);

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
) VALUES
  ('d3000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'reel-radius-discoverer@example.invalid', '', now(), '{}', '{"display_name":"Awa"}'),
  ('d3000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'reel-radius-near@example.invalid', '', now(), '{}', '{"display_name":"Moussa"}'),
  ('d3000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'reel-radius-outside@example.invalid', '', now(), '{}', '{"display_name":"Nadia"}'),
  ('d3000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated', 'reel-radius-wide@example.invalid', '', now(), '{}', '{"display_name":"Idriss"}');

RESET ROLE;
SET LOCAL ROLE service_role;

INSERT INTO public.reel_discovery_locations (user_id, location, expires_at)
VALUES (
  'd3000000-0000-4000-8000-000000000001',
  extensions.ST_SetSRID(extensions.ST_MakePoint(0, 0), 4326)::extensions.geography,
  now() + interval '15 minutes'
);

INSERT INTO public.reel_zone_grants (id, owner_id, zone_key, purpose, expires_at, location)
VALUES
  ('d3000000-0000-4000-8000-000000000301', 'd3000000-0000-4000-8000-000000000002', 'z1_dddddddddddddddddddddddddddddddddddddddddddddddddddddddd', 'presence', now() + interval '5 minutes', extensions.ST_SetSRID(extensions.ST_MakePoint(0.00005, 0), 4326)::extensions.geography),
  ('d3000000-0000-4000-8000-000000000302', 'd3000000-0000-4000-8000-000000000003', 'z1_eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', 'presence', now() + interval '5 minutes', extensions.ST_SetSRID(extensions.ST_MakePoint(0.0002, 0), 4326)::extensions.geography),
  ('d3000000-0000-4000-8000-000000000303', 'd3000000-0000-4000-8000-000000000004', 'z1_ffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 'presence', now() + interval '5 minutes', extensions.ST_SetSRID(extensions.ST_MakePoint(0.0002, 0), 4326)::extensions.geography);

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"d3000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
SELECT lives_ok(
  $$SELECT public.start_reel_presence_from_grant(
    'd3000000-0000-4000-8000-000000000301', 'Secteur proche', 'Disponible', 10, 30, true
  )$$,
  'a presence within 10 metres can be published with a 10 metre radius'
);

SELECT set_config('request.jwt.claims', '{"sub":"d3000000-0000-4000-8000-000000000003","role":"authenticated"}', true);
SELECT lives_ok(
  $$SELECT public.start_reel_presence_from_grant(
    'd3000000-0000-4000-8000-000000000302', 'Secteur proche', 'Disponible', 10, 30, true
  )$$,
  'a presence outside 10 metres can still publish with its own 10 metre visibility radius'
);

SELECT set_config('request.jwt.claims', '{"sub":"d3000000-0000-4000-8000-000000000004","role":"authenticated"}', true);
SELECT lives_ok(
  $$SELECT public.start_reel_presence_from_grant(
    'd3000000-0000-4000-8000-000000000303', 'Secteur proche', 'Disponible', 25, 30, true
  )$$,
  'a presence can choose a 25 metre visibility radius'
);

SELECT set_config('request.jwt.claims', '{"sub":"d3000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
SELECT is(
  (SELECT count(*)::integer FROM public.list_reel_discovery_presence()),
  2,
  'PostGIS returns the 5 metre and 22 metre presences only when their own radius includes the discoverer'
);

SELECT ok(
  NOT has_table_privilege('authenticated', 'public.reel_discovery_locations', 'SELECT')
  AND NOT has_table_privilege('authenticated', 'public.reel_presence_locations', 'SELECT')
  AND NOT has_table_privilege('anon', 'public.reel_discovery_locations', 'SELECT')
  AND NOT has_table_privilege('anon', 'public.reel_presence_locations', 'SELECT'),
  'exact PostGIS points remain inaccessible to browser roles'
);


SELECT set_config('request.jwt.claims', '{"sub":"d3000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
SELECT lives_ok(
  $$SELECT public.end_reel_presence(
    (SELECT id FROM public.reel_presences WHERE owner_id = auth.uid() AND status = 'active')
  )$$,
  'ending a presence succeeds'
);
RESET ROLE;
SET LOCAL ROLE service_role;
SELECT is(
  (SELECT count(*)::integer FROM public.reel_presence_locations
   WHERE presence_id IN (SELECT id FROM public.reel_presences WHERE owner_id = 'd3000000-0000-4000-8000-000000000002')),
  0,
  'the exact presence point is deleted immediately when presence ends'
);

RESET ROLE;
UPDATE public.reel_discovery_locations
SET expires_at = now() - interval '1 second'
WHERE user_id = 'd3000000-0000-4000-8000-000000000001';
SET LOCAL ROLE service_role;
SELECT public.purge_reel_location_sessions();
SELECT is(
  (SELECT count(*)::integer FROM public.reel_discovery_locations
   WHERE user_id = 'd3000000-0000-4000-8000-000000000001'),
  0,
  'the exact discovery point is deleted after its session expires'
);

SELECT * FROM finish();
ROLLBACK;
