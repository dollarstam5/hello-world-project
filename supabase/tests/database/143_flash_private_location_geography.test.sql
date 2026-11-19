BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(12);

SELECT has_column(
  'public', 'flash_private_locations', 'location',
  'Flash private locations include the derived geography column'
);
SELECT col_not_null(
  'public', 'flash_private_locations', 'location',
  'derived geography is constrained NOT NULL'
);
SELECT has_trigger(
  'public', 'flash_private_locations', 'flash_private_location_geography_sync',
  'A trigger synchronizes private geography'
);
SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'flash_private_locations'
      AND indexname = 'flash_private_locations_geography_gist'
  ),
  'the private geography column has a GiST index'
);
SELECT ok(
  NOT has_function_privilege(
    'authenticated',
    'public.sync_flash_private_location_geography()',
    'EXECUTE'
  ),
  'authenticated users cannot execute the trigger function directly'
);
SELECT ok(
  NOT has_table_privilege('authenticated', 'public.flash_private_locations', 'INSERT')
  AND NOT has_table_privilege('authenticated', 'public.flash_private_locations', 'UPDATE')
  AND NOT has_table_privilege('authenticated', 'public.flash_private_locations', 'DELETE')
  AND NOT has_table_privilege('anon', 'public.flash_private_locations', 'INSERT')
  AND NOT has_table_privilege('anon', 'public.flash_private_locations', 'UPDATE')
  AND NOT has_table_privilege('anon', 'public.flash_private_locations', 'DELETE'),
  'authenticated and anon cannot directly write private location rows'
);

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
) VALUES (
  'f6400000-0000-4000-8000-000000000001',
  'authenticated', 'authenticated', 'flash-geography@example.invalid', '', now(), '{}', '{}'
);

INSERT INTO public.flashes (
  id, author_id, title, body, status, expires_at,
  kind, category, time_slot, area_label, scope, urgency
) VALUES (
  'f6500000-0000-4000-8000-000000000001',
  'f6400000-0000-4000-8000-000000000001',
  'Geography test', 'Test content', 'draft',
  (extract(epoch FROM now()) * 1000)::bigint + 3600000,
  'need', 'personal', 'today', 'Akwa', 'current_area', 'today'
);

INSERT INTO public.flash_private_locations (
  flash_id, author_id, latitude, longitude, accuracy_meters
) VALUES (
  'f6500000-0000-4000-8000-000000000001',
  'f6400000-0000-4000-8000-000000000001',
  4.0511, 9.7679, 10
);

SELECT ok(
  extensions.ST_Distance(
    (SELECT location FROM public.flash_private_locations
     WHERE flash_id = 'f6500000-0000-4000-8000-000000000001'),
    extensions.ST_SetSRID(extensions.ST_MakePoint(9.7679, 4.0511), 4326)::extensions.geography
  ) < 0.01,
  'insert derives geography using longitude then latitude'
);

UPDATE public.flash_private_locations
SET location = extensions.ST_SetSRID(
  extensions.ST_MakePoint(0, 0), 4326
)::extensions.geography
WHERE flash_id = 'f6500000-0000-4000-8000-000000000001';

SELECT ok(
  extensions.ST_Distance(
    (SELECT location FROM public.flash_private_locations
     WHERE flash_id = 'f6500000-0000-4000-8000-000000000001'),
    extensions.ST_SetSRID(extensions.ST_MakePoint(9.7679, 4.0511), 4326)::extensions.geography
  ) < 0.01,
  'a forged geography value is overwritten by canonical coordinates'
);

UPDATE public.flash_private_locations
SET latitude = 4.06, longitude = 9.78
WHERE flash_id = 'f6500000-0000-4000-8000-000000000001';

SELECT ok(
  extensions.ST_Distance(
    (SELECT location FROM public.flash_private_locations
     WHERE flash_id = 'f6500000-0000-4000-8000-000000000001'),
    extensions.ST_SetSRID(extensions.ST_MakePoint(9.78, 4.06), 4326)::extensions.geography
  ) < 0.01,
  'coordinate updates refresh the derived geography'
);

UPDATE public.flash_private_locations
SET accuracy_meters = 25
WHERE flash_id = 'f6500000-0000-4000-8000-000000000001';

SELECT ok(
  extensions.ST_Distance(
    (SELECT location FROM public.flash_private_locations
     WHERE flash_id = 'f6500000-0000-4000-8000-000000000001'),
    extensions.ST_SetSRID(extensions.ST_MakePoint(9.78, 4.06), 4326)::extensions.geography
  ) < 0.01,
  'accuracy-only updates preserve geography derived from canonical coordinates'
);

SELECT throws_ok(
  $$UPDATE public.flash_private_locations
    SET latitude = 91
    WHERE flash_id = 'f6500000-0000-4000-8000-000000000001'$$,
  '22023', 'invalid_flash_private_location',
  'invalid latitude is rejected by the trigger'
);

SELECT throws_ok(
  $$UPDATE public.flash_private_locations
    SET longitude = 181
    WHERE flash_id = 'f6500000-0000-4000-8000-000000000001'$$,
  '22023', 'invalid_flash_private_location',
  'invalid longitude is rejected by the trigger'
);

RESET ROLE;
SELECT * FROM finish();
ROLLBACK;
