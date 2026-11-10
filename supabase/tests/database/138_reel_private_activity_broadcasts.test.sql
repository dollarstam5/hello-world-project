BEGIN;
SELECT plan(4);

SELECT has_function(
  'public',
  'broadcast_reel_member_activity',
  ARRAY['uuid', 'text'],
  'The member activity broadcaster exists'
);

SELECT has_policy(
  'realtime',
  'messages',
  'reel_member_activity_read',
  'Only the matching authenticated member can read their private activity topic'
);

SELECT ok(
  position(
    'guest_session_id'
    IN pg_get_functiondef('public.broadcast_reel_member_activity(uuid,text)'::regprocedure)
  ) = 0,
  'The broadcast helper does not read or publish guest session identifiers'
);

SELECT ok(
  position(
    'jsonb_build_object('
    IN pg_get_functiondef('public.broadcast_reel_member_activity(uuid,text)'::regprocedure)
  ) > 0
  AND position(
    '''kind'''
    IN pg_get_functiondef('public.broadcast_reel_member_activity(uuid,text)'::regprocedure)
  ) > 0,
  'The broadcast payload is restricted to a generic event kind'
);

SELECT * FROM finish();
ROLLBACK;
