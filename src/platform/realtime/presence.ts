/**
 * Application-wide realtime presence adapter.
 * Business-specific presence and visibility policies remain in their domains.
 */
import { useEffect, useState } from "react";
import { realtime } from "./realtime";

export interface Presence {
  onlineCount: number;
  ts: number;
}

const PRESENCE_CHANNEL = "presence:global";

export function emitPresence(onlineCount: number) {
  realtime.emit({
    channel: PRESENCE_CHANNEL,
    type: "update",
    payload: { onlineCount, ts: Date.now() } satisfies Presence,
    ts: Date.now(),
  });
}

export function usePresence(): Presence | null {
  const [presence, setPresence] = useState<Presence | null>(null);
  useEffect(() => {
    return realtime.subscribe(PRESENCE_CHANNEL, (event) => {
      setPresence(event.payload as Presence);
    });
  }, []);
  return presence;
}
