import { parseRow, inflate, removeDuplicateStrings, generateCode } from './generator';
import { SayTranslate, StringsTranslate, FileTranslate } from './translates';
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

  expect(generateCode(sheets)).toStrictEqual([
    {
      name: 'test1.rpy',
      content: trimIndent`
      translate Japanese ch0_main_41e273ca:
          s "「おーはーよーーー！」"

      translate Japanese strings:
          old "Yes"
          new "はい"

    `,
    },
    {
      name: 'CAN YOU HEAR ME.txt',
      content: '私たちの中には小さな悪魔がいる',
    },
  ]);
});
