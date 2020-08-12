import { checkLength } from './rpgmv-check';

type CheckArgs = Parameters<typeof checkLength>[0];
const toArgs = (obj: Partial<CheckArgs>): CheckArgs => ({
  id: '',
  attr: '',
  original: '',
  translate: '',
  sheetName: '',
  sheetRowNumber: 0,
  ...obj,
});

describe('checkId', () => {
  test('Not error', () => {
    const normal = toArgs({
      translate: 'ごめんね！\\.\\.さっきまで裏で\nちょいと仕事してたもんだからさ。',
    });
    expect(checkLength(normal)).toBeUndefined();
  });

  test('Error', () => {
    const normal = toArgs({
      translate: 'ごめんね! \\.\\.さっきまで裏でちょいと\n仕事してたもんだからさ。',
    });
    expect(checkLength(normal)).toBeTruthy();
  });
});
