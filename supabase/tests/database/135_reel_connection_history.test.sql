BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(8);

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
) VALUES
  ('d5000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'reel-connection-a@example.invalid', '', now(), '{}', '{"display_name":"Awa"}'),
  ('d5000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'reel-connection-b@example.invalid', '', now(), '{}', '{"display_name":"Moussa"}'),
  ('d5000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'reel-connection-c@example.invalid', '', now(), '{}', '{"display_name":"Nadia"}');

RESET ROLE;
SET LOCAL ROLE service_role;
INSERT INTO public.reel_connections (
  id, participant_low, participant_high, status, created_at
) VALUES (
  'd5000000-0000-4000-8000-000000000101',
  'd5000000-0000-4000-8000-000000000001',
  'd5000000-0000-4000-8000-000000000002',
  'active',
  now()
), (
  'd5000000-0000-4000-8000-000000000102',
  'd5000000-0000-4000-8000-000000000001',
  'd5000000-0000-4000-8000-000000000003',
  'active',
  now() - interval '8 months'
);
UPDATE public.reel_connections
SET status = 'closed',
    closed_at = now() - interval '7 months',
    closed_by = 'd5000000-0000-4000-8000-000000000001'
WHERE id = 'd5000000-0000-4000-8000-000000000102';
SET LOCAL ROLE authenticated;
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"d5000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

SELECT is(
  (SELECT count(*)::integer FROM public.list_reel_connections()),
  1,
  'a participant can list their own relationship'
);
SELECT is(
  (SELECT partner_display_name FROM public.list_reel_connections()
   WHERE connection_id = 'd5000000-0000-4000-8000-000000000101'),
  'Moussa',
  'the participant receives only the other member display name'
);
SELECT lives_ok(
  $$SELECT public.close_reel_connection('d5000000-0000-4000-8000-000000000101')$$,
  'one participant can close the shared relationship'
);
SELECT is(
  (SELECT status FROM public.list_reel_connections()
   WHERE connection_id = 'd5000000-0000-4000-8000-000000000101'),
  'closed',
  'the closed state is visible to both participants'
);

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"d5000000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);
SELECT is(
  (SELECT status FROM public.list_reel_connections()
   WHERE connection_id = 'd5000000-0000-4000-8000-000000000101'),
  'closed',
  'the other participant sees the same closed relationship'
);
SELECT lives_ok(
  $$SELECT public.close_reel_connection('d5000000-0000-4000-8000-000000000101')$$,
  'repeating closure by the other participant is idempotent'
);

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"d5000000-0000-4000-8000-000000000003","role":"authenticated"}',
  true
);
SELECT is(
  (SELECT count(*)::integer FROM public.list_reel_connections()),
  0,
  'a third member cannot list another pair relationship'
);
SELECT throws_ok(
  $$SELECT public.close_reel_connection('d5000000-0000-4000-8000-000000000101')$$,
  '42501',
  'connection_not_found',
  'a third member cannot close another pair relationship'
);

SELECT * FROM finish();
ROLLBACK;
