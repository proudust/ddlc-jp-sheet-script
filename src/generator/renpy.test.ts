import { trimIndent } from "../../deps.ts";
import { assert, assertEquals } from "../../dev-deps.ts";
import {
  convaerHistorySupport,
  generateCode,
  inflate,
  parseRow,
  removeDuplicateStrings,
} from "./renpy.ts";
import { FileTranslate, SayTranslate, StringsTranslate } from "./renpyTranslates.ts";

Deno.test("[parseRow] enpty or comment row", () => {
  assertEquals(parseRow(["", "", "", ""]), undefined);
  assertEquals(parseRow(["※Yesの場合", "", "", ""]), undefined);
  assertEquals(parseRow(["", "", "※Yesの場合", ""]), undefined);
  assertEquals(
    parseRow([
      "poem_special1.png",
      "poem_special1",
      "happy thoughts",
      "シアワセ",
    ]),
    undefined,
  );
});

Deno.test("[parseRow] ignore if translation is empty", () => {
  assertEquals(parseRow(["", "strings", "Yes", ""]), undefined);
  assertEquals(
    parseRow(["ch0_main_41e273ca", "s", "Heeeeeeeyyy!!", ""]),
    undefined,
  );
});

Deno.test("[parseRow] strings statement row", () => {
  assert(parseRow(["", "strings", "Yes", "はい"]) instanceof StringsTranslate);
});

Deno.test("[parseRow] say statement row", () => {
  assert(
    parseRow([
      "ch0_main_41e273ca",
      "s",
      "Heeeeeeeyyy!!",
      "「おーはーよーーー！」",
    ]) instanceof SayTranslate,
  );
  assert(
    parseRow([
      "ch0_main_41e273ca_1",
      "s",
      "Heeeeeeeyyy!!",
      "「おーはーよーーー！」",
    ]) instanceof SayTranslate,
  );
});

Deno.test("[parseRow] file row", () => {
  assert(
    parseRow([
      "CAN YOU HEAR ME.txt",
      "file",
      "There's a little devil inside all of us.",
      "私たちの中には小さな悪魔がいる",
    ]) instanceof FileTranslate,
  );
});

Deno.test("[convaerHistorySupport] character dialog", () => {
  const say = [
    new SayTranslate(
      "ch0_main_41e273ca",
      "s",
      "Heeeeeeeyyy!!",
      "「おーはーよーーー！」",
    ),
  ];
  assertEquals(convaerHistorySupport(say), [
    new StringsTranslate("{#ch0_main_41e273ca}", "「おーはーよーーー！」"),
  ]);
});

Deno.test("[convaerHistorySupport] monologue dialog", () => {
  const say = [
    new SayTranslate(
      "ch0_main_cb634d94",
      "",
      "I dejectedly follow Sayori across the school and upstairs - a section of the school I rarely visit, being generally used for third-year classes and activities.",
      trimIndent`
          "やれやれと思いながらサヨリの後について校舎をわたり階段を上っていく。"
          "着いたのは、学校の中でも普段は３年生の授業や活動で使用され、自分は滅多に行くことがない場所だった。"
        `,
    ),
  ];
  assertEquals(convaerHistorySupport(say), [
    new StringsTranslate(
      "{#ch0_main_cb634d94}",
      trimIndent`
          やれやれと思いながらサヨリの後について校舎をわたり階段を上っていく。
          着いたのは、学校の中でも普段は３年生の授業や活動で使用され、自分は滅多に行くことがない場所だった。
        `.replace("\n", "\\n"),
    ),
  ]);
});

Deno.test("[inflate] If no translation, return empty", () => {
  assertEquals(inflate("test", []), []);
});

Deno.test('[inflate] If no string translation, do not include "translate Japanese strings:"', () => {
  assertEquals(
    inflate("test", [
      new SayTranslate(
        "ch0_main_41e273ca",
        "s",
        "Heeeeeeeyyy!!",
        "「おーはーよーーー！」",
      ),
    ]),
    [
      {
        name: "test.rpy",
        content: trimIndent`
          translate Japanese ch0_main_41e273ca:
              s "「おーはーよーーー！」"

        `,
      },
    ],
  );
});

Deno.test("[inflate] If includeHistorySupport is true", () => {
  assertEquals(
    inflate(
      "test",
      [
        new SayTranslate(
          "ch0_main_41e273ca",
          "s",
          "Heeeeeeeyyy!!",
          "「おーはーよーーー！」",
        ),
      ],
      true,
    ),
    [
      {
        name: "test.rpy",
        content: trimIndent`
          translate Japanese ch0_main_41e273ca:
              s "「おーはーよーーー！」"

          translate Japanese strings:
              old "{#ch0_main_41e273ca}"
              new "「おーはーよーーー！」"

        `,
      },
    ],
  );
});

Deno.test("[inflate] If only file translation, do not return script file", () => {
  const t = [
    new FileTranslate(
      "CAN YOU HEAR ME.txt",
      "There's a little devil inside all of us.",
      "私たちの中には小さな悪魔がいる",
    ),
  ];
  assertEquals(inflate("test", t), [
    { name: "CAN YOU HEAR ME.txt", content: "私たちの中には小さな悪魔がいる" },
  ]);
});

Deno.test("removeDuplicateStrings", () => {
  const parsedSheet = [
    {
      name: "test1",
      translates: [
        new SayTranslate(
          "ch0_main_41e273ca",
          "s",
          "Heeeeeeeyyy!!",
          "「おーはーよーーー！」",
        ),
        new StringsTranslate("Heeeeeeeyyy!!", "「おーはーよーーー！」"),
        new StringsTranslate("Heeeeeeeyyy!!", "「おーはーよーーー！」"),
      ],
    },
    {
      name: "test2",
      translates: [new StringsTranslate("Heeeeeeeyyy!!", "「おーはーよーーー！」")],
    },
  ];
  assertEquals(removeDuplicateStrings(parsedSheet), [
    {
      name: "test1",
      translates: [
        new SayTranslate(
          "ch0_main_41e273ca",
          "s",
          "Heeeeeeeyyy!!",
          "「おーはーよーーー！」",
        ),
        new StringsTranslate("Heeeeeeeyyy!!", "「おーはーよーーー！」"),
      ],
    },
  ]);
});

Deno.test("generateCode", () => {
  type Sheet = Parameters<typeof generateCode>[0][0];
  const toSheet = (
    name: string,
    values: [string, string, string, string][],
  ): Sheet => ({
    getName: () => name,
    getRange: () => ({
      getValues: () => values,
    }),
  });
  const sheets = [
    toSheet("test1", [
      ["ID", "属性", "原文", "翻訳"],
      ["", "", "", ""],
      ["ch0_main_41e273ca", "s", "Heeeeeeeyyy!!", "「おーはーよーーー！」"],
      ["", "strings", "Yes", "はい"],
      ["※Yesの場合", "", "", ""],
      [
        "CAN YOU HEAR ME.txt",
        "file",
        "There's a little devil inside all of us.",
        "私たちの中には小さな悪魔がいる",
      ],
    ]),
    toSheet("test2", [["", "strings", "Yes", "はい"]]),
  ];

  assertEquals(generateCode(sheets, true), [
    {
      name: "test1.rpy",
      content: trimIndent`
      translate Japanese ch0_main_41e273ca:
          s "「おーはーよーーー！」"

      translate Japanese strings:
          old "Yes"
          new "はい"

          old "{#ch0_main_41e273ca}"
          new "「おーはーよーーー！」"

    `,
    },
    {
      name: "CAN YOU HEAR ME.txt",
      content: "私たちの中には小さな悪魔がいる",
    },
  ]);
});
