import { z } from "https://deno.land/x/zod@v3.19.1/mod.ts";
import { guard } from "../zod.ts";

export const faceCommand = z.object({
  code: z.literal(101),
  parameters: z.tuple([
    z.string(),
    z.number(),
    z.number(),
    z.number(),
  ]),
});

export const isFaceCommand = guard(faceCommand);

export type FaceCommand = z.infer<typeof faceCommand>;
