import ToCsv from '../../converter/toCsv';
import DialogsTranslate from '../../transrate/dialogsTranslate';
import FileTranslate from '../../transrate/fileTranslate';
import StringsTranslate from '../../transrate/stringsTranslate';
import { file } from '../testResource';

describe(`class ToCsv`, () => {
  describe(`ToCsv#convert`, () => {
    it('do', () => {
      const sheet = [
        new StringsTranslate('Sayori', 'サヨリ'),
        new DialogsTranslate('ch0_main_41e273ca', 's', 'Heeeeeeeyyy!!', '「おーはーよーーー！」'),
        new DialogsTranslate('ch0_main_41e273ca_1', 's', 'Heeeeeeeyyy!!', '「おーはーよーーー！」'),
        new FileTranslate('CAN YOU HEAR ME.txt', file.original, file.translate),
      ];
      expect(ToCsv.convert(sheet)).toBe(`"", "strings", "Sayori", "サヨリ"
"ch0_main_41e273ca", "s", "Heeeeeeeyyy!!", "「おーはーよーーー！」"
"ch0_main_41e273ca_1", "s", "Heeeeeeeyyy!!", "「おーはーよーーー！」"
"CAN YOU HEAR ME.txt", "file", "${file.original}", "${file.translate}"
`);
    });
  });
});
