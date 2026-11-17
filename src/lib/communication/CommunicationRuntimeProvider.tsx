import { createContext, useContext, useState, type ReactNode } from "react";
import { createCommunicationRuntime, type CommunicationRuntime } from "@/lib/communication/runtime";

const CommunicationRuntimeContext = createContext<CommunicationRuntime | null>(null);

/** Shares one in-memory communication runtime across the mounted Vitalis app. */
export function CommunicationRuntimeProvider({ children }: { children: ReactNode }) {
  const [runtime] = useState(createCommunicationRuntime);
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
