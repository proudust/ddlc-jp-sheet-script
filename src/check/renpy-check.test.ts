import * as RenPyChecker from './renpy-check';

describe('IdFormatChecker', () => {
  const IdFormatChecker = new RenPyChecker.IdFormatChecker();

  test.each`
    id                                  | valid
    ${'bye_leaving_already_035e8b8a'}   | ${false}
    ${'bye_leaving_already_035e8b8a_1'} | ${false}
    ${'bye_prompt_sleep_cdf617a'}       | ${true}
    ${'bye_prompt_sleep_cdf617a10'}     | ${true}
  `('check({ id: "$id" }) => $valid', ({ id, valid }) => {
    expect(IdFormatChecker.check({ id })).toBe(valid);
  });
});

describe('UseUnknownAttributesChecker', () => {
  const UseUnknownAttributesChecker = new RenPyChecker.UseUnknownAttributesChecker();

  test.each`
    attr         | valid
    ${'m 1tkc'}  | ${false}
    ${'strings'} | ${false}
    ${'string'}  | ${true}
  `('check({ attr: "$attr" }) => $valid', ({ attr, valid }) => {
    expect(UseUnknownAttributesChecker.check({ attr })).toBe(valid);
  });
});

describe('UnificationEllipsisChecker', () => {
  const UnificationEllipsisChecker = new RenPyChecker.UnificationEllipsisChecker();

  test.each`
    translate                                                  | valid
    ${'ねぇ、[player]……'}                                      | ${false}
    ${'ねぇ、[player]…'}                                       | ${true}
    ${'ねぇ、[player]...'}                                     | ${true}
    ${'ねぇ、[player]......'}                                  | ${true}
    ${'…待ってね'}                                             | ${true}
    ${'私って本当にドジだね、[player]君……{w=0.3}ごめんなさい'} | ${false}
    ${'[spr_obj.dlg_desc!t]、[acs_quip]'}                      | ${false}
  `('check({ translate: "$translate" }) => $valid', ({ translate, valid }) => {
    expect(UnificationEllipsisChecker.check({ translate })).toBe(valid);
  });
});

describe('CantIncludeSpaceInWaitTagsChecker', () => {
  const CantIncludeSpaceInWaitTagsChecker = new RenPyChecker.CantIncludeSpaceInWaitTagsChecker();

  test.each`
    translate      | valid
    ${'{w=0.2}'}   | ${false}
    ${'{w=0. 2}'}  | ${true}
    ${'{w = 0.3}'} | ${true}
  `('check({ translate: "$translate" }) => $valid', ({ translate, valid }) => {
    expect(CantIncludeSpaceInWaitTagsChecker.check({ translate })).toBe(valid);
  });
});

describe('CantIncludeHalfWidthChecker', () => {
  const CantIncludeHalfWidthChecker = new RenPyChecker.CantIncludeHalfWidthChecker();

  test.each`
    translate       | valid
    ${'引き分け?'}  | ${true}
    ${'引き分け？'} | ${false}
    ${'私の勝ち!'}  | ${true}
    ${'私の勝ち！'} | ${false}
    ${'[v_quip!t]'} | ${false}
    ${'あはは~'}    | ${true}
    ${'あはは～'}   | ${false}
  `('check({ translate: "$translate" }) => $valid', ({ translate, valid }) => {
    expect(CantIncludeHalfWidthChecker.check({ translate })).toBe(valid);
  });
});
