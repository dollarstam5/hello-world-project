import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  type CommunicationContextInput,
} from "@/lib/communication/context";
import { createCommunicationRuntime, type CommunicationRuntime } from "@/lib/communication/runtime";

const CommunicationRuntimeContext = createContext<CommunicationRuntime | null>(null);

/** Shares one in-memory communication runtime across the mounted Vitalis app. */
export function CommunicationRuntimeProvider({
  children,
  context,
}: {
  children: ReactNode;
  context?: CommunicationContextInput | null;
}) {
  const [runtime] = useState(createCommunicationRuntime);

  useEffect(() => {
    if (context) runtime.updateContext(context);
  }, [
    runtime,
    context?.identity,
    context?.pathname,
    context?.locale,
    context?.assistantEnabled,
    context?.permissions?.discover,
    context?.permissions?.presence,
  ]);

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
