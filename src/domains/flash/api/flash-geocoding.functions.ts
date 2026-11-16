import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const reverseGeocodeInput = z
  .object({
    latitude: z.number().finite().min(-90).max(90),
    longitude: z.number().finite().min(-180).max(180),
    consent: z.literal(true),
  })
  .strict();

/**
 * The caller must explicitly consent to sending this one-shot GPS fix to
 * Geoapify. Authentication and provider credentials are handled server-side.
 */
export const reverseGeocodeFlashLocation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(reverseGeocodeInput)
  .handler(async ({ data, context }) => {
    const { lookupFlashArea } = await import("./flash-geocoding.server");
    return lookupFlashArea(data.latitude, data.longitude, context.userId);
  });
