BEGIN;
SELECT plan(7);

SELECT has_trigger(
  'public',
  'reel_bips',
  'reel_member_bip_activity_broadcast',
  'Member-to-member bip inserts and resolutions emit server events'
);

SELECT has_trigger(
  'public',
  'reel_connections',
  'reel_member_connection_activity_broadcast',
  'Member relationship closures emit server events'
);

SELECT has_trigger(
  'public',
  'reel_guest_bips',
  'reel_guest_bip_activity_broadcast',
  'Cross-mode bip activity reuses the same member event channel'
);

SELECT has_trigger(
  'public',
  'reel_guest_connections',
  'reel_guest_connection_activity_broadcast',
  'Cross-mode relationship closures reuse the same member event channel'
);

SELECT ok(
  position('bip_received' IN pg_get_functiondef('public.notify_reel_member_bip_activity()'::regprocedure)) > 0
  AND position('bip_accepted' IN pg_get_functiondef('public.notify_reel_member_bip_activity()'::regprocedure)) > 0
  AND position('bip_declined' IN pg_get_functiondef('public.notify_reel_member_bip_activity()'::regprocedure)) > 0
  AND position('guest_session_id' IN pg_get_functiondef('public.notify_reel_member_bip_activity()'::regprocedure)) = 0,
  'Member bip events are derived from real state transitions without guest metadata'
);

SELECT ok(
  position('connection_closed' IN pg_get_functiondef('public.notify_reel_member_connection_activity()'::regprocedure)) > 0
  AND position('guest_session_id' IN pg_get_functiondef('public.notify_reel_member_connection_activity()'::regprocedure)) = 0,
  'Member relationship closure events contain no guest metadata'
);

SELECT ok(
  position('bip_accepted' IN pg_get_functiondef('public.notify_reel_guest_bip_activity()'::regprocedure)) > 0
  AND position('bip_declined' IN pg_get_functiondef('public.notify_reel_guest_bip_activity()'::regprocedure)) > 0
  AND position('guest_session_id' IN pg_get_functiondef('public.notify_reel_guest_bip_activity()'::regprocedure)) = 0,
  'Cross-mode events notify only the participating member and never expose guest session IDs'
);

SELECT * FROM finish();
ROLLBACK;
