import { z } from "https://deno.land/x/zod@v3.19.1/mod.ts";

export const choicesCommand = z.object({
  code: z.literal(102),
  parameters: z.tuple([
    z.array(z.string()),
    z.number(),
    z.number(),
    z.number(),
    z.number(),
  ]),
});

export type ChoicesCommand = z.infer<typeof choicesCommand>;
