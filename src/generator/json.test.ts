import { readRow } from './json';

describe('readRow', () => {
  test('enpty or comment row', () => {
    expect(readRow({}, ['', '', '', ''])).toEqual({});
    expect(readRow({}, ['', '', 'EV001', ''])).toEqual({});
    expect(readRow({}, ['Map001', '', '...', ''])).toEqual({});
    expect(readRow({}, ['Map001', '', '...', '...'])).toEqual({});
  });

  test('translation row', () => {
    expect(
      readRow({}, ['Map043.json', '', '....Another nightmare..', '....またあの嫌な夢だ..']),
    ).toEqual({
      'Map043.json': {
        '....Another nightmare..': '....またあの嫌な夢だ..',
      },
    });
  });

  test('multiple lines translation row', () => {
    expect(
      readRow({}, [
        'Map118.json',
        '',
        "It feels like..\\.\\...\nMy head's gonna burst open......\\..\\.",
        'ヤバい..\\.\\...\n頭が爆発しそう......\\..\\.',
      ]),
    ).toEqual({
      'Map118.json': {
        'It feels like..\\.\\...': 'ヤバい..\\.\\...',
        "My head's gonna burst open......\\..\\.": '頭が爆発しそう......\\..\\.',
      },
    });
  });

  test('fewer lines than the original', () => {
    expect(
      readRow({}, [
        'Map001.json',
        '',
        'I never did end up finding \nthose last few journal \npages...',
        'まだ見つからない日記のページ。\nこの先も探し続けるのだろう。',
      ]),
    ).toEqual({
      'Map001.json': {
        'I never did end up finding ': 'まだ見つからない日記のページ。',
        'those last few journal ': 'この先も探し続けるのだろう。',
        'pages...': '',
      },
    });
  });

  test('more lines than the original', () => {
    expect(
      readRow({}, [
        'Map002.json',
        '',
        'I thought you were a more\npeaceful BEAST - Type.',
        'ビーストタイプでも\nもっとやさしいビーストタイプ\nだと思ってたのに。',
      ]),
    ).toEqual({
      'Map002.json': {
        'I thought you were a more': 'ビーストタイプでも',
        'peaceful BEAST - Type.': 'もっとやさしいビーストタイプ\nだと思ってたのに。',
      },
    });
  });

  test('duplicate translation row', () => {
    const t1 = readRow({}, [
      'Map043.json',
      '',
      '....Another nightmare..',
      '....またあの嫌な夢だ..',
    ]);
    expect(() =>
      readRow(t1, ['Map043.json', '', '....Another nightmare..', '異なる訳']),
    ).toThrowError(/^.+ is duplicate translation.$/);
  });

  test('duplicate translation row', () => {
    const t1 = readRow({}, [
      'Map007.json',
      '',
      '\\SE[8]Thank you so much!!\\.\\. What a relief\nto come across someone so kind!\\SE[1]',
      '\\SE[8]あ、ありがとう!!\\.\\.\n親切な人が通りかかってくれて\n本当に助かったよ!\\SE[1]',
    ]);
    expect(
      readRow(t1, [
        'Map007.json',
        '',
        '\\SE[8]Thank you so much!! What a relief\nto come across someone so kind!\\SE[1]',
        '\\SE[8]ありがとう!!\n親切な人が通りかかってくれて\n本当に助かったよ!\\SE[1]',
      ]),
    ).toEqual({
      'Map007.json': {
        '\\SE[8]Thank you so much!!\\.\\. What a relief': '\\SE[8]あ、ありがとう!!\\.\\.',
        'to come across someone so kind!\\SE[1]':
          '親切な人が通りかかってくれて\n本当に助かったよ!\\SE[1]',
        '\\SE[8]Thank you so much!! What a relief': '\\SE[8]ありがとう!!',
      },
    });
  });
});
