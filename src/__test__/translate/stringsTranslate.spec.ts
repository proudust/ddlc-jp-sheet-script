import { SayTranslate } from '../../transrate/sayTranslate';
import { FileTranslate } from '../../transrate/fileTranslate';
import { StringsTranslate } from '../../transrate/stringsTranslate';

import { monologueSay, poem, file } from '../testResource';

describe(`class StringsTranslate`, () => {
  describe(`StringsTranslate#inflate`, () => {
    it('not including line break', () => {
      const t = new StringsTranslate(poem.originalTitle, poem.translateTitle);
      expect(t.inflate(null)).toBe(`translate Japanese strings:\n${poem.translateTitleScript}`);
    });

    it('including line break', () => {
      const t = new StringsTranslate(poem.originalContent, poem.translateContent);
      expect(t.inflate(null)).toBe(`translate Japanese strings:\n${poem.translateContentScript}`);
    });

    it('before is StringsTranslate', () => {
      const t = new StringsTranslate(poem.originalTitle, poem.translateTitle);
      const d = new StringsTranslate('dummy', 'ダミー');
      expect(t.inflate(d)).toBe(poem.translateTitleScript);
    });

    it('before is Other Translate', () => {
      const t = new StringsTranslate(poem.originalTitle, poem.translateTitle);
      const d1 = new SayTranslate(monologueSay);
      const d2 = new FileTranslate(file);
      const result = `translate Japanese strings:\n${poem.translateTitleScript}`;
      expect(t.inflate(d1)).toBe(result);
      expect(t.inflate(d2)).toBe(result);
    });
  });
});
