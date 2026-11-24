import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

/** Reactive session state for the current visitor. SSR-safe (starts empty). */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let receivedAuthEvent = false;
    let unsubscribe: (() => void) | undefined;

    void import("@/integrations/supabase/client")
      .then(({ supabase }) => {
        if (!active) return;

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, next) => {
          receivedAuthEvent = true;
          if (active) {
            setSession(next);
            setLoading(false);
          }
        });
        unsubscribe = () => subscription.unsubscribe();

        void supabase.auth
          .getSession()
          .then(({ data: current, error }) => {
            // A newer auth event always wins over the initial session snapshot.
            if (active && !receivedAuthEvent) {
              setSession(error ? null : current.session);
              setLoading(false);
            }
          })
          .catch(() => {
            if (active && !receivedAuthEvent) {
              setSession(null);
              setLoading(false);
            }
          });
      })
      .catch(() => {
        if (active && !receivedAuthEvent) {
          setSession(null);
          setLoading(false);
        }
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const user: User | null = session?.user ?? null;
  return { session, user, loading };
}

export async function signOut() {
  const { supabase } = await import("@/integrations/supabase/client");
  await supabase.auth.signOut();
}
