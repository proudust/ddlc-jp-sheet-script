import {
  parseRow,
  convaerHistorySupport,
  inflate,
  removeDuplicateStrings,
  generateCode,
} from './renpy';
import { SayTranslate, StringsTranslate, FileTranslate } from './renpyTranslates';
import { trimIndent } from '../util/tags';

describe('parseRow', () => {
  test('enpty or comment row', () => {
    expect(parseRow(['', '', '', ''])).toBeUndefined();
    expect(parseRow(['※Yesの場合', '', '', ''])).toBeUndefined();
    expect(parseRow(['', '', '※Yesの場合', ''])).toBeUndefined();
    expect(
      parseRow(['poem_special1.png', 'poem_special1', 'happy thoughts', 'シアワセ']),
    ).toBeUndefined();
  });

  test('strings statement row', () => {
    expect(parseRow(['', 'strings', 'Yes', 'はい'])).toBeInstanceOf(StringsTranslate);
  });

  test('say statement row', () => {
    expect(
      parseRow(['ch0_main_41e273ca', 's', 'Heeeeeeeyyy!!', '「おーはーよーーー！」']),
    ).toBeInstanceOf(SayTranslate);
    expect(
      parseRow(['ch0_main_41e273ca_1', 's', 'Heeeeeeeyyy!!', '「おーはーよーーー！」']),
    ).toBeInstanceOf(SayTranslate);
  });

  test('file row', () => {
    expect(
      parseRow([
        'CAN YOU HEAR ME.txt',
        'file',
        "There's a little devil inside all of us.",
        '私たちの中には小さな悪魔がいる',
      ]),
    ).toBeInstanceOf(FileTranslate);
  });
});

describe('convaerHistorySupport', () => {
  test('character dialog', () => {
    const say = [
      new SayTranslate('ch0_main_41e273ca', 's', 'Heeeeeeeyyy!!', '「おーはーよーーー！」'),
    ];
    expect(convaerHistorySupport(say)).toStrictEqual([
      new StringsTranslate('{#ch0_main_41e273ca}', '「おーはーよーーー！」'),
    ]);
  });

  test('character dialog', () => {
    const say = [
      new SayTranslate(
        'ch0_main_cb634d94',
        '',
        'I dejectedly follow Sayori across the school and upstairs - a section of the school I rarely visit, being generally used for third-year classes and activities.',
        trimIndent`
          "やれやれと思いながらサヨリの後について校舎をわたり階段を上っていく。"
          "着いたのは、学校の中でも普段は３年生の授業や活動で使用され、自分は滅多に行くことがない場所だった。"
        `,
      ),
    ];
    expect(convaerHistorySupport(say)).toStrictEqual([
      new StringsTranslate(
        '{#ch0_main_cb634d94}',
        trimIndent`
          やれやれと思いながらサヨリの後について校舎をわたり階段を上っていく。
          着いたのは、学校の中でも普段は３年生の授業や活動で使用され、自分は滅多に行くことがない場所だった。
        `.replace('\n', '\\n'),
      ),
    ]);
  });
});

describe('inflate', () => {
  test('If no translation, return empty', () => {
    expect(inflate('test', [])).toStrictEqual([]);
  });

  test('If no string translation, do not include "translate Japanese strings:"', () => {
    expect(
      inflate('test', [
        new SayTranslate('ch0_main_41e273ca', 's', 'Heeeeeeeyyy!!', '「おーはーよーーー！」'),
      ]),
    ).toStrictEqual([
      {
        name: 'test.rpy',
        content: trimIndent`
          translate Japanese ch0_main_41e273ca:
              s "「おーはーよーーー！」"

        `,
      },
    ]);
  });

  test('If includeHistorySupport is true', () => {
    expect(
      inflate(
        'test',
        [new SayTranslate('ch0_main_41e273ca', 's', 'Heeeeeeeyyy!!', '「おーはーよーーー！」')],
        true,
      ),
    ).toStrictEqual([
      {
        name: 'test.rpy',
        content: trimIndent`
          translate Japanese ch0_main_41e273ca:
              s "「おーはーよーーー！」"

          translate Japanese strings:
              old "{#ch0_main_41e273ca}"
              new "「おーはーよーーー！」"

        `,
      },
    ]);
  });

  test('If only file translation, do not return script file', () => {
    const t = [
      new FileTranslate(
        'CAN YOU HEAR ME.txt',
        "There's a little devil inside all of us.",
        '私たちの中には小さな悪魔がいる',
      ),
    ];
    expect(inflate('test', t)).toStrictEqual([
      { name: 'CAN YOU HEAR ME.txt', content: '私たちの中には小さな悪魔がいる' },
    ]);
  });
});

test('removeDuplicateStrings', () => {
  const parsedSheet = [
    {
      name: 'test1',
      translates: [
        new SayTranslate('ch0_main_41e273ca', 's', 'Heeeeeeeyyy!!', '「おーはーよーーー！」'),
        new StringsTranslate('Heeeeeeeyyy!!', '「おーはーよーーー！」'),
        new StringsTranslate('Heeeeeeeyyy!!', '「おーはーよーーー！」'),
      ],
    },
    {
      name: 'test2',
      translates: [new StringsTranslate('Heeeeeeeyyy!!', '「おーはーよーーー！」')],
    },
  ];
  expect(removeDuplicateStrings(parsedSheet)).toStrictEqual([
    {
      name: 'test1',
      translates: [
        new SayTranslate('ch0_main_41e273ca', 's', 'Heeeeeeeyyy!!', '「おーはーよーーー！」'),
        new StringsTranslate('Heeeeeeeyyy!!', '「おーはーよーーー！」'),
      ],
    },
  ]);
});

test('generateCode', () => {
  type Sheet = Parameters<typeof generateCode>[0][0];
  const toSheet = (name: string, values: [string, string, string, string][]): Sheet => ({
    getName: () => name,
    getRange: () => ({
      getValues: () => values,
    }),
  });
  const sheets = [
    toSheet('test1', [
      ['ID', '属性', '原文', '翻訳'],
      ['', '', '', ''],
      ['ch0_main_41e273ca', 's', 'Heeeeeeeyyy!!', '「おーはーよーーー！」'],
      ['', 'strings', 'Yes', 'はい'],
      ['※Yesの場合', '', '', ''],
      [
        'CAN YOU HEAR ME.txt',
        'file',
        "There's a little devil inside all of us.",
        '私たちの中には小さな悪魔がいる',
      ],
    ]),
    toSheet('test2', [['', 'strings', 'Yes', 'はい']]),
  ];

  expect(generateCode(sheets, true)).toStrictEqual([
    {
      name: 'test1.rpy',
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
      name: 'CAN YOU HEAR ME.txt',
      content: '私たちの中には小さな悪魔がいる',
    },
  ]);
});
