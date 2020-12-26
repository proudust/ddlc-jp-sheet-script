import { checkId, checkAttribute, checkEllipsis, checkWaitTag, checkTextTags } from './renpy-check';

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

describe('checkTextTags', () => {
  test('Not error', () => {
    const nw = toArgs({
      id: '_mas_chess_dlgqfeditstart_76684384',
      original: 'Did you edit the save file?{nw}',
      translate: 'セーブデータを書き換えたの？{nw}',
    });
    expect(checkTextTags(nw)).toBeUndefined();
  });

  test('Error if text tag typo', () => {
    const typo = toArgs({
      id: 'monika_cares_about_dokis_082ab550',
      original:
        'So [player], does it make you uncomfortable when I joke about the other girls?{nw}',
      translate: '[player]はあの子達について冗談を言って欲しくない？{ne}',
    });
    expect(checkTextTags(typo)).toBeTruthy();
  });

  test('Error if text tag not open', () => {
    const notOpen = toArgs({
      id: '_call_mas_wx_cmd_24_9718b39c',
      original:
        'Python also has a special data type called a {b}NoneType{/b}.{w=0.2} This type represents the absence of any data.',
      translate:
        'Pythonは{/b}NoneType{/b}という特別なデータ型もあって、これはデータがないということを意味するの。',
    });
    expect(checkTextTags(notOpen)).toBeTruthy();
  });
});
