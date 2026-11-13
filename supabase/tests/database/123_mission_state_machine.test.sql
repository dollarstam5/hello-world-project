BEGIN;
SELECT plan(23);

SELECT ok(
  EXISTS (SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.missions'::regclass
      AND conname = 'missions_status_check' AND contype = 'c'),
  'Mission status is restricted to the canonical state set'
);
SELECT ok(
  EXISTS (SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.missions'::regclass
      AND conname = 'missions_reward_amount_check' AND contype = 'c'),
  'Mission reward cannot be negative'
);
SELECT ok(
  EXISTS (SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.missions'::regclass
      AND conname = 'missions_reward_currency_check' AND contype = 'c'),
  'Mission reward currency follows the XAF V1 contract'
);
SELECT ok(
  EXISTS (SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.missions'::regclass
      AND conname = 'missions_title_length_check' AND contype = 'c'),
  'Mission title length is constrained'
);
SELECT ok(
  EXISTS (SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.missions'::regclass
      AND conname = 'missions_brief_length_check' AND contype = 'c'),
  'Mission brief length is constrained'
);

SELECT has_function('public', 'protect_mission_transition', ARRAY[]::text[],
  'The authoritative mission state machine function exists');
SELECT has_function('public', 'audit_mission_transition', ARRAY[]::text[],
  'The mission transition audit function exists');
SELECT has_trigger('public', 'missions', 'a_protect_mission_transition',
  'The state machine trigger is installed');
SELECT has_trigger('public', 'missions', 'z_audit_mission_transition',
  'The audit trigger is installed');

SELECT policies_are('public', 'missions', ARRAY[
  'mission author creates',
  'mission participants update',
  'missions readable by members'
], 'Mission RLS policies match the intended author/participant model');

SELECT has_index('public', 'missions', 'idx_missions_author_status',
  'Author/status lookup index exists');
SELECT has_index('public', 'missions', 'idx_missions_assignee_status',
  'Assignee/status lookup index exists');

SELECT ok(
  NOT has_table_privilege('authenticated', 'public.missions', 'UPDATE')
  AND NOT has_table_privilege('authenticated', 'public.missions', 'DELETE'),
  'authenticated clients have no table-wide UPDATE or physical DELETE grant'
);
SELECT ok(
  has_column_privilege('authenticated', 'public.missions', 'title', 'UPDATE')
  AND has_column_privilege('authenticated', 'public.missions', 'status', 'UPDATE')
  AND has_column_privilege('authenticated', 'public.missions', 'assignee_id', 'UPDATE'),
  'authenticated clients receive required mission update columns'
);
SELECT ok(
  NOT has_column_privilege('authenticated', 'public.missions', 'author_id', 'UPDATE')
  AND NOT has_column_privilege('authenticated', 'public.missions', 'created_at', 'UPDATE'),
  'mission ownership and creation timestamp cannot be changed by clients'
);
SELECT ok(
  NOT has_function_privilege('authenticated', 'public.protect_mission_transition()', 'EXECUTE')
  AND NOT has_function_privilege('anon', 'public.protect_mission_transition()', 'EXECUTE'),
  'clients cannot invoke the state machine trigger function directly'
);
SELECT ok(
  NOT has_function_privilege('authenticated', 'public.audit_mission_transition()', 'EXECUTE')
  AND NOT has_function_privilege('anon', 'public.audit_mission_transition()', 'EXECUTE'),
  'clients cannot invoke the audit trigger function directly'
);
SELECT ok(
  (SELECT prosecdef = false FROM pg_proc
   WHERE oid = 'public.protect_mission_transition()'::regprocedure),
  'state machine trigger runs as invoker'
);
SELECT ok(
  (SELECT prosecdef = true FROM pg_proc
   WHERE oid = 'public.audit_mission_transition()'::regprocedure),
  'audit trigger uses controlled definer privileges'
);
SELECT ok(
  position('invalid_mission_transition' IN
    pg_get_functiondef('public.protect_mission_transition()'::regprocedure)) > 0,
  'unknown state transitions are rejected'
);
SELECT ok(
  position('mission_actor_not_authenticated' IN
    pg_get_functiondef('public.protect_mission_transition()'::regprocedure)) > 0,
  'non-authenticated callers are not implicitly trusted'
);
SELECT ok(
  (SELECT with_check = 'true'
   FROM pg_policies
   WHERE schemaname = 'public'
     AND tablename = 'missions'
     AND policyname = 'mission participants update'),
  'RLS permits an assignee to clear assignee_id when declining; the trigger validates OLD/NEW'
);
SELECT ok(
  (SELECT count(*) = 5 AND bool_and(convalidated)
   FROM pg_constraint
   WHERE conrelid = 'public.missions'::regclass
     AND conname IN (
       'missions_status_check', 'missions_reward_amount_check',
       'missions_reward_currency_check', 'missions_title_length_check',
       'missions_brief_length_check'
     )),
  'all five mission constraints are validated after non-destructive preflight'
);

SELECT * FROM finish();
ROLLBACK;
