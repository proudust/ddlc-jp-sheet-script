import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { guard } from "../zod.ts";

export const textCommand = z.object({
  code: z.literal(401),
  parameters: z.tuple([
    z.string(),
  ]),
});

export const isTextCommand = guard(textCommand);

export type TextCommand = z.infer<typeof textCommand>;
