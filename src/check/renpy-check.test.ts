import { assertEquals } from "../../deps.ts";
import {
  CantIncludeHalfWidthChecker,
  CantIncludeSpaceInWaitTagsChecker,
  IdFormatChecker,
  UnificationEllipsisChecker,
  UseUnknownAttributesChecker,
} from "./renpy-check.ts";

Deno.test({
  name: "IdFormatChecker",
  fn() {
    const check = (id: string) => new IdFormatChecker().check({ id });
    assertEquals(check("bye_leaving_already_035e8b8a"), false);
    assertEquals(check("bye_leaving_already_035e8b8a_1"), false);
    assertEquals(check("bye_prompt_sleep_cdf617a"), true);
    assertEquals(check("bye_prompt_sleep_cdf617a10"), true);
  },
});

Deno.test({
  name: "UseUnknownAttributesChecker",
  fn() {
    const check = (attr: string) =>
      new UseUnknownAttributesChecker().check({ attr });

    assertEquals(check("m 1tkc"), false);
    assertEquals(check("strings"), false);
    assertEquals(check("string"), true);
  },
});

Deno.test({
  name: "UnificationEllipsisChecker",
  fn() {
    const check = (translate: string) =>
      new UnificationEllipsisChecker().check({ translate });

    assertEquals(check("ねぇ、[player]……"), false);
    assertEquals(check("ねぇ、[player]…"), true);
    assertEquals(check("ねぇ、[player]..."), true);
    assertEquals(check("ねぇ、[player]......"), true);
    assertEquals(check("…待ってね"), true);
    assertEquals(check("私って本当にドジだね、[player]君……{w=0.3}ごめんなさい"), false);
    assertEquals(check("[spr_obj.dlg_desc!t]、[acs_quip]"), false);
  },
});

Deno.test({
  name: "CantIncludeSpaceInWaitTagsChecker",
  fn() {
    const check = (translate: string) =>
      new CantIncludeSpaceInWaitTagsChecker().check({ translate });

    assertEquals(check("{w=0.2}"), false);
    assertEquals(check("{w=0. 2}"), true);
    assertEquals(check("{w = 0.3}"), true);
  },
});

Deno.test({
  name: "CantIncludeHalfWidthChecker",
  fn() {
    const check = (translate: string) =>
      new CantIncludeHalfWidthChecker().check({ translate });

    assertEquals(check("引き分け?"), true);
    assertEquals(check("引き分け？"), false);
    assertEquals(check("私の勝ち!"), true);
    assertEquals(check("私の勝ち！"), false);
    assertEquals(check("[v_quip!t]"), false);
    assertEquals(check("あはは~"), true);
    assertEquals(check("あはは～"), false);
  },
});
