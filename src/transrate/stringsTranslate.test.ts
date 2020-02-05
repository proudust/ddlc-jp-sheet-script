import { StringsTranslate } from './stringsTranslate';

import { poemTitle, poemContent } from '../testResource';

describe(`class StringsTranslate`, () => {
  describe(`StringsTranslate#inflate`, () => {
    it('not including line break', () => {
      const t = new StringsTranslate(poemTitle);
      expect(t.inflate()).toBe(poemTitle.translateScript);
    });

    it('including line break', () => {
      const t = new StringsTranslate(poemContent);
      expect(t.inflate()).toBe(poemContent.translateScript);
    });
  });
});
