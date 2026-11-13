BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(18);

SELECT has_table('public', 'ai_requests', 'assistant request ledger exists');
SELECT has_table('public', 'ai_cache', 'assistant answer cache exists');
SELECT has_table('public', 'ai_cache_hits', 'distinct-user cache hit ledger exists');

SELECT ok(
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.ai_requests'::regclass),
  'request ledger has row-level security enabled'
);
SELECT ok(
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.ai_cache'::regclass),
  'answer cache has row-level security enabled'
);
SELECT ok(
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.ai_cache_hits'::regclass),
  'cache hit ledger has row-level security enabled'
);

SELECT ok(
  has_table_privilege('authenticated', 'public.ai_cache', 'SELECT'),
  'authenticated members can query the cache through its restrictive RLS policy'
);
SELECT ok(
  NOT has_table_privilege('authenticated', 'public.ai_requests', 'SELECT')
  AND NOT has_table_privilege('authenticated', 'public.ai_requests', 'INSERT')
  AND NOT has_table_privilege('anon', 'public.ai_requests', 'SELECT'),
  'request ledger is inaccessible directly to client roles'
);
SELECT ok(
  NOT has_table_privilege('authenticated', 'public.ai_cache_hits', 'SELECT')
  AND NOT has_table_privilege('authenticated', 'public.ai_cache_hits', 'INSERT'),
  'cache hit identities are inaccessible directly to client roles'
);
SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'ai_cache'
      AND policyname = 'members read promoted assistant knowledge'
      AND roles @> ARRAY['authenticated']::name[]
      AND qual LIKE '%promoted%'
      AND qual LIKE '%is_local%'
  ),
  'members can read only promoted local cache entries'
);

SELECT has_function('public', 'claim_assistant_request', ARRAY['uuid', 'text']);
SELECT has_function('public', 'complete_assistant_request', ARRAY['uuid', 'text', 'integer', 'integer']);
SELECT has_function('public', 'fail_assistant_request', ARRAY['uuid']);
SELECT has_function('public', 'record_ai_cache_candidate',
  ARRAY['uuid', 'text', 'text', 'text', 'text', 'text', 'integer']);

SELECT ok(
  (SELECT bool_and(p.prosecdef) FROM pg_proc p
   JOIN pg_namespace n ON n.oid = p.pronamespace
   WHERE n.nspname = 'public'
     AND p.proname IN (
       'claim_assistant_request',
       'complete_assistant_request',
       'fail_assistant_request',
       'record_ai_cache_candidate'
     )),
  'assistant RPCs use SECURITY DEFINER for controlled access'
);
SELECT ok(
  (SELECT count(*) = 4 FROM pg_proc p
   JOIN pg_namespace n ON n.oid = p.pronamespace
   WHERE n.nspname = 'public'
     AND p.proname IN (
       'claim_assistant_request',
       'complete_assistant_request',
       'fail_assistant_request',
       'record_ai_cache_candidate'
     )
     AND COALESCE(array_to_string(p.proconfig, ','), '') LIKE '%search_path=pg_catalog, public%'),
  'all assistant RPCs pin a safe search_path'
);
SELECT ok(
  NOT has_function_privilege('anon', 'public.claim_assistant_request(uuid,text)', 'EXECUTE')
  AND NOT has_function_privilege('anon', 'public.complete_assistant_request(uuid,text,integer,integer)', 'EXECUTE')
  AND NOT has_function_privilege('anon', 'public.fail_assistant_request(uuid)', 'EXECUTE')
  AND NOT has_function_privilege('authenticated',
    'public.record_ai_cache_candidate(uuid,text,text,text,text,text,integer)', 'EXECUTE'),
  'RPC execution privileges are limited to their intended roles'
);
SELECT ok(
  has_function_privilege('authenticated', 'public.claim_assistant_request(uuid,text)', 'EXECUTE')
  AND has_function_privilege('authenticated',
    'public.complete_assistant_request(uuid,text,integer,integer)', 'EXECUTE')
  AND has_function_privilege('authenticated', 'public.fail_assistant_request(uuid)', 'EXECUTE')
  AND has_function_privilege('service_role',
    'public.record_ai_cache_candidate(uuid,text,text,text,text,text,integer)', 'EXECUTE'),
  'authenticated and service roles receive only their intended RPC entry points'
);

SELECT * FROM finish();
ROLLBACK;
