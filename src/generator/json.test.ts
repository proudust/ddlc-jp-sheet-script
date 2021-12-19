import { assertEquals, assertThrows } from "../../dev-deps.ts";
import { readRow } from "./json.ts";

Deno.test("[readRow] enpty or comment row", () => {
  assertEquals(readRow({}, ["", "", "", ""]), {});
  assertEquals(readRow({}, ["", "", "EV001", ""]), {});
  assertEquals(readRow({}, ["Map001", "", "...", ""]), {});
  assertEquals(readRow({}, ["Map001", "", "...", "..."]), {});
});

Deno.test("[readRow] multiple jsonPath", () => {
  assertEquals(
    readRow({}, [
      "Map027.json",
      ".events[1]\n.events[15: 20]",
      "But...\\.\\.",
      "だが...\\.\\.それは我の望みではない。\\.\\.",
    ]),
    {
      "Map027.json": {
        ".events[1]": {
          "But...\\.\\.": "だが...\\.\\.それは我の望みではない。\\.\\.",
        },
        ".events[15: 20]": {
          "But...\\.\\.": "だが...\\.\\.それは我の望みではない。\\.\\.",
        },
      },
    },
  );
});

Deno.test("[readRow] translation row", () => {
  assertEquals(
    readRow({}, [
      "Map043.json",
      "",
      "....Another nightmare..",
      "....またあの嫌な夢だ..",
    ]),
    {
      "Map043.json": {
        ".": {
          "....Another nightmare..": "....またあの嫌な夢だ..",
        },
      },
    },
  );
});

Deno.test("[readRow] multiple lines translation row LF", () => {
  assertEquals(
    readRow({}, [
      "Map118.json",
      "",
      "It feels like..\\.\\...\nMy head's gonna burst open......\\..\\.",
      "ヤバい..\\.\\...\n頭が爆発しそう......\\..\\.",
    ]),
    {
      "Map118.json": {
        ".": {
          "It feels like..\\.\\...": "ヤバい..\\.\\...",
          "My head's gonna burst open......\\..\\.": "頭が爆発しそう......\\..\\.",
        },
      },
    },
  );
});
Deno.test("[readRow] multiple lines translation row CRLF", () => {
  assertEquals(
    readRow({}, [
      "Map118.json",
      "",
      "It feels like..\\.\\...\r\nMy head's gonna burst open......\\..\\.",
      "ヤバい..\\.\\...\r\n頭が爆発しそう......\\..\\.",
    ]),
    {
      "Map118.json": {
        ".": {
          "It feels like..\\.\\...": "ヤバい..\\.\\...",
          "My head's gonna burst open......\\..\\.": "頭が爆発しそう......\\..\\.",
        },
      },
    },
  );
});

Deno.test("[readRow] fewer lines than the original", () => {
  assertEquals(
    readRow({}, [
      "Map001.json",
      "",
      "I never did end up finding \nthose last few journal \npages...",
      "まだ見つからない日記のページ。\nこの先も探し続けるのだろう。",
    ]),
    {
      "Map001.json": {
        ".": {
          "I never did end up finding ": "まだ見つからない日記のページ。",
          "those last few journal ": "この先も探し続けるのだろう。",
          "pages...": "",
        },
      },
    },
  );
});

Deno.test("[readRow] more lines than the original", () => {
  assertEquals(
    readRow({}, [
      "Map002.json",
      "",
      "I thought you were a more\npeaceful BEAST - Type.",
      "ビーストタイプでも\nもっとやさしいビーストタイプ\nだと思ってたのに。",
    ]),
    {
      "Map002.json": {
        ".": {
          "I thought you were a more": "ビーストタイプでも",
          "peaceful BEAST - Type.": "もっとやさしいビーストタイプ\nだと思ってたのに。",
        },
      },
    },
  );
});

Deno.test("[readRow] duplicate translation and same path", () => {
  const t1 = readRow({}, [
    "Map043.json",
    "",
    "....Another nightmare..",
    "....またあの嫌な夢だ..",
  ]);
  assertThrows(
    () => readRow(t1, ["Map043.json", "", "....Another nightmare..", "異なる訳"]),
    undefined,
    " is duplicate translation.",
  );
});

Deno.test("[readRow] duplicate translation and different path", () => {
  const t1 = readRow({}, [
    "Map043.json",
    "",
    "....Another nightmare..",
    "....またあの嫌な夢だ..",
  ]);
  assertEquals(
    readRow(t1, [
      "Map043.json",
      ".events[2]",
      "....Another nightmare..",
      "異なる訳",
    ]),
    {
      "Map043.json": {
        ".": {
          "....Another nightmare..": "....またあの嫌な夢だ..",
        },
        ".events[2]": {
          "....Another nightmare..": "異なる訳",
        },
      },
    },
  );
});

Deno.test("[readRow] duplicate translation and equal 1", () => {
  const t1 = readRow({}, [
    "Map007.json",
    "",
    "\\SE[8]Thank you so much!!\\.\\. What a relief\nto come across someone so kind!\\SE[1]",
    "\\SE[8]あ、ありがとう!!\\.\\.\n親切な人が通りかかってくれて\n本当に助かったよ!\\SE[1]",
  ]);
  assertEquals(
    readRow(t1, [
      "Map007.json",
      "",
      "\\SE[8]Thank you so much!! What a relief\nto come across someone so kind!\\SE[1]",
      "\\SE[8]ありがとう!!\n親切な人が通りかかってくれて\n本当に助かったよ!\\SE[1]",
    ]),
    {
      "Map007.json": {
        ".": {
          "\\SE[8]Thank you so much!!\\.\\. What a relief":
            "\\SE[8]あ、ありがとう!!\\.\\.",
          "to come across someone so kind!\\SE[1]":
            "親切な人が通りかかってくれて\n本当に助かったよ!\\SE[1]",
          "\\SE[8]Thank you so much!! What a relief": "\\SE[8]ありがとう!!",
        },
      },
    },
  );
});

Deno.test("[readRow] duplicate translation and equal 2", () => {
  const t1 = readRow({}, [
    "Map043.json",
    "",
    "Looks like these are \ningredients ready to use for \nspells and formulas.",
    "術式や儀式に使う材料みたい。",
  ]);
  assertEquals(
    readRow(t1, [
      "Map043.json",
      "",
      ".\\..\\..Organic ingredients for\nspells and formulas.",
      ".\\..\\..術式や儀式に使う薬草かな。",
    ]),
    {
      "Map043.json": {
        ".": {
          "Looks like these are ": "術式や儀式に使う材料みたい。",
          "ingredients ready to use for ": "",
          "spells and formulas.": "",
          ".\\..\\..Organic ingredients for": ".\\..\\..術式や儀式に使う薬草かな。",
        },
      },
    },
  );
});
