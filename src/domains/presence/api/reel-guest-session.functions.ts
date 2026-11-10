import { createServerFn } from "@tanstack/react-start";

export const startReelGuestSession = createServerFn({ method: "POST" }).handler(async () => {
  const { createReelGuestSession } = await import("./reel-guest-session.server");
  return createReelGuestSession();
});

export const getReelGuestSession = createServerFn({ method: "GET" }).handler(async () => {
  const { readReelGuestSession } = await import("./reel-guest-session.server");
  return readReelGuestSession();
});

export const endReelGuestSession = createServerFn({ method: "POST" }).handler(async () => {
  const { revokeReelGuestSession } = await import("./reel-guest-session.server");
  return revokeReelGuestSession();
});
