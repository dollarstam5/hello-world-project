BEGIN;

-- Guest sessions are temporary technical credentials, never Vitalis profiles.
CREATE TABLE public.reel_guest_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash TEXT NOT NULL UNIQUE,
  purpose TEXT NOT NULL DEFAULT 'reel_guest',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  CONSTRAINT reel_guest_session_hash CHECK (token_hash ~ '^[a-f0-9]{64}$'),
  CONSTRAINT reel_guest_session_purpose CHECK (purpose = 'reel_guest'),
  CONSTRAINT reel_guest_session_expiry CHECK (expires_at > created_at)
);

CREATE INDEX reel_guest_sessions_expiry
  ON public.reel_guest_sessions (expires_at);

ALTER TABLE public.reel_guest_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.reel_guest_sessions FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.reel_guest_sessions TO service_role;

COMMENT ON TABLE public.reel_guest_sessions IS
  'Short-lived opaque Réel guest sessions. No Auth user, profile, GPS or durable guest history.';
COMMENT ON COLUMN public.reel_guest_sessions.token_hash IS
  'SHA-256 hex digest of a random bearer secret; never store the raw cookie value.';

COMMIT;
