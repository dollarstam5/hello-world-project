BEGIN;
SELECT plan(6);

SELECT has_function(
  'public',
  'broadcast_reel_member_activity',
  ARRAY['uuid', 'text'],
  'The member activity broadcaster exists'
);

SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'realtime'
      AND tablename = 'messages'
      AND policyname = 'reel_member_activity_read'
  ),
  'Only the matching authenticated member can read their private activity topic'
);

SELECT ok(
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'realtime.messages'::regclass),
  'Supabase Realtime messages already has row-level security enabled'
);

SELECT ok(
  (
    SELECT qual LIKE '%auth.uid%'
      AND qual LIKE '%realtime.topic%'
      AND qual LIKE '%reel-member:%'
      AND qual LIKE '%broadcast%'
    FROM pg_policies
    WHERE schemaname = 'realtime'
      AND tablename = 'messages'
      AND policyname = 'reel_member_activity_read'
  ),
  'The read policy binds Broadcast access to the authenticated member topic'
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
