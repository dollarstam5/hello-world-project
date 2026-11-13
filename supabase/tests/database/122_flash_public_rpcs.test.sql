BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(22);

SELECT has_function(
  'public', 'list_public_flashes', ARRAY['integer'],
  'The public Flash feed RPC exists'
);
SELECT has_function(
  'public', 'scan_public_flashes',
  ARRAY['text', 'text', 'double precision', 'double precision', 'double precision', 'integer'],
  'The public Scan RPC exists'
);
SELECT has_function(
  'public', 'transition_flash', ARRAY['uuid', 'text'],
  'The author-only Flash transition RPC exists'
);
SELECT has_function(
  'public', 'set_flash_location',
  ARRAY['uuid', 'double precision', 'double precision', 'double precision'],
  'The private Flash location RPC exists'
);

SELECT ok(
  has_function_privilege('anon', 'public.list_public_flashes(integer)', 'EXECUTE')
  AND has_function_privilege('anon', 'public.scan_public_flashes(text,text,double precision,double precision,double precision,integer)', 'EXECUTE'),
  'anonymous clients can call only the public feed and proximity search'
);
SELECT ok(
  has_function_privilege('authenticated', 'public.transition_flash(uuid,text)', 'EXECUTE')
  AND has_function_privilege('authenticated', 'public.set_flash_location(uuid,double precision,double precision,double precision)', 'EXECUTE')
  AND NOT has_function_privilege('anon', 'public.transition_flash(uuid,text)', 'EXECUTE')
  AND NOT has_function_privilege('anon', 'public.set_flash_location(uuid,double precision,double precision,double precision)', 'EXECUTE'),
  'write RPCs are restricted to authenticated clients'
);
SELECT ok(
  position('flash_private_locations' IN pg_get_functiondef('public.scan_public_flashes(text,text,double precision,double precision,double precision,integer)'::regprocedure)) > 0
  AND position('flash_private_locations' IN pg_get_functiondef('public.set_flash_location(uuid,double precision,double precision,double precision)'::regprocedure)) > 0,
  'Scan reads and location writes use the private coordinate table'
);
SELECT ok(
  position('latitude' IN pg_get_function_result('public.scan_public_flashes(text,text,double precision,double precision,double precision,integer)'::regprocedure)) = 0
  AND position('longitude' IN pg_get_function_result('public.scan_public_flashes(text,text,double precision,double precision,double precision,integer)'::regprocedure)) = 0,
  'Scan RPC result contains no precise coordinate columns'
);
SELECT ok(
  NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'flashes'
      AND column_name IN ('latitude', 'longitude', 'accuracy_meters')
  ),
  'precise coordinates are absent from synchronised flashes rows'
);

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
) VALUES
  ('f5000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'flash-rpc-a@example.invalid', '', now(), '{}', '{"display_name":"Flash A"}'),
  ('f5000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'flash-rpc-b@example.invalid', '', now(), '{}', '{"display_name":"Flash B"}');

INSERT INTO public.flashes (
  id, author_id, title, body, status, expires_at,
  kind, category, time_slot, area_label
) VALUES
  (
    'f5100000-0000-4000-8000-000000000001',
    'f5000000-0000-4000-8000-000000000001',
    'Besoin de transport', 'Un trajet local', 'live',
    (extract(epoch FROM now()) * 1000)::bigint + 3600000,
    'need', 'transport', 'now', 'Bonapriso'
  ),
  (
    'f5100000-0000-4000-8000-000000000002',
    'f5000000-0000-4000-8000-000000000001',
    'Brouillon privé', 'Ne pas afficher', 'draft',
    (extract(epoch FROM now()) * 1000)::bigint + 3600000,
    'offer', 'personal', 'today', 'Akwa'
  );

INSERT INTO public.flash_private_locations (
  flash_id, author_id, latitude, longitude, accuracy_meters
) VALUES (
  'f5100000-0000-4000-8000-000000000001',
  'f5000000-0000-4000-8000-000000000001',
  4.0200, 9.6900, 25
);

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"f5000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);
SET LOCAL ROLE authenticated;

SELECT is(
  (SELECT count(*)::integer FROM public.list_public_flashes(50)),
  1,
  'public feed returns the live valid Flash but not its draft'
);
SELECT is(
  (SELECT count(*)::integer FROM public.scan_public_flashes(
    NULL, NULL, 4.0200, 9.6900, 5, 50
  )),
  1,
  'Scan finds a live Flash using its private location'
);
SELECT ok(
  abs((
    SELECT distance_km
    FROM public.scan_public_flashes(NULL, NULL, 4.0200, 9.6900, 5, 50)
    LIMIT 1
  )) < 0.01,
  'Scan returns distance, not the stored coordinates'
);
SELECT ok(
  (SELECT public.set_flash_location(
    'f5100000-0000-4000-8000-000000000001', 4.0210, 9.6910, 15
  )),
  'the author can update their precise location'
);
SELECT is(
  (SELECT latitude FROM public.flash_private_locations
   WHERE flash_id = 'f5100000-0000-4000-8000-000000000001'),
  4.0210::double precision,
  'location update is stored in the private table'
);
SELECT throws_ok(
  $$SELECT public.set_flash_location(
    'f5100000-0000-4000-8000-000000000001', 91, 9.69, 15
  )$$,
  '22023', 'invalid_location',
  'invalid coordinates are rejected'
);

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"f5000000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);
SELECT throws_ok(
  $$SELECT public.set_flash_location(
    'f5100000-0000-4000-8000-000000000001', 4.02, 9.69, 15
  )$$,
  '42501', 'flash_not_found_or_not_owner',
  'another member cannot change the Flash location'
);
SELECT is(
  (SELECT public.transition_flash(
    'f5100000-0000-4000-8000-000000000001', 'archived'
  )),
  FALSE,
  'another member cannot transition the Flash'
);

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"f5000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);
SELECT throws_ok(
  $$SELECT public.transition_flash(
    'f5100000-0000-4000-8000-000000000001', 'deleted'
  )$$,
  '22023', 'invalid_status',
  'unsupported Flash status is rejected'
);
SELECT is(
  (SELECT public.transition_flash(
    'f5100000-0000-4000-8000-000000000001', 'archived'
  )),
  TRUE,
  'the author can archive their own Flash'
);
SELECT is(
  (SELECT count(*)::integer FROM public.list_public_flashes(50)),
  0,
  'archived Flash is removed from the public feed'
);
SELECT throws_ok(
  $$SELECT public.scan_public_flashes(NULL, NULL, 4.02, 9.69, 51, 50)$$,
  '22023', 'invalid_scan_radius',
  'Scan rejects a radius above the 50 km safety cap'
);
SELECT throws_ok(
  $$SELECT public.scan_public_flashes(NULL, NULL, 91, 9.69, 5, 50)$$,
  '22023', 'invalid_scan_coordinates',
  'Scan rejects invalid coordinates'
);

RESET ROLE;
SELECT * FROM finish();
ROLLBACK;
