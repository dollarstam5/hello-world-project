import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { ScanResult } from "@eco/core-contracts";
import { FLASH_CATEGORIES } from "@eco/core-contracts";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const nearbyFeedSchema = z.object({
  text: z.string().trim().min(0).max(120),
  category: z.enum(FLASH_CATEGORIES).nullable(),
  latitude: z.number().finite().min(-90).max(90),
  longitude: z.number().finite().min(-180).max(180),
  radiusKm: z.number().finite().min(1).max(50),
  limit: z.number().int().min(1).max(50),
}).strict();

/** Flash-owned endpoint for its own feed; no Scan API dependency. */
export const nearbyFlashFeed = createServerFn({ method: "POST" })
  .validator(nearbyFeedSchema)
  .handler(async ({ data }): Promise<ScanResult[]> =>
    (await import("./flash.server")).fetchNearbyFlashFeed(data),
  );

export const commandFlash = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["live", "archived"]),
      })
      .strict(),
  )
  .handler(async ({ data, context }) =>
    (await import("./flash.server")).transitionFlash(context.supabase, data.id, data.status),
  );
