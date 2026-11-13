BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(5);

SELECT ok(
  NOT has_function_privilege('anon', 'public.list_public_flashes(integer)', 'EXECUTE')
  AND NOT has_function_privilege('authenticated', 'public.list_public_flashes(integer)', 'EXECUTE'),
  'the global feed without visitor coordinates is no longer publicly executable'
);
SELECT ok(
  position('raw_distance_m <= LEAST' IN pg_get_functiondef(
    'public.scan_public_flashes(text,text,double precision,double precision,double precision,integer)'::regprocedure
  )) > 0,
  'Scan filters on raw metric distance before presentation rounding'
);
SELECT ok(
  position('latitude' IN pg_get_function_result(
    'public.scan_public_flashes(text,text,double precision,double precision,double precision,integer)'::regprocedure
  )) = 0
  AND position('longitude' IN pg_get_function_result(
    'public.scan_public_flashes(text,text,double precision,double precision,double precision,integer)'::regprocedure
  )) = 0,
  'Scan never returns precise coordinates'
);

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
) VALUES (
  'f5400000-0000-4000-8000-000000000001',
  'authenticated', 'authenticated', 'flash-scope-scan@example.invalid', '', now(), '{}', '{}'
);

INSERT INTO public.flashes (
  id, author_id, title, body, status, expires_at,
  kind, category, time_slot, area_label, scope, urgency
) VALUES
  ('f5500000-0000-4000-8000-000000000001','f5400000-0000-4000-8000-000000000001','500m inside','test','live',(extract(epoch FROM now())*1000)::bigint+3600000,'need','personal','today','Akwa','current_area','today'),
  ('f5500000-0000-4000-8000-000000000002','f5400000-0000-4000-8000-000000000001','500m outside','test','live',(extract(epoch FROM now())*1000)::bigint+3600000,'need','personal','today','Akwa','current_area','today'),
  ('f5500000-0000-4000-8000-000000000003','f5400000-0000-4000-8000-000000000001','2km inside','test','live',(extract(epoch FROM now())*1000)::bigint+3600000,'need','personal','today','Akwa','expanded_area','today'),
  ('f5500000-0000-4000-8000-000000000004','f5400000-0000-4000-8000-000000000001','2km outside','test','live',(extract(epoch FROM now())*1000)::bigint+3600000,'need','personal','today','Akwa','expanded_area','today'),
  ('f5500000-0000-4000-8000-000000000005','f5400000-0000-4000-8000-000000000001','5km inside','test','live',(extract(epoch FROM now())*1000)::bigint+3600000,'need','personal','today','Akwa','half_city','today'),
  ('f5500000-0000-4000-8000-000000000006','f5400000-0000-4000-8000-000000000001','5km outside','test','live',(extract(epoch FROM now())*1000)::bigint+3600000,'need','personal','today','Akwa','half_city','today'),
  ('f5500000-0000-4000-8000-000000000007','f5400000-0000-4000-8000-000000000001','15km inside','test','live',(extract(epoch FROM now())*1000)::bigint+3600000,'need','personal','today','Akwa','whole_city','today'),
  ('f5500000-0000-4000-8000-000000000008','f5400000-0000-4000-8000-000000000001','15km outside','test','live',(extract(epoch FROM now())*1000)::bigint+3600000,'need','personal','today','Akwa','whole_city','today'),
  ('f5500000-0000-4000-8000-000000000009','f5400000-0000-4000-8000-000000000001','visitor radius inside','test','live',(extract(epoch FROM now())*1000)::bigint+3600000,'need','personal','today','Akwa','whole_city','today'),
  ('f5500000-0000-4000-8000-000000000010','f5400000-0000-4000-8000-000000000001','visitor radius outside','test','live',(extract(epoch FROM now())*1000)::bigint+3600000,'need','personal','today','Akwa','whole_city','today');

INSERT INTO public.flash_private_locations (
  flash_id, author_id, latitude, longitude, accuracy_meters
)
SELECT
  v.id,
  'f5400000-0000-4000-8000-000000000001'::uuid,
  0.0,
  degrees(v.distance_m / 6371000.0),
  10
FROM (VALUES
  ('f5500000-0000-4000-8000-000000000001'::uuid, 499.0),
  ('f5500000-0000-4000-8000-000000000002'::uuid, 501.0),
  ('f5500000-0000-4000-8000-000000000003'::uuid, 1999.0),
  ('f5500000-0000-4000-8000-000000000004'::uuid, 2001.0),
  ('f5500000-0000-4000-8000-000000000005'::uuid, 4999.0),
  ('f5500000-0000-4000-8000-000000000006'::uuid, 5001.0),
  ('f5500000-0000-4000-8000-000000000007'::uuid, 14999.0),
  ('f5500000-0000-4000-8000-000000000008'::uuid, 15001.0),
  ('f5500000-0000-4000-8000-000000000009'::uuid, 400.0),
  ('f5500000-0000-4000-8000-000000000010'::uuid, 600.0)
) AS v(id, distance_m);

SELECT is(
  (SELECT count(*)::integer FROM public.scan_public_flashes(NULL,NULL,0,0,50,50)),
  4,
  'all four author scopes cap results at 500 m, 2 km, 5 km and 15 km'
);
SELECT is(
  (SELECT count(*)::integer FROM public.scan_public_flashes(NULL,NULL,0,0,0.5,50)),
  2,
  'visitor radius can further reduce results below the author scope'
);

SELECT * FROM finish();
ROLLBACK;
