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
      readRow({}, ['Map043', '', '....Another nightmare..', '....またあの嫌な夢だ..']),
    ).toEqual({
      Map043: {
        '....Another nightmare..': '....またあの嫌な夢だ..',
      },
    });
  });

  test('duplicate translation row', () => {
    const t1 = readRow({}, ['Map043', '', '....Another nightmare..', '....またあの嫌な夢だ..']);
    expect(() =>
      readRow(t1, ['Map043', '', '....Another nightmare..', '....またあの嫌な夢だ..']),
    ).toThrowError(/^.+ is duplicate translation.$/);
  });
});
