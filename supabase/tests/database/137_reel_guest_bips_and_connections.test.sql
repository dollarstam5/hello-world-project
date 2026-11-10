BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(17);

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
) VALUES (
  'e5000000-0000-4000-8000-000000000001',
  'authenticated', 'authenticated', 'reel-cross-mode-member@example.invalid',
  '', now(), '{}', '{"display_name":"Mina"}'
);

INSERT INTO public.reel_guest_sessions (id, token_hash, purpose, expires_at)
VALUES (
  'e5000000-0000-4000-8000-000000000011',
  repeat('d', 64), 'reel_guest', now() + interval '30 minutes'
), (
  'e5000000-0000-4000-8000-000000000012',
  repeat('e', 64), 'reel_guest', now() + interval '30 minutes'
);

SET LOCAL ROLE service_role;
SELECT set_config('request.jwt.claims', '{"role":"service_role"}', true);

SELECT lives_ok(
  $reel_test$SELECT public.create_reel_guest_presence(
    'e5000000-0000-4000-8000-000000000011',
    'Awa', 'avatar-blue', 'Bonamoussadi', 'Disponible pour échanger',
    100, 9.7000, 4.0500, 30, true
  )$reel_test$$,
  'the guest publishes a temporary presence without a member profile'
);

SELECT lives_ok(
  $reel_test$SELECT public.create_reel_guest_presence(
    'e5000000-0000-4000-8000-000000000012',
    'Mina', 'avatar-green', 'Bonamoussadi', 'Disponible pour discuter',
    100, 9.7001, 4.0501, 30, true
  )$reel_test$,
  'a second independent guest session can publish its own temporary presence'
);

INSERT INTO public.reel_presences (
  id, owner_id, zone_key, area_label, description, radius_m,
  started_at, expires_at, consented_at, status
) VALUES (
  'e5000000-0000-4000-8000-000000000021',
  'e5000000-0000-4000-8000-000000000001',
  'z1_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  'Bonamoussadi', 'Disponible', 100,
  (extract(epoch FROM now()) * 1000)::bigint,
  ((extract(epoch FROM now()) * 1000)::bigint + 1800000),
  (extract(epoch FROM now()) * 1000)::bigint, 'active'
);
INSERT INTO public.reel_presence_locations (presence_id, location, expires_at)
VALUES (
  'e5000000-0000-4000-8000-000000000021',
  extensions.ST_SetSRID(extensions.ST_MakePoint(4.0500, 9.7000), 4326)::extensions.geography,
  now() + interval '30 minutes'
);

SELECT is(
  (SELECT count(*)::integer FROM public.profiles
   WHERE id = 'e5000000-0000-4000-8000-000000000011'),
  0,
  'the guest session never creates a member profile'
);

SET LOCAL ROLE authenticated;
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"e5000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

SELECT lives_ok(
  $reel_test$SELECT public.send_reel_bip_to_guest(
    (SELECT id FROM public.reel_guest_presences
     WHERE guest_session_id = 'e5000000-0000-4000-8000-000000000011' AND status = 'active'),
    'e5000000-0000-4000-8000-000000000031'
  )$reel_test$,
  'a member can send a bip to a nearby guest'
);

SET LOCAL ROLE service_role;
SELECT set_config('request.jwt.claims', '{"role":"service_role"}', true);

SELECT is(
  (SELECT count(*)::integer FROM public.list_reel_guest_bips_for_session(
    'e5000000-0000-4000-8000-000000000011'
  ) WHERE is_recipient),
  1,
  'the guest receives the member bip through its own verified session'
);

SELECT lives_ok(
  $reel_test$SELECT public.command_reel_guest_bip_guest(
    'e5000000-0000-4000-8000-000000000011',
    (SELECT id FROM public.reel_guest_bips WHERE client_request_id = 'e5000000-0000-4000-8000-000000000031'),
    'accept'
  )$reel_test$,
  'the guest can accept a bip addressed to its session'
);

SELECT is(
  (SELECT count(*)::integer FROM public.reel_guest_connections
   WHERE participant_one_guest_session_id = 'e5000000-0000-4000-8000-000000000011'
      OR participant_two_guest_session_id = 'e5000000-0000-4000-8000-000000000011'),
  1,
  'accepting the bip creates one temporary cross-mode relation'
);

SET LOCAL ROLE authenticated;
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"e5000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

SELECT is(
  (SELECT count(*)::integer FROM public.list_reel_guest_connections_for_member()),
  1,
  'the member can see the accepted temporary relation'
);

SELECT lives_ok(
  $reel_test$SELECT public.send_reel_guest_bip(
    'e5000000-0000-4000-8000-000000000011',
    'member',
    'e5000000-0000-4000-8000-000000000021',
    'e5000000-0000-4000-8000-000000000032'
  )$reel_test$,
  'a guest can send a bip to a nearby member'
);

SET LOCAL ROLE service_role;
SELECT set_config('request.jwt.claims', '{"role":"service_role"}', true);

SELECT is(
  (SELECT count(*)::integer FROM public.list_reel_guest_bips_for_session(
    'e5000000-0000-4000-8000-000000000011'
  ) WHERE NOT is_recipient),
  1,
  'the guest can see the bip it sent to the member'
);

SELECT lives_ok(
  $reel_test$SELECT public.send_reel_guest_bip(
    'e5000000-0000-4000-8000-000000000012',
    'guest',
    (SELECT id FROM public.reel_guest_presences
     WHERE guest_session_id = 'e5000000-0000-4000-8000-000000000011' AND status = 'active'),
    'e5000000-0000-4000-8000-000000000033'
  )$reel_test$,
  'one guest can send a bip to a different nearby guest session'
);

UPDATE public.reel_presence_locations
SET location = extensions.ST_SetSRID(extensions.ST_MakePoint(4.0600, 9.7100), 4326)::extensions.geography
WHERE presence_id = 'e5000000-0000-4000-8000-000000000021';
SELECT throws_ok(
  $reel_test$SELECT public.send_reel_guest_bip(
    'e5000000-0000-4000-8000-000000000012',
    'member',
    'e5000000-0000-4000-8000-000000000021',
    'e5000000-0000-4000-8000-000000000034'
  )$reel_test$,
  '42501',
  'recipient_outside_visibility_radius',
  'a guest bip is rejected when the recipient radius does not include the sender'
);

SET LOCAL ROLE authenticated;
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"e5000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);
SELECT lives_ok(
  $reel_test$SELECT public.command_reel_guest_bip_member(
    (SELECT id FROM public.reel_guest_bips WHERE client_request_id = 'e5000000-0000-4000-8000-000000000032'),
    'accept'
  )$reel_test$,
  'the member can accept a bip sent by a guest'
);
SELECT is(
  (SELECT count(*)::integer FROM public.reel_guest_connections
   WHERE (participant_one_member_id = 'e5000000-0000-4000-8000-000000000001'
      AND participant_two_guest_session_id = 'e5000000-0000-4000-8000-000000000011')
      OR (participant_two_member_id = 'e5000000-0000-4000-8000-000000000001'
      AND participant_one_guest_session_id = 'e5000000-0000-4000-8000-000000000011')),
  1,
  'accepting the reverse bip reuses the existing pair relation instead of duplicating it'
);

SET LOCAL ROLE service_role;
SELECT set_config('request.jwt.claims', '{"role":"service_role"}', true);

SELECT ok(
  NOT has_table_privilege('authenticated', 'public.reel_guest_bips', 'SELECT')
  AND NOT has_table_privilege('anon', 'public.reel_guest_bips', 'SELECT')
  AND NOT has_table_privilege('authenticated', 'public.reel_guest_connections', 'SELECT')
  AND NOT has_table_privilege('anon', 'public.reel_guest_connections', 'SELECT'),
  'browser SQL roles cannot read cross-mode bip rows or internal guest session identifiers'
);

UPDATE public.reel_guest_sessions
SET revoked_at = now()
WHERE id = 'e5000000-0000-4000-8000-000000000011';
SELECT public.purge_reel_guest_interactions();

SELECT is(
  (SELECT count(*)::integer FROM public.reel_guest_bips
   WHERE sender_guest_session_id = 'e5000000-0000-4000-8000-000000000011'
      OR recipient_guest_session_id = 'e5000000-0000-4000-8000-000000000011'),
  0,
  'revoking the guest session removes its temporary bips'
);

SELECT is(
  (SELECT count(*)::integer FROM public.reel_guest_connection_history
   WHERE member_id = 'e5000000-0000-4000-8000-000000000001'
     AND status = 'closed'),
  1,
  'the member keeps a minimal six-month relation record after the guest session ends'
);

SELECT * FROM finish();
ROLLBACK;
