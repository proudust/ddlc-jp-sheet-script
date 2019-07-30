import FromOldSpreadsheet from '../../converter/fromOldSpreadsheet';

describe(`class FromOldSpreadsheet`, () => {
  describe(`FromOldSpreadsheet#convert`, () => {
    it('do', () => {
      const sheet = [
        ['strings', 'Sayori', 'サヨリ'],
        ['ch0_main_41e273ca', 's "Heeeeeeeyyy!!"', 's "「おーはーよーーー！」"'],
        [
          'CAN YOU HEAR ME.txt',
          `"There's a little devil inside all of us."`,
          '"私たちの中には小さな悪魔がいる"',
        ],
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
          id: 'CAN YOU HEAR ME.txt',
          attribute: 'file',
          original: `"There's a little devil inside all of us."`,
          translate: '"私たちの中には小さな悪魔がいる"',
        },
      ]);
    });
  });
});
