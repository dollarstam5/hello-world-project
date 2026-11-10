import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { ReelZonePurpose } from "./reel-zone.server";

const resolveInput = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  purpose: z.enum(["discover", "presence"]),
  consent: z.literal(true),
});

export const resolveReelZone = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(resolveInput)
  .handler(async ({ data, context }) => {
    const { resolveReelZoneForUser } = await import("./reel-zone.server");
    return resolveReelZoneForUser(
      context.userId,
      data.latitude,
      data.longitude,
      data.purpose as ReelZonePurpose,
    );
  });
