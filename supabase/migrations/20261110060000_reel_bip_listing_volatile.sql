BEGIN;

-- Migration 20261110050000 adds expiry cleanup to list_reel_bips().
-- CREATE OR REPLACE preserves the existing volatility unless it is changed
-- explicitly. The listing performs DELETE/UPDATE through purge_expired_reel_bips,
-- so PostgreSQL must treat it as VOLATILE.
ALTER FUNCTION public.list_reel_bips() VOLATILE;

COMMIT;
