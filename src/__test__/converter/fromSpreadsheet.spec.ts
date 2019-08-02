import FromSpreadsheet from '../../converter/fromSpreadsheet';
import TestResource from '../testResource';

describe(`class FromSpreadsheet`, () => {
  describe(`FromSpreadsheet#convert`, () => {
    it('do', () => {
      const sheet = [
        ['', 'strings', 'Sayori', 'サヨリ'],
        ['ch0_main_41e273ca', 's', 'Heeeeeeeyyy!!', '「おーはーよーーー！」'],
        [
          'ch3_end_sayori_dd9616f1',
          'm nointeract',
          TestResource.nointeractDialog.orifinal,
          TestResource.nointeractDialog.translate,
        ],
        [
          'ch0_main_cb634d94',
          '',
          TestResource.longDialog.orifinal,
          TestResource.longDialog.translate,
        ],
        [
          'CAN YOU HEAR ME.txt',
          'file',
          TestResource.fileContent.orifinal,
          TestResource.fileContent.translate,
        ],
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
          id: 'ch3_end_sayori_dd9616f1',
          attribute: 'm nointeract',
          original: TestResource.nointeractDialog.orifinal,
          translate: TestResource.nointeractDialog.translate,
        },
        {
          id: 'ch0_main_cb634d94',
          attribute: '',
          original: TestResource.longDialog.orifinal,
          translate: TestResource.longDialog.translate,
        },
        {
          id: 'CAN YOU HEAR ME.txt',
          attribute: 'file',
          original: TestResource.fileContent.orifinal,
          translate: TestResource.fileContent.translate,
        },
      ]);
    });
  });
});
