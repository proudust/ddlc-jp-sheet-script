import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { guard } from "../zod.ts";

export const mapJson = z.object({
  displayName: z.string(),
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

export const isMapJson = guard(mapJson);

export type MapJson = z.infer<typeof mapJson>;
