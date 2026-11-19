BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(6);

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
  ('f5500000-0000-4000-8000-000000000009','f5400000-0000-4000-8000-000000000001','visitor radius inside','test','live',(extract(epoch FROM now())*1000)::bigint+3600000,'need','home','today','Akwa','whole_city','today'),
  ('f5500000-0000-4000-8000-000000000010','f5400000-0000-4000-8000-000000000001','visitor radius outside','test','live',(extract(epoch FROM now())*1000)::bigint+3600000,'need','home','today','Akwa','whole_city','today'),
  ('f5500000-0000-4000-8000-000000000011','f5400000-0000-4000-8000-000000000001','legacy scope missing','test','live',(extract(epoch FROM now())*1000)::bigint+3600000,'need','personal','today','Akwa',NULL,NULL);

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
  ('f5500000-0000-4000-8000-000000000010'::uuid, 600.0),
  ('f5500000-0000-4000-8000-000000000011'::uuid, 200.0)
) AS v(id, distance_m);

-- Temporary CI diagnostics: inspect fixture persistence and each Scan predicate before filtering.
SELECT diag(
  'SCAN142_DIAGNOSTICS=' || coalesce((
    SELECT jsonb_agg(jsonb_build_object(
      'id', f.id,
      'status', f.status,
      'kind', f.kind,
      'category', f.category,
      'time_slot', f.time_slot,
      'area_label', f.area_label,
      'scope', f.scope,
      'deleted_at', f.deleted_at,
      'expires_at', f.expires_at,
      'location_exists', loc.flash_id IS NOT NULL,
      'distance_m', CASE WHEN loc.location IS NOT NULL THEN round(extensions.ST_Distance(
        loc.location,
        extensions.ST_SetSRID(extensions.ST_MakePoint(0, 0), 4326)::extensions.geography
      )::numeric, 3) END,
      'scope_limit_m', CASE f.scope
        WHEN 'current_area' THEN 500.0 WHEN 'expanded_area' THEN 2000.0
        WHEN 'half_city' THEN 5000.0 WHEN 'whole_city' THEN 15000.0 END,
      'eligible_status', f.status = 'live' AND f.deleted_at IS NULL
        AND f.expires_at > (extract(epoch FROM now()) * 1000)::bigint,
      'eligible_kind', f.kind IN ('need', 'offer'),
      'eligible_category', f.category IN ('personal','professional','commercial','home','transport','food','education','health','events','other'),
      'eligible_time', f.time_slot IN ('now','today','tomorrow','this_week'),
      'eligible_area', nullif(btrim(f.area_label), '') IS NOT NULL,
      'eligible_scope', f.scope IN ('current_area','expanded_area','half_city','whole_city'),
      'eligible_personal', f.category = 'personal',
      'eligible_author_distance', loc.location IS NOT NULL AND extensions.ST_Distance(
        loc.location, extensions.ST_SetSRID(extensions.ST_MakePoint(0, 0), 4326)::extensions.geography
      ) <= CASE f.scope WHEN 'current_area' THEN 500.0 WHEN 'expanded_area' THEN 2000.0 WHEN 'half_city' THEN 5000.0 WHEN 'whole_city' THEN 15000.0 END
    ) ORDER BY f.id)
    FROM public.flashes f
    LEFT JOIN public.flash_private_locations loc ON loc.flash_id=f.id AND loc.author_id=f.author_id
    WHERE f.id BETWEEN 'f5500000-0000-4000-8000-000000000001'::uuid AND 'f5500000-0000-4000-8000-000000000011'::uuid
  ), '[]'::jsonb)::text
);

SELECT diag('SCAN142_FIXTURE_COUNT=' || (
  SELECT count(*)::text FROM public.flashes
  WHERE id BETWEEN 'f5500000-0000-4000-8000-000000000001'::uuid AND 'f5500000-0000-4000-8000-000000000011'::uuid
));

SELECT is(
  (SELECT count(*)::integer FROM public.scan_public_flashes(NULL,'personal',0,0,50,50)),
  4,
  'all four author scopes cap results at 500 m, 2 km, 5 km and 15 km'
);
SELECT is(
  (SELECT count(*)::integer FROM public.scan_public_flashes(NULL,NULL,0,0,0.5,50)),
  2,
  'visitor radius can further reduce results below the author scope'
);

SELECT is(
  (SELECT count(*)::integer FROM public.scan_public_flashes('legacy scope missing',NULL,0,0,50,50)),
  0,
  'legacy Flash rows without an author scope stay excluded even when a private location exists'
);

SELECT * FROM finish();
ROLLBACK;
