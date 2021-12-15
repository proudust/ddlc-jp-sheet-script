/// <reference path="https://raw.githubusercontent.com/proudust/deno-gas-types/main/types/index.d.ts" />
export {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.117.0/testing/asserts.ts";
export { assertSpyCalls, stub } from "https://deno.land/x/mock@v0.10.0/mod.ts";
export type { Stub } from "https://deno.land/x/mock@v0.10.0/mod.ts";
export {
  trimIndent,
  trimMargin,
} from "https://raw.githubusercontent.com/proudust/kt-string-util-for-js/v0.1.0/mod.ts";
