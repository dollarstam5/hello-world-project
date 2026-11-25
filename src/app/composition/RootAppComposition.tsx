import type { ReactNode } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { AccessModeProvider } from "@/modules/access-mode";
import { AppShell } from "@/app/shell/AppShell";

/**
 * Root application composition boundary. TanStack root route owns the route outlet;
 * this component owns application-level provider and shell composition.
 */
export function RootAppComposition({
  queryClient,
  children,
}: {
  queryClient: QueryClient;
  children: ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessModeProvider>
        <AppShell>{children}</AppShell>
      </AccessModeProvider>
    </QueryClientProvider>
  );
}
