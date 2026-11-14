BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(7);

SELECT has_function(
  'public', 'publish_flash',
  ARRAY['uuid', 'double precision', 'double precision', 'double precision'],
  'The atomic Flash publication RPC exists'
);
SELECT has_function(
  'public', 'transition_flash', ARRAY['uuid', 'text'],
  'The Flash archive RPC exists'
);
SELECT has_trigger(
  'public', 'flashes', 'flashes_guard_status_transition',
  'Authenticated Flash status writes are guarded'
);
SELECT ok(
  NOT has_function_privilege(
    'authenticated',
    'public.publish_flash(uuid,double precision,double precision,double precision)',
    'EXECUTE'
  ),
  'publication remains disabled until scope-aware Scan is deployed'
);

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
) VALUES (
  'f5200000-0000-4000-8000-000000000001',
  'authenticated', 'authenticated', 'flash-lifecycle@example.invalid', '', now(), '{}', '{}'
);

INSERT INTO public.flashes (
  id, author_id, title, body, status, expires_at,
  kind, category, time_slot, area_label, scope, urgency
) VALUES (
  'f5300000-0000-4000-8000-000000000001',
  'f5200000-0000-4000-8000-000000000001',
  'Brouillon de test', 'Contenu de test', 'draft',
  (extract(epoch FROM now()) * 1000)::bigint + 3600000,
  'need', 'personal', 'today', 'Akwa', 'current_area', 'today'
);

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"f5200000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);
SET LOCAL ROLE authenticated;

SELECT throws_ok(
  $$UPDATE public.flashes SET status = 'live'
    WHERE id = 'f5300000-0000-4000-8000-000000000001'$$,
  '42501', 'flash_status_transition_requires_command',
  'ordinary authenticated updates cannot publish a Flash'
);
SELECT throws_ok(
  $$SELECT public.transition_flash(
    'f5300000-0000-4000-8000-000000000001', 'live'
  )$$,
  '22023', 'invalid_status',
  'the archive RPC cannot promote a draft to live'
);
SELECT is(
  (SELECT public.transition_flash(
    'f5300000-0000-4000-8000-000000000001', 'archived'
  )),
  FALSE,
  'a draft cannot be archived through the live-only transition'
);

RESET ROLE;
SELECT * FROM finish();
ROLLBACK;
