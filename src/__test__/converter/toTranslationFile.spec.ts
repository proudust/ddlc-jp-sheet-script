import ToTranslationFile from '../../converter/toTranslationFile';
import DialogsTranslate from '../../transrate/dialogsTranslate';
import FileTranslate from '../../transrate/fileTranslate';
import StringsTranslate from '../../transrate/stringsTranslate';
import TestResource from '../testResource';

describe(`class ToTranslationFile`, () => {
  describe(`ToTranslationFile#convert`, () => {
    it('do', () => {
      const sheet = [
        new StringsTranslate('Sayori', 'サヨリ'),
        new DialogsTranslate('ch0_main_41e273ca', 's', 'Heeeeeeeyyy!!', '「おーはーよーーー！」'),
        new FileTranslate(
          'CAN YOU HEAR ME.txt',
          TestResource.fileContent.orifinal,
          TestResource.fileContent.translate,
        ),
      ];
      expect(ToTranslationFile.convert('test', sheet)).toStrictEqual([
        {
          fileName: 'test.rpy',
          content: `translate Japanese ch0_main_41e273ca:
    s "「おーはーよーーー！」"

translate Japanese strings:
    old "Sayori"
    new "サヨリ"
`,
        },
        {
          fileName: 'CAN YOU HEAR ME.txt',
          content: TestResource.fileContent.translate,
        },
      ]);
    });
  });
});
