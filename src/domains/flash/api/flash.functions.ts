import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getPublicFlashFeed = createServerFn({ method: "GET" }).handler(async () =>
  (await import("./flash.server")).publicFlashes(),
);

export const commandFlash = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
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

