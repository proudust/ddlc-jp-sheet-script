import DialogsTranslate from '../../transrate/dialogsTranslate';
import FileTranslate from '../../transrate/fileTranslate';
import StringsTranslate from '../../transrate/stringsTranslate';
import TestResource from './testResource';

describe(`class DialogsTranslate`, () => {
  describe(`DialogsTranslate#inflate`, () => {
    it('do', () => {
      const t = new DialogsTranslate(
        'ch0_main_41e273ca',
        's',
        'Heeeeeeeyyy!!',
        '「おーはーよーーー！」',
      );
      expect(t.inflate()).toBe(TestResource.dialog.script);
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
      expect(t.inflate()).toBe(TestResource.poemTitle.script);
    });

    it('including line break', () => {
      const t = new StringsTranslate(
        TestResource.poemContent.orifinal,
        TestResource.poemContent.translate,
      );
      expect(t.inflate()).toBe(TestResource.poemContent.script);
    });
  });
});
