import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

const guestPresenceInput = z.object({
  displayName: z.string().trim().min(1).max(40),
  avatarKey: z.string().regex(/^[a-z0-9_-]{1,40}$/),
  areaLabel: z.string().trim().min(2).max(80),
  description: z.string().trim().min(1).max(180),
  radiusM: z.union([z.literal(10), z.literal(25), z.literal(50), z.literal(100), z.literal(1000)]),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  durationMinutes: z.union([
    z.literal(30), z.literal(60), z.literal(120), z.literal(180),
    z.literal(360), z.literal(720), z.literal(1440),
  ]),
  consent: z.literal(true),
});

export const startReelGuestPresence = createServerFn({ method: "POST" })
  .inputValidator(guestPresenceInput)
  .handler(async ({ data }) => {
    const { startReelGuestPresence: start } = await import("./reel-guest-session.server");
    return start(data);
  });

export const endReelGuestPresence = createServerFn({ method: "POST" })
  .inputValidator(z.object({ presenceId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { endReelGuestPresence: end } = await import("./reel-guest-session.server");
    return end(data.presenceId);
  });
