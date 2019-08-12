import DialogsTranslate from '../../transrate/dialogsTranslate';
import FileTranslate from '../../transrate/fileTranslate';
import StringsTranslate from '../../transrate/stringsTranslate';
import TestResource from '../testResource';

describe(`class StringsTranslate`, () => {
  describe(`StringsTranslate#inflate`, () => {
    it('not including line break', () => {
      const t = new StringsTranslate(
        TestResource.poemTitle.orifinal,
        TestResource.poemTitle.translate,
      );
      expect(t.inflate(null)).toBe(`translate Japanese strings:\n${TestResource.poemTitle.script}`);
    });

    it('including line break', () => {
      const t = new StringsTranslate(
        TestResource.poemContent.orifinal,
        TestResource.poemContent.translate,
      );
      expect(t.inflate(null)).toBe(
        `translate Japanese strings:\n${TestResource.poemContent.script}`,
      );
    });

    it('before is StringsTranslate', () => {
      const t = new StringsTranslate(
        TestResource.poemTitle.orifinal,
        TestResource.poemTitle.translate,
      );
      const d = new StringsTranslate('dummy', 'ダミー');
      expect(t.inflate(d)).toBe(TestResource.poemTitle.script);
    });

    it('before is Other Translate', () => {
      const t = new StringsTranslate(
        TestResource.poemTitle.orifinal,
        TestResource.poemTitle.translate,
      );
      const d1 = new DialogsTranslate('dummy_00000000', '', 'dummy', 'ダミー');
      const d2 = new FileTranslate('dummy.txt', 'dummy', 'ダミー');
      const result = `translate Japanese strings:\n${TestResource.poemTitle.script}`;
      expect(t.inflate(d1)).toBe(result);
      expect(t.inflate(d2)).toBe(result);
    });
  });
});
