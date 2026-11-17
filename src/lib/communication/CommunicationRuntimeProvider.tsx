import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { CommunicationContextInput } from "@/lib/communication/context";
import { createCommunicationRuntime, type CommunicationRuntime } from "@/lib/communication/runtime";

const CommunicationRuntimeContext = createContext<{
  runtime: CommunicationRuntime;
  revision: number;
} | null>(null);

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
  const [revision, setRevision] = useState(0);
  const previousIdentityKey = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (
      previousIdentityKey.current !== undefined &&
      previousIdentityKey.current !== sessionIdentityKey
    ) {
      runtime.resetSession();
    }
    previousIdentityKey.current = sessionIdentityKey;
    setRevision((value) => value + 1);
  }, [runtime, sessionIdentityKey]);

  useEffect(() => {
    if (context) runtime.updateContext(context);
    setRevision((value) => value + 1);
  }, [runtime, context]);

  const value = useMemo(() => ({ runtime, revision }), [runtime, revision]);

  return (
    <CommunicationRuntimeContext.Provider value={value}>
      {children}
    </CommunicationRuntimeContext.Provider>
  );
}

/** Access the app-scoped runtime from domain adapters and presentation layers. */
export function useCommunicationRuntime() {
  const value = useContext(CommunicationRuntimeContext);
  if (!value) {
    throw new Error("useCommunicationRuntime must be used inside CommunicationRuntimeProvider");
  }
  return value.runtime;
}
