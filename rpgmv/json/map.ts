import { z } from "https://deno.land/x/zod@v3.19.1/mod.ts";

export const mapJson = z.object({
  events: z.array(
    z.nullable(z.object({
      name: z.string(),
      pages: z.array(z.object({
        list: z.array(z.object({
          code: z.number(),
          parameters: z.array(z.unknown()),
        })),
      })),
    })),
  ),
});

export type MapJson = z.infer<typeof mapJson>;
