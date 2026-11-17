import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Session } from "@supabase/supabase-js";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  unsubscribe: vi.fn(),
  authCallback: undefined as ((event: string, session: Session | null) => void) | undefined,
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: mocks.getSession,
      onAuthStateChange: mocks.onAuthStateChange,
      signInWithPassword: mocks.signInWithPassword,
      signUp: mocks.signUp,
      signOut: mocks.signOut,
    },
  },
}));

import { useAuth, signOut } from "@/domains/auth/model/useAuth";
import { authService } from "@/domains/auth/services/auth.service";

function createSession(id: string): Session {
  return {
    access_token: `access-${id}`,
    refresh_token: `refresh-${id}`,
    token_type: "bearer",
    expires_in: 3600,
    expires_at: 1_900_000_000,
    user: {
      id,
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: "2026-01-01T00:00:00.000Z",
    },
  } as Session;
}

describe("deferred Supabase authentication", () => {
  beforeEach(() => {
    mocks.getSession.mockReset();
    mocks.onAuthStateChange.mockReset();
    mocks.signInWithPassword.mockReset();
    mocks.signUp.mockReset();
    mocks.signOut.mockReset();
    mocks.unsubscribe.mockReset();
    mocks.authCallback = undefined;
    mocks.onAuthStateChange.mockImplementation((callback) => {
      mocks.authCallback = callback;
      return { data: { subscription: { unsubscribe: mocks.unsubscribe } } };
    });
  });

  it("restores the persisted session and applies subsequent auth events", async () => {
    const restoredSession = createSession("restored-user");
    const signedInSession = createSession("signed-in-user");
    mocks.getSession.mockResolvedValue({ data: { session: restoredSession }, error: null });

    let latest: ReturnType<typeof useAuth> | undefined;
    function Harness() {
      latest = useAuth();
      return null;
    }

    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    try {
      await act(async () => {
        root.render(createElement(Harness));
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(mocks.getSession).toHaveBeenCalledTimes(1);
      expect(mocks.onAuthStateChange).toHaveBeenCalledTimes(1);
      expect(latest?.loading).toBe(false);
      expect(latest?.session?.user.id).toBe("restored-user");

      await act(async () => {
        mocks.authCallback?.("SIGNED_IN", signedInSession);
      });

      expect(latest?.loading).toBe(false);
      expect(latest?.session?.user.id).toBe("signed-in-user");
      expect(latest?.user?.id).toBe("signed-in-user");
    } finally {
      await act(async () => root.unmount());
      container.remove();
    }

    expect(mocks.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("keeps a newer sign-in event when the initial session request resolves later", async () => {
    let resolveSession!: (value: { data: { session: Session | null }; error: null }) => void;
    mocks.getSession.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSession = resolve;
        }),
    );

    let latest: ReturnType<typeof useAuth> | undefined;
    function Harness() {
      latest = useAuth();
      return null;
    }

    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    try {
      await act(async () => {
        root.render(createElement(Harness));
        await Promise.resolve();
      });

      const eventSession = createSession("event-user");
      await act(async () => {
        mocks.authCallback?.("SIGNED_IN", eventSession);
      });

      await act(async () => {
        resolveSession({ data: { session: createSession("stale-user") }, error: null });
        await Promise.resolve();
      });

      expect(latest?.session?.user.id).toBe("event-user");
      expect(latest?.loading).toBe(false);
    } finally {
      await act(async () => root.unmount());
      container.remove();
    }
  });

  it("routes password sign-in through the Supabase auth client", async () => {
    const result = {
      data: { user: { id: "member-1" }, session: createSession("member-1") },
      error: null,
    };
    mocks.signInWithPassword.mockResolvedValue(result);

    await expect(
      authService.signIn("member@example.test", "correct-horse-battery"),
    ).resolves.toEqual(result);

    expect(mocks.signInWithPassword).toHaveBeenCalledWith({
      email: "member@example.test",
      password: "correct-horse-battery",
    });
  });

  it("registers with the display name stored in auth metadata", async () => {
    const result = {
      data: { user: { id: "new-member" }, session: null },
      error: null,
    };
    mocks.signUp.mockResolvedValue(result);

    await expect(
      authService.signUp("new@example.test", "correct-horse-battery", "Awa"),
    ).resolves.toEqual(result);

    expect(mocks.signUp).toHaveBeenCalledWith({
      email: "new@example.test",
      password: "correct-horse-battery",
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: "Awa" },
      },
    });
  });

  it("signs out through the deferred Supabase client", async () => {
    mocks.signOut.mockResolvedValue({ error: null });

    await expect(signOut()).resolves.toBeUndefined();

    expect(mocks.signOut).toHaveBeenCalledTimes(1);
  });
});
