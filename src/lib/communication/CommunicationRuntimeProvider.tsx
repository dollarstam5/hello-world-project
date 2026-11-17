import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { CommunicationContextInput } from "@/lib/communication/context";
import { createCommunicationRuntime, type CommunicationRuntime } from "@/lib/communication/runtime";

const CommunicationRuntimeContext = createContext<CommunicationRuntime | null>(null);

/** Shares one in-memory communication runtime across the mounted Vitalis app. */
export function CommunicationRuntimeProvider({
  children,
  context,
  sessionIdentityKey,
}: {
  children: ReactNode;
  context?: CommunicationContextInput | null;
  /** Ephemeral comparison key; never copied into the communication context. */
  sessionIdentityKey?: string;
}) {
  const [runtime] = useState(createCommunicationRuntime);
  const previousIdentityKey = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (
      previousIdentityKey.current !== undefined &&
      previousIdentityKey.current !== sessionIdentityKey
    ) {
      runtime.resetSession();
    }
    previousIdentityKey.current = sessionIdentityKey;
  }, [runtime, sessionIdentityKey]);

  useEffect(() => {
    if (context) runtime.updateContext(context);
  }, [runtime, context]);

  return (
    <CommunicationRuntimeContext.Provider value={runtime}>
      {children}
    </CommunicationRuntimeContext.Provider>
  );
}

/** Access the app-scoped runtime from domain adapters and presentation layers. */
export function useCommunicationRuntime() {
  const runtime = useContext(CommunicationRuntimeContext);
  if (!runtime) {
    throw new Error("useCommunicationRuntime must be used inside CommunicationRuntimeProvider");
  }
  return runtime;
}
