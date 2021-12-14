import { assertEquals } from "../../deps.ts";
import { checkLength } from "./rpgmv-check.ts";

type CheckArgs = Parameters<typeof checkLength>[0];
const toArgs = (obj: Partial<CheckArgs>): CheckArgs => ({
  id: "",
  attr: "",
  original: "",
  translate: "",
  sheetName: "",
  sheetRowNumber: 0,
  ...obj,
});

Deno.test("[checkId] Not error", () => {
  const normal = toArgs({
    translate: "ごめんね！\\.\\.さっきまで裏で\nちょいと仕事してたもんだからさ。",
  });
  assertEquals(checkLength(normal), undefined);
});

Deno.test("[checkId] Error", () => {
  const normal = toArgs({
    translate: "ごめんね! \\.\\.さっきまで裏でちょいと\n仕事してたもんだからさ。",
  });
  assertEquals(!!checkLength(normal), true);
});
