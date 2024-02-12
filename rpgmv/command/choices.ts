import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { guard } from "../zod.ts";

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

export const isChoicesCommand = guard(choicesCommand);

export type ChoicesCommand = z.infer<typeof choicesCommand>;
