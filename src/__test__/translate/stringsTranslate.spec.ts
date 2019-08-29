import { SayTranslate } from '../../transrate/sayTranslate';
import { FileTranslate } from '../../transrate/fileTranslate';
import { StringsTranslate } from '../../transrate/stringsTranslate';

import { monologueSay, poemTitle, poemContent, file } from '../testResource';

describe(`class StringsTranslate`, () => {
  describe(`StringsTranslate#inflate`, () => {
    it('not including line break', () => {
      const t = new StringsTranslate(poemTitle);
      expect(t.inflate(null)).toBe(`translate Japanese strings:\n${poemTitle.translateScript}`);
    });

    it('including line break', () => {
      const t = new StringsTranslate(poemContent);
      expect(t.inflate(null)).toBe(`translate Japanese strings:\n${poemContent.translateScript}`);
    });

    it('before is StringsTranslate', () => {
      const t = new StringsTranslate(poemTitle);
      const d = new StringsTranslate({ original: 'dummy', translate: 'ダミー' });
      expect(t.inflate(d)).toBe(poemTitle.translateScript);
    });

    it('before is Other Translate', () => {
      const t = new StringsTranslate(poemTitle);
      const d1 = new SayTranslate(monologueSay);
      const d2 = new FileTranslate(file);
      const result = `translate Japanese strings:\n${poemTitle.translateScript}`;
      expect(t.inflate(d1)).toBe(result);
      expect(t.inflate(d2)).toBe(result);
    });
  });
});
