import { z } from "https://deno.land/x/zod@v3.19.1/mod.ts";

export const textCommand = z.object({
  code: z.literal(401),
  parameters: z.tuple([
    z.string(),
  ]),
});

export type TextCommand = z.infer<typeof textCommand>;
