import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { flashesRepository, useLocalQuery } from "@/platform/offline";

export function useFlashDashboardData() {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    let receivedAuthEvent = false;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      receivedAuthEvent = true;
      if (active) setUserId(session?.user.id ?? null);
    });

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (active && !receivedAuthEvent) {
          setUserId(error ? null : (data.session?.user.id ?? null));
        }
      })
      .catch(() => {
        if (active && !receivedAuthEvent) setUserId(null);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const records = useLocalQuery(async () => {
    if (!userId) return null;
    const all = await flashesRepository.list();
    return all
      .filter((flash) => flash.authorId === userId && !flash.deletedAt)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [userId]);

  return { records, userId };
}
