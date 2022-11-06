import { z } from "https://deno.land/x/zod@v3.19.1/mod.ts";

export function check<T extends z.ZodType>(
  zodObject: T,
  data: unknown,
): data is z.infer<T> {
  return zodObject.safeParse(data).success;
}

export function guard<T extends z.ZodType>(
  zodObject: T,
): (data: unknown) => data is z.infer<T> {
  return (data: unknown): data is z.infer<T> => check(zodObject, data);
}
