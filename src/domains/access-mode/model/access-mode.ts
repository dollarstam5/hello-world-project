import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/domains/auth";

export type AccessMode = "visitor" | "guest" | "member";

export interface TemporaryGuestIdentity {
  /** Random, memory-only identifier. Never a Vitalis account or profile ID. */
  sessionId: string;
  startedAt: number;
}

export interface AccessModeState {
  mode: AccessMode;
  loading: boolean;
  memberId: string | null;
  guest: TemporaryGuestIdentity | null;
  isAuthenticated: boolean;
  startGuestSession: () => TemporaryGuestIdentity;
  endGuestSession: () => void;
}

const AccessModeContext = createContext<AccessModeState | null>(null);

function createTemporaryIdentity(): TemporaryGuestIdentity {
  if (typeof crypto === "undefined" || typeof crypto.randomUUID !== "function") {
    throw new Error("Cette session ne peut pas démarrer sur cet appareil.");
  }

  return { sessionId: crypto.randomUUID(), startedAt: Date.now() };
}

/**
 * Central access-mode manager.
 *
 * Guest identity exists only in React memory: it is not written to localStorage,
 * sessionStorage, Supabase Auth, or the durable profiles table.
 */
export function AccessModeProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [guest, setGuest] = useState<TemporaryGuestIdentity | null>(null);

  useEffect(() => {
    // A real account always takes precedence over a temporary guest session.
    if (user) setGuest(null);
  }, [user?.id]);

  useEffect(() => {
    const clearTemporaryIdentity = () => setGuest(null);
    window.addEventListener("pagehide", clearTemporaryIdentity);
    return () => window.removeEventListener("pagehide", clearTemporaryIdentity);
  }, []);

  const startGuestSession = useCallback(() => {
    if (user) {
      throw new Error("Vous êtes déjà connecté à votre compte Vitalis.");
    }
    const identity = createTemporaryIdentity();
    setGuest(identity);
    return identity;
  }, [user]);

  const endGuestSession = useCallback(() => setGuest(null), []);

  const value = useMemo<AccessModeState>(() => ({
    mode: user ? "member" : guest ? "guest" : "visitor",
    loading,
    memberId: user?.id ?? null,
    guest,
    isAuthenticated: Boolean(user),
    startGuestSession,
    endGuestSession,
  }), [user, loading, guest, startGuestSession, endGuestSession]);

  return <AccessModeContext.Provider value={value}>{children}</AccessModeContext.Provider>;
}

export function useAccessMode(): AccessModeState {
  const value = useContext(AccessModeContext);
  if (!value) {
    throw new Error("useAccessMode doit être utilisé dans AccessModeProvider.");
  }
  return value;
}
