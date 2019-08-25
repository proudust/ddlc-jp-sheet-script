import { toTranslationFile } from '../../converter/toTranslationFile';
import { SayTranslate } from '../../transrate/sayTranslate';
import { FileTranslate } from '../../transrate/fileTranslate';
import { StringsTranslate } from '../../transrate/stringsTranslate';

import { file } from '../testResource';

describe(`function toTranslationFile`, () => {
  it('do', () => {
    const sheet = [
      new StringsTranslate('Sayori', 'サヨリ'),
      new SayTranslate('ch0_main_41e273ca', 's', 'Heeeeeeeyyy!!', '「おーはーよーーー！」'),
      new SayTranslate('ch0_main_41e273ca_1', 's', 'Heeeeeeeyyy!!', '「おーはーよーーー！」'),
      new FileTranslate('CAN YOU HEAR ME.txt', file.original, file.translate),
    ];
    expect(toTranslationFile('test', sheet)).toStrictEqual([
      {
        fileName: 'test.rpy',
        content: `translate Japanese ch0_main_41e273ca:
    s "「おーはーよーーー！」"

translate Japanese ch0_main_41e273ca_1:
    s "「おーはーよーーー！」"

translate Japanese strings:
    old "Sayori"
    new "サヨリ"
`,
      },
      {
        fileName: 'CAN YOU HEAR ME.txt',
        content: file.translate,
      },
    ]);
  });

  it('FileTranslate only', () => {
    const sheet = [new FileTranslate('CAN YOU HEAR ME.txt', file.original, file.translate)];
    expect(toTranslationFile('test', sheet)).toStrictEqual([
      {
        fileName: 'CAN YOU HEAR ME.txt',
        content: file.translate,
      },
    ]);
  });
});
