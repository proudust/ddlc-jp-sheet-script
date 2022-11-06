import { z } from "https://deno.land/x/zod@v3.19.1/mod.ts";

export const commonEventsJson = z.array(
  z.nullable(z.object({
    list: z.array(z.object({
      code: z.number(),
      parameters: z.array(z.unknown()),
    })),
  })),
);

export type CommonEventsJson = z.infer<typeof commonEventsJson>;
