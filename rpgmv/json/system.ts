import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { guard } from "../zod.ts";

export const systemJson = z.object({
  gameTitle: z.string(),
  terms: z.object({
    commands: z.array(z.nullable(z.string())),
    messages: z.record(z.string()),
  }),
});

export const isSystemJson = guard(systemJson);

export type SystemJson = z.infer<typeof systemJson>;
