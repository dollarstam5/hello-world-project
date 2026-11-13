BEGIN;
SELECT plan(15);

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
) VALUES
  ('d0000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'sync-a@example.invalid', '', now(), '{}', '{}'),
  ('d0000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'sync-b@example.invalid', '', now(), '{}', '{}');

SELECT has_table('public', 'sync_mutation_receipts', 'sync mutation receipts table exists');
SELECT has_column('public', 'sync_mutation_receipts', 'mutation_id', 'mutation id is stored');
SELECT has_column('public', 'sync_mutation_receipts', 'response', 'replay response is stored');
SELECT ok(
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.sync_mutation_receipts'::regclass),
  'row-level security is enabled'
);
SELECT policies_are(
  'public',
  'sync_mutation_receipts',
  ARRAY['owners read sync receipts', 'owners insert sync receipts']
);

SELECT ok(
  NOT has_table_privilege('anon', 'public.sync_mutation_receipts', 'SELECT'),
  'anonymous users cannot read receipts'
);
SELECT ok(
  has_table_privilege('authenticated', 'public.sync_mutation_receipts', 'SELECT'),
  'authenticated users have table-level read permission'
);
SELECT ok(
  has_table_privilege('authenticated', 'public.sync_mutation_receipts', 'INSERT'),
  'authenticated users have table-level insert permission'
);
SELECT ok(
  NOT has_table_privilege('authenticated', 'public.sync_mutation_receipts', 'UPDATE'),
  'authenticated users cannot update receipts'
);
SELECT ok(
  NOT has_table_privilege('authenticated', 'public.sync_mutation_receipts', 'DELETE'),
  'authenticated users cannot delete receipts'
);

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"d0000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);
SET LOCAL ROLE authenticated;

SELECT lives_ok($
  INSERT INTO public.sync_mutation_receipts (
    mutation_id, owner_id, logical_table, record_id, response
  ) VALUES (
    'd1000000-0000-4000-8000-000000000001',
    auth.uid(),
    'flashes',
    'd2000000-0000-4000-8000-000000000001',
    '{"accepted":true}'::jsonb
  )
$, 'owner can store a mutation receipt');

SELECT lives_ok($
  INSERT INTO public.sync_mutation_receipts (
    mutation_id, owner_id, logical_table, record_id, response
  ) VALUES (
    'd1000000-0000-4000-8000-000000000003',
    auth.uid(),
    'radars',
    'd2000000-0000-4000-8000-000000000003',
    '{"accepted":true}'::jsonb
  )
$, 'owner can store a Radar mutation receipt');

SELECT is(
  (SELECT count(*)::integer
   FROM public.sync_mutation_receipts
   WHERE mutation_id = 'd1000000-0000-4000-8000-000000000001'),
  1,
  'owner can read its own receipt'
);

SELECT throws_ok($$
  INSERT INTO public.sync_mutation_receipts (
    mutation_id, owner_id, logical_table, record_id
  ) VALUES (
    'd1000000-0000-4000-8000-000000000002',
    'd0000000-0000-4000-8000-000000000002',
    'flashes',
    'd2000000-0000-4000-8000-000000000002'
  )
$$, '42501', 'new row violates row-level security policy for table "sync_mutation_receipts"',
'owner cannot create a receipt for another member');

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"d0000000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);
SELECT is(
  (SELECT count(*)::integer
   FROM public.sync_mutation_receipts
   WHERE mutation_id = 'd1000000-0000-4000-8000-000000000001'),
  0,
  'another member cannot read the receipt'
);

SELECT * FROM finish();
ROLLBACK;
