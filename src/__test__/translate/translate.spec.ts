import DialogsTranslate from '../../transrate/dialogsTranslate';
import FileTranslate from '../../transrate/fileTranslate';
import StringsTranslate from '../../transrate/stringsTranslate';
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

describe(`class FileTranslate`, () => {
  describe(`FileTranslate#inflate`, () => {
    it('do', () => {
      const t = new FileTranslate(
        'CAN YOU HEAR ME.txt',
        TestResource.fileContent.orifinal,
        TestResource.fileContent.translate,
      );
      expect(t.inflate()).toStrictEqual({
        fileName: 'CAN YOU HEAR ME.txt',
        content: TestResource.fileContent.translate,
      });
    });
  });
});

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
