import DialogsTranslate from '../../transrate/dialogsTranslate';
import TestResource from '../testResource';

describe(`class DialogsTranslate`, () => {
  describe(`DialogsTranslate#inflate`, () => {
    it('character dialog', () => {
      const t = new DialogsTranslate(
        'ch0_main_41e273ca',
        's',
        'Heeeeeeeyyy!!',
        '「おーはーよーーー！」',
      );
      expect(t.inflate()).toBe(TestResource.dialog.script);
    });

    it('monologue', () => {
      const t = new DialogsTranslate(
        'ch0_main_bcc5bb00',
        '',
        TestResource.mcDialog.orifinal,
        TestResource.mcDialog.translate,
      );
      expect(t.inflate()).toBe(TestResource.mcDialog.script);
    });

    it('nointeract', () => {
      const t = new DialogsTranslate(
        'ch3_end_sayori_dd9616f1',
        'm',
        TestResource.nointeractDialog.orifinal,
        TestResource.nointeractDialog.translate,
        true,
      );
      expect(t.inflate()).toBe(TestResource.nointeractDialog.script);
    });

    it('split dialog', () => {
      const t = new DialogsTranslate(
        'ch0_main_cb634d94',
        '',
        TestResource.longDialog.orifinal,
        TestResource.longDialog.translate,
      );
      expect(t.inflate()).toBe(TestResource.longDialog.script);
    });
  });
});
