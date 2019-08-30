import { SayTranslate } from '../../transrate/sayTranslate';

import { characterSay, monologueSay, nointeractSay, longSay, escapeSay } from '../testResource';

describe(`class DialogsTranslate`, () => {
  describe(`DialogsTranslate#inflate`, () => {
    it('character dialog', () => {
      const t = new SayTranslate(characterSay);
      expect(t.inflate()).toBe(characterSay.translateScript);
    });

    it('monologue', () => {
      const t = new SayTranslate(monologueSay);
      expect(t.inflate()).toBe(monologueSay.translateScript);
    });

    it('nointeract', () => {
      const t = new SayTranslate(nointeractSay);
      expect(t.inflate()).toBe(nointeractSay.translateScript);
    });

    it('split dialog', () => {
      const t = new SayTranslate(longSay);
      expect(t.inflate()).toBe(longSay.translateScript);
    });

    it('included escape char', () => {
      const t = new SayTranslate(escapeSay);
      expect(t.inflate()).toBe(escapeSay.translateScript);
    });
  });
});
