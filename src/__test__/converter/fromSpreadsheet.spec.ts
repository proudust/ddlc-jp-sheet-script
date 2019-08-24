import { FromSpreadsheet } from '../../converter/fromSpreadsheet';
import { nointeractSay, longSay, file } from '../testResource';

type SpreedSheetRow = [string, string, string, string, ...string[]];

describe(`class FromSpreadsheet`, () => {
  describe(`FromSpreadsheet#convert`, () => {
    it('do', () => {
      const sheet: SpreedSheetRow[] = [
        ['', 'strings', 'Sayori', 'サヨリ'],
        ['ch0_main_41e273ca', 's', 'Heeeeeeeyyy!!', '「おーはーよーーー！」'],
        ['ch0_main_41e273ca_1', 's', 'Heeeeeeeyyy!!', '「おーはーよーーー！」'],
        [
          'ch3_end_sayori_dd9616f1',
          'm nointeract',
          nointeractSay.original,
          nointeractSay.translate,
        ],
        ['ch0_main_cb634d94', '', longSay.original, longSay.translate],
        ['CAN YOU HEAR ME.txt', 'file', file.original, file.translate],
      ];
      expect(FromSpreadsheet.convert(sheet)).toMatchObject([
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
