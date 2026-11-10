import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/domains/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  endReelGuestSession,
  getReelGuestSession,
  startReelGuestSession,
} from "@/domains/presence/api/reel-guest-session.functions";

export type AccessMode = "visitor" | "guest" | "member";
export type MemberProfileState =
  | "not_applicable"
  | "loading"
  | "active"
  | "invited"
  | "suspended"
  | "closed"
  | "missing"
  | "error";

export interface TemporaryGuestIdentity {
  /** Local UI timestamp only; no guest session identifier is exposed to the browser. */
  startedAt: number;
  expiresAt?: string;
}

export interface AccessModeState {
  mode: AccessMode;
  loading: boolean;
  memberId: string | null;
  memberProfileState: MemberProfileState;
  guest: TemporaryGuestIdentity | null;
  isAuthenticated: boolean;
  startGuestSession: () => Promise<TemporaryGuestIdentity>;
  endGuestSession: () => void;
}

const AccessModeContext = createContext<AccessModeState | null>(null);

function createTemporaryIdentity(): TemporaryGuestIdentity {
  return { startedAt: Date.now() };
}

function isMemberProfileState(
  value: string,
): value is Exclude<MemberProfileState, "not_applicable" | "loading" | "missing" | "error"> {
  return value === "active" || value === "invited" || value === "suspended" || value === "closed";
}

/**
 * Central access context. The profile state is read-only context; server-side
 * authorization remains mandatory for every protected operation.
 */
export function AccessModeProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [guest, setGuest] = useState<TemporaryGuestIdentity | null>(null);
  const [memberProfileState, setMemberProfileState] =
    useState<MemberProfileState>("not_applicable");

  useEffect(() => {
    if (!user) {
      setMemberProfileState("not_applicable");
      return;
    }

    let cancelled = false;
    setMemberProfileState("loading");

    void supabase
      .from("profiles")
      .select("status, deleted_at")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setMemberProfileState("error");
          return;
        }
        if (!data) {
          setMemberProfileState("missing");
          return;
        }
        if (data.deleted_at !== null) {
          setMemberProfileState("closed");
          return;
        }
        setMemberProfileState(isMemberProfileState(data.status) ? data.status : "error");
      })
      .then(undefined, () => {
        if (!cancelled) setMemberProfileState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    if (user) {
      setGuest(null);
      void endReelGuestSession().catch(() => {
        // The member path remains authoritative; the guest cookie expires server-side.
      });
      return () => {
        cancelled = true;
      };
    }

    void getReelGuestSession()
      .then((session) => {
        if (cancelled || !session.active) return;
        if (Date.parse(session.expiresAt) <= Date.now()) return;
        setGuest({ startedAt: Date.now(), expiresAt: session.expiresAt });
      })
      .catch(() => {
        if (!cancelled) setGuest(null);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading]);

  useEffect(() => {
    const clearTemporaryIdentity = () => setGuest(null);
    window.addEventListener("pagehide", clearTemporaryIdentity);
    return () => window.removeEventListener("pagehide", clearTemporaryIdentity);
  }, []);

  const startGuestSession = useCallback(async () => {
    if (user) throw new Error("Vous êtes déjà connecté à votre compte Vitalis.");
    const identity = createTemporaryIdentity();
    // The interface only enters guest mode after the server confirms its
    // opaque HttpOnly session. No guest session identifier is exposed here.
    const session = await startReelGuestSession();
    if (!session.active) throw new Error("La session invitée n’a pas pu être ouverte.");
    const guestIdentity = { ...identity, expiresAt: session.expiresAt };
    setGuest(guestIdentity);
    return guestIdentity;
  }, [user]);

  const endGuestSession = useCallback(() => {
    setGuest(null);
    void endReelGuestSession().catch(() => {
      // The local identity is cleared immediately; server expiry remains the fallback.
    });
  }, []);

  const value = useMemo<AccessModeState>(
    () => ({
      mode: user ? "member" : guest ? "guest" : "visitor",
      loading: authLoading || (Boolean(user) && memberProfileState === "loading"),
      memberId: user?.id ?? null,
      memberProfileState: user ? memberProfileState : "not_applicable",
      guest,
      isAuthenticated: Boolean(user),
      startGuestSession,
      endGuestSession,
    }),
    [user, authLoading, memberProfileState, guest, startGuestSession, endGuestSession],
  );

  return <AccessModeContext.Provider value={value}>{children}</AccessModeContext.Provider>;
}

export function useAccessMode(): AccessModeState {
  const value = useContext(AccessModeContext);
  if (!value) throw new Error("useAccessMode doit être utilisé dans AccessModeProvider.");
  return value;
}
