BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(7);

SELECT has_function(
  'public',
  'purge_operational_retention',
  ARRAY['integer', 'integer'],
  'operational retention RPC exists'
);

SELECT ok(
  (SELECT prosecdef FROM pg_proc
   WHERE oid = 'public.purge_operational_retention(integer,integer)'::regprocedure),
  'retention RPC runs with controlled definer privileges'
);

SELECT ok(
  (SELECT COALESCE(array_to_string(proconfig, ','), '') LIKE '%search_path=""%'
   FROM pg_proc
   WHERE oid = 'public.purge_operational_retention(integer,integer)'::regprocedure),
  'retention RPC pins an empty search_path'
);

SELECT ok(
  NOT has_function_privilege('anon',
    'public.purge_operational_retention(integer,integer)', 'EXECUTE')
  AND NOT has_function_privilege('authenticated',
    'public.purge_operational_retention(integer,integer)', 'EXECUTE'),
  'client roles cannot execute retention'
);

SELECT ok(
  has_function_privilege('service_role',
    'public.purge_operational_retention(integer,integer)', 'EXECUTE'),
  'only the service role can execute retention'
);

SELECT throws_ok(
  $$SELECT public.purge_operational_retention(6, 30)$$,
  '22023',
  'invalid_retention_window',
  'retention rejects windows below the supported minimum'
);

SELECT throws_ok(
  $$SELECT public.purge_operational_retention(30, 366)$$,
  '22023',
  'invalid_retention_window',
  'retention rejects windows above the supported maximum'
);

SELECT * FROM finish();
ROLLBACK;
