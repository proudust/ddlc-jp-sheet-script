import { checkId, checkAttribute, checkEllipsis, checkWaitTag } from './renpy-check';

type CheckArgs = Parameters<typeof checkId>[0];
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
      id: 'bye_leaving_already_035e8b8a',
      original: 'test',
    });
    expect(checkId(normal)).toBeUndefined();

    const withSuffix = toArgs({
      id: 'bye_leaving_already_035e8b8a_1',
      original: 'test',
    });
    expect(checkId(withSuffix)).toBeUndefined();

    const comment = toArgs({
      id: '※',
      original: '',
    });
    expect(checkId(comment)).toBeUndefined();
  });

  test('Error if id hash length is not 8', () => {
    const short = toArgs({
      id: 'bye_prompt_sleep_cdf617a',
      original: 'test',
    });
    expect(checkId(short)).toBeTruthy();

    const long = toArgs({
      id: 'bye_prompt_sleep_cdf617a10',
      original: 'test',
    });
    expect(checkId(long)).toBeTruthy();
  });
});

describe('checkAttribute', () => {
  test('Not error', () => {
    const dialog = toArgs({
      attr: 'm 1tkc',
      original: 'test',
    });
    expect(checkAttribute(dialog)).toBeUndefined();

    const strings = toArgs({
      attr: 'strings',
      original: 'test',
    });
    expect(checkAttribute(strings)).toBeUndefined();
  });

  test('Error if attr is typo', () => {
    const short = toArgs({
      attr: 'string',
      original: 'test',
    });
    expect(checkAttribute(short)).toBeTruthy();
  });
});

describe('checkEllipsis', () => {
  test('Not error', () => {
    const dialog1 = toArgs({
      translate: 'ねぇ、[player]……',
    });
    expect(checkEllipsis(dialog1)).toBeUndefined();

    const dialog2 = toArgs({
      translate: '私って本当にドジだね、[player]君……{w=0.3}ごめんなさい。',
    });
    expect(checkEllipsis(dialog2)).toBeUndefined();

    const dialog3 = toArgs({
      translate: '[spr_obj.dlg_desc!t]、[acs_quip]',
    });
    expect(checkEllipsis(dialog3)).toBeUndefined();
  });

  test('Error if dot ellipsis', () => {
    const dialog1 = toArgs({
      translate: 'ねぇ、[player]...',
    });
    expect(checkEllipsis(dialog1)).toBeTruthy();

    const dialog2 = toArgs({
      translate: 'ねぇ、[player]......',
    });
    expect(checkEllipsis(dialog2)).toBeTruthy();
  });

  test('Error if single horizontal ellipsis', () => {
    const dialog1 = toArgs({
      translate: '彼女は優しい娘だけど、それでもね…',
    });
    expect(checkEllipsis(dialog1)).toBeTruthy();

    const dialog2 = toArgs({
      translate: '…待ってね。',
    });
    expect(checkEllipsis(dialog2)).toBeTruthy();
  });
});

describe('checkWaitTag', () => {
  test('Not error', () => {
    const dialog1 = toArgs({
      translate: '{w=0.2}',
    });
    expect(checkWaitTag(dialog1)).toBeUndefined();
  });

  test('Error if wait tag contains space', () => {
    const dialog1 = toArgs({
      translate: '{w=0. 2}',
    });
    expect(checkWaitTag(dialog1)).toBeTruthy();

    const dialog2 = toArgs({
      translate: '{w = 0.3}',
    });
    expect(checkWaitTag(dialog2)).toBeTruthy();
  });
});
