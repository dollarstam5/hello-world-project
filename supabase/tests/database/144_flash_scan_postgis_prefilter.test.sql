BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(8);

SELECT ok(
  position('ST_DWithin' IN pg_get_functiondef(
    'public.scan_public_flashes(text,text,double precision,double precision,double precision,integer)'::regprocedure
  )) > 0,
  'Scan uses PostGIS ST_DWithin for the visitor-radius spatial prefilter'
);
SELECT ok(
  position('loc.location' IN pg_get_functiondef(
    'public.scan_public_flashes(text,text,double precision,double precision,double precision,integer)'::regprocedure
  )) > 0,
  'the spatial prefilter uses the derived private geography column'
);
SELECT ok(
  position('ST_Distance' IN pg_get_functiondef(
    'public.scan_public_flashes(text,text,double precision,double precision,double precision,integer)'::regprocedure
  )) > 0,
  'Scan computes final distance with PostGIS ST_Distance'
);
SELECT ok(
  position('latitude' IN pg_get_function_result(
    'public.scan_public_flashes(text,text,double precision,double precision,double precision,integer)'::regprocedure
  )) = 0
  AND position('longitude' IN pg_get_function_result(
    'public.scan_public_flashes(text,text,double precision,double precision,double integer)'::regprocedure
  )) = 0,
  'Scan public return schema does not expose private latitude or longitude'
);

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
) VALUES (
  'f7400000-0000-4000-8000-000000000001',
  'authenticated', 'authenticated', 'scan-b4-prefilter@example.invalid', '', now(), '{}', '{}'
);

INSERT INTO public.flashes (
  id, author_id, title, body, status, expires_at,
  kind, category, time_slot, area_label, scope, urgency
) VALUES
  ('f7500000-0000-4000-8000-000000000001','f7400000-0000-4000-8000-000000000001','B4 geospatial 400m','B4 geospatial test','live',(extract(epoch FROM now())*1000)::bigint+3600000,'need','personal','today','Akwa','current_area','today'),
  ('f7500000-0000-4000-8000-000000000002','f7400000-0000-4000-8000-000000000001','B4 geospatial 1500m','B4 geospatial test','live',(extract(epoch FROM now())*1000)::bigint+3600000,'need','personal','today','Akwa','expanded_area','today'),
  ('f7500000-0000-4000-8000-000000000003','f7400000-0000-4000-8000-000000000001','B4 geospatial author cutoff','B4 geospatial test','live',(extract(epoch FROM now())*1000)::bigint+3600000,'need','personal','today','Akwa','current_area','today'),
  ('f7500000-0000-4000-8000-000000000004','f7400000-0000-4000-8000-000000000001','B4 geospatial visitor cutoff','B4 geospatial test','live',(extract(epoch FROM now())*1000)::bigint+3600000,'need','personal','today','Akwa','whole_city','today');

INSERT INTO public.flash_private_locations (
  flash_id, author_id, latitude, longitude, accuracy_meters
)
SELECT
  v.id,
  'f7400000-0000-4000-8000-000000000001'::uuid,
  0.0,
  degrees(v.distance_m / 6371000.0),
  8
FROM (VALUES
  ('f7500000-0000-4000-8000-000000000001'::uuid, 400.0),
  ('f7500000-0000-4000-8000-000000000002'::uuid, 1500.0),
  ('f7500000-0000-4000-8000-000000000003'::uuid, 501.0),
  ('f7500000-0000-4000-8000-000000000004'::uuid, 3000.0)
) AS v(id, distance_m);

SELECT is(
  (SELECT count(*)::integer
   FROM public.scan_public_flashes('B4 geospatial',NULL,0,0,2,50)),
  2,
  'visitor radius of 2 km and author scopes admit only 400 m and 1.5 km test rows'
);
SELECT is(
  (SELECT count(*)::integer
   FROM public.scan_public_flashes('B4 geospatial',NULL,0,0,1,50)),
  1,
  'reducing visitor radius to 1 km further filters candidates'
);
SELECT is(
  (SELECT array_agg(s.id ORDER BY s.distance_km, s.created_at DESC, s.id)
   FROM public.scan_public_flashes('B4 geospatial',NULL,0,0,2,50) AS s),
  ARRAY[
    'f7500000-0000-4000-8000-000000000001'::uuid,
    'f7500000-0000-4000-8000-000000000002'::uuid
  ],
  'accepted results are returned in increasing distance order'
);

SELECT * FROM finish();
ROLLBACK;
