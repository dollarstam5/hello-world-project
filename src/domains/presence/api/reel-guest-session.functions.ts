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
    z.literal(30),
    z.literal(60),
    z.literal(120),
    z.literal(180),
    z.literal(360),
    z.literal(720),
    z.literal(1440),
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
const guestDiscoveryInput = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const discoverReelGuestNearby = createServerFn({ method: "POST" })
  .inputValidator(guestDiscoveryInput)
  .handler(async ({ data }) => {
    const { discoverReelGuestNearby: discover } = await import("./reel-guest-session.server");
    return discover(data.latitude, data.longitude);
  });

export const getMyReelGuestPresence = createServerFn({ method: "GET" }).handler(async () => {
  const { getMyReelGuestPresence: getPresence } = await import("./reel-guest-session.server");
  return getPresence();
});

const guestBipSendInput = z.object({
  recipientActorKind: z.enum(["member", "guest"]),
  recipientPresenceId: z.string().uuid(),
  clientRequestId: z.string().uuid(),
});

export const sendReelGuestBip = createServerFn({ method: "POST" })
  .inputValidator(guestBipSendInput)
  .handler(async ({ data }) => {
    const { sendReelGuestBip: send } = await import("./reel-guest-session.server");
    return send(data.recipientActorKind, data.recipientPresenceId, data.clientRequestId);
  });

const guestBipCommandInput = z.object({
  bipId: z.string().uuid(),
  action: z.enum(["accept", "decline", "withdraw"]),
});

export const listMyReelGuestBips = createServerFn({ method: "GET" }).handler(async () => {
  const { listMyReelGuestBips: list } = await import("./reel-guest-session.server");
  return list();
});

export const commandMyReelGuestBip = createServerFn({ method: "POST" })
  .inputValidator(guestBipCommandInput)
  .handler(async ({ data }) => {
    const { commandMyReelGuestBip: command } = await import("./reel-guest-session.server");
    return command(data.bipId, data.action);
  });

export const listMyReelGuestConnections = createServerFn({ method: "GET" }).handler(async () => {
  const { listMyReelGuestConnections: list } = await import("./reel-guest-session.server");
  return list();
});

export const closeMyReelGuestConnection = createServerFn({ method: "POST" })
  .inputValidator(z.object({ connectionId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { closeMyReelGuestConnection: close } = await import("./reel-guest-session.server");
    return close(data.connectionId);
  });
