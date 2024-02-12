import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { guard } from "../zod.ts";

export const commonEventsJson = z.array(
  z.nullable(z.object({
    list: z.array(z.object({
      code: z.number(),
      parameters: z.array(z.unknown()),
    })),
  })),
);

export const isCommonEventsJson = guard(commonEventsJson);

export type CommonEventsJson = z.infer<typeof commonEventsJson>;
