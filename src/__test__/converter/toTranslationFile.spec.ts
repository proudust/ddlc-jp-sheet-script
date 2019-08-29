import { toTranslationFile } from '../../converter/toTranslationFile';
import { SayTranslate } from '../../transrate/sayTranslate';
import { FileTranslate } from '../../transrate/fileTranslate';
import { StringsTranslate } from '../../transrate/stringsTranslate';

import { characterSay, poemTitle, file } from '../testResource';

describe(`function toTranslationFile`, () => {
  it('do', () => {
    const sheet = [
      new StringsTranslate(poemTitle),
      new SayTranslate(characterSay),
      new SayTranslate({ ...characterSay, id: 'ch0_main_41e273ca_1' }),
      new FileTranslate(file),
    ];
    expect(toTranslationFile('test', sheet)).toStrictEqual([
      {
        fileName: 'test.rpy',
        content: `translate Japanese ch0_main_41e273ca:
    s "「おーはーよーーー！」"

translate Japanese ch0_main_41e273ca_1:
    s "「おーはーよーーー！」"

translate Japanese strings:
    old "Ghost Under the Light"
    new "燈の下の幽霊"
`,
      },
      {
        fileName: 'CAN YOU HEAR ME.txt',
        content: file.translate,
      },
    ]);
  });

  it('FileTranslate only', () => {
    const sheet = [new FileTranslate(file)];
    expect(toTranslationFile('test', sheet)).toStrictEqual([
      {
        fileName: 'CAN YOU HEAR ME.txt',
        content: file.translate,
      },
    ]);
  });
});
