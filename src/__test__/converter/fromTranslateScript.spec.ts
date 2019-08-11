import FromTranslateScript from '../../converter/fromTranslateScript';
import TestResource from '../testResource';

describe(`class FromTranslateScript`, () => {
  describe(`FromTranslateScript#convert`, () => {
    it('do', () => {
      const sheet = `translate Japanese ch0_main_41e273ca:
    s "「おーはーよーーー！」"

translate Japanese ch0_main_41e273ca_1:
    s "「おーはーよーーー！」"

translate Japanese ch0_main_cb634d94:
    "やれやれと思いながらサヨリの後について校舎をわたり階段を上っていく。"
    "着いたのは、学校の中でも普段は３年生の授業や活動で使用され、自分は滅多に行くことがない場所だった。"

translate Japanese strings:
    old "Sayori"
    new "サヨリ"
`;
      expect(FromTranslateScript.convert(sheet)).toMatchObject([
        {
          id: 'ch0_main_41e273ca',
          attribute: 's',
          original: '',
          translate: '「おーはーよーーー！」',
        },
        {
          id: 'ch0_main_41e273ca_1',
          attribute: 's',
          original: '',
          translate: '「おーはーよーーー！」',
        },
        {
          id: 'ch0_main_cb634d94',
          attribute: '',
          original: '',
          translate: TestResource.longDialog.translate,
        },
        { id: '', attribute: 'strings', original: 'Sayori', translate: 'サヨリ' },
      ]);
    });
  });
});
