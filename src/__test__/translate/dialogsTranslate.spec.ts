import { DialogsTranslate } from '../../transrate/dialogsTranslate';

import { characterSay, monologueSay, nointeractSay, longSay } from '../testResource';

describe(`class DialogsTranslate`, () => {
  describe(`DialogsTranslate#inflate`, () => {
    it('character dialog', () => {
      const t = new DialogsTranslate(
        'ch0_main_41e273ca',
        's',
        'Heeeeeeeyyy!!',
        '「おーはーよーーー！」',
      );
      expect(t.inflate()).toBe(characterSay.translateScript);
    });

    it('monologue', () => {
      const t = new DialogsTranslate(
        'ch0_main_bcc5bb00',
        '',
        monologueSay.original,
        monologueSay.translate,
      );
      expect(t.inflate()).toBe(monologueSay.translateScript);
    });

    it('nointeract', () => {
      const t = new DialogsTranslate(
        'ch3_end_sayori_dd9616f1',
        'm',
        nointeractSay.original,
        nointeractSay.translate,
        true,
      );
      expect(t.inflate()).toBe(nointeractSay.translateScript);
    });

    it('split dialog', () => {
      const t = new DialogsTranslate('ch0_main_cb634d94', '', longSay.original, longSay.translate);
      expect(t.inflate()).toBe(longSay.translateScript);
    });
  });
});
