BEGIN;

SELECT plan(14);

SELECT has_column('public', 'flashes', 'kind', 'Flash kind column exists');
SELECT has_column('public', 'flashes', 'category', 'Flash category column exists');
SELECT has_column('public', 'flashes', 'time_slot', 'Flash time slot column exists');
SELECT has_column('public', 'flashes', 'area_label', 'Flash coarse area label column exists');
SELECT has_column('public', 'flashes', 'response_limit', 'Flash response limit column exists');

SELECT has_table('public', 'flash_private_locations', 'Private Flash location table exists');
SELECT has_column('public', 'flash_private_locations', 'latitude', 'Private latitude exists');
SELECT has_column('public', 'flash_private_locations', 'longitude', 'Private longitude exists');
SELECT has_column('public', 'flash_private_locations', 'accuracy_meters', 'Private location accuracy exists');

SELECT ok(
  (
    SELECT c.relrowsecurity
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'flash_private_locations'
  ),
  'RLS is enabled on private Flash locations'
);

SELECT policies_are(
  'public',
  'flash_private_locations',
  ARRAY['flash private locations readable by owner']
);

SELECT ok(
  has_table_privilege('authenticated', 'public.flash_private_locations', 'SELECT')
  AND NOT has_table_privilege('authenticated', 'public.flash_private_locations', 'INSERT')
  AND NOT has_table_privilege('authenticated', 'public.flash_private_locations', 'UPDATE')
  AND NOT has_table_privilege('authenticated', 'public.flash_private_locations', 'DELETE'),
  'authenticated users can only select private locations, subject to owner RLS'
);

SELECT ok(
  NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'flashes'
      AND column_name IN ('latitude', 'longitude', 'accuracy_meters')
  ),
  'precise coordinates are not part of the synchronised flashes row'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'flashes_response_limit_range_check'
      AND conrelid = 'public.flashes'::regclass
  ),
  'response limit is constrained to the supported range'
);

SELECT * FROM finish();
ROLLBACK;
