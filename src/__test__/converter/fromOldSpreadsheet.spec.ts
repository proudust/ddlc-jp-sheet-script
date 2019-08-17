import FromOldSpreadsheet from '../../converter/fromOldSpreadsheet';
import { nointeractSay, longSay, file } from '../testResource';

describe(`class FromOldSpreadsheet`, () => {
  describe(`FromOldSpreadsheet#convert`, () => {
    it('do', () => {
      const sheet = [
        ['strings', 'Sayori', 'サヨリ'],
        ['ch0_main_41e273ca', 's "Heeeeeeeyyy!!"', 's "「おーはーよーーー！」"'],
        ['ch0_main_41e273ca_1', 's "Heeeeeeeyyy!!"', 's "「おーはーよーーー！」"'],
        [
          'ch3_end_sayori_dd9616f1',
          `m "${nointeractSay.original}" nointeract`,
          `m "${nointeractSay.translate}" nointeract`,
        ],
        ['ch0_main_cb634d94', longSay.original, longSay.translate],
        ['CAN YOU HEAR ME.txt', file.original, file.translate],
      ];
      expect(FromOldSpreadsheet.convert(sheet)).toMatchObject([
        { id: '', attribute: 'strings', original: 'Sayori', translate: 'サヨリ' },
        {
          id: 'ch0_main_41e273ca',
          attribute: 's',
          original: 'Heeeeeeeyyy!!',
          translate: '「おーはーよーーー！」',
        },
        {
          id: 'ch0_main_41e273ca_1',
          attribute: 's',
          original: 'Heeeeeeeyyy!!',
          translate: '「おーはーよーーー！」',
        },
        {
          id: 'ch3_end_sayori_dd9616f1',
          attribute: 'm nointeract',
          original: nointeractSay.original,
          translate: nointeractSay.translate,
        },
        {
          id: 'ch0_main_cb634d94',
          attribute: '',
          original: longSay.original,
          translate: longSay.translate,
        },
        {
          id: 'CAN YOU HEAR ME.txt',
          attribute: 'file',
          original: file.original,
          translate: file.translate,
        },
      ]);
    });
  });
});
