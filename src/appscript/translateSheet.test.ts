import { TranslateSheetRow, TranslateSheet } from './translateSheet';

const values = [['ID', '属性', '原文', '翻訳', '機械翻訳', 'タグ', 'コメント']];

describe(`class TranslateSheetRow`, () => {
  describe(`new TranslateSheetRow`, () => {
    it('standard', () => {
      expect(new TranslateSheetRow(values[0], 'test-name', 3)).toMatchObject({
        id: 'ID',
        attribute: '属性',
        original: '原文',
        translate: '翻訳',
        tag: 'タグ',
        comments: 'コメント',
        location: {
          sheetName: 'test-name',
          rowNumber: 3,
        },
      });
    });

    it('empty', () => {
      expect(new TranslateSheetRow([], 'test-name', 3)).toMatchObject({
        id: '',
        attribute: '',
        original: '',
        translate: '',
        tag: '',
        comments: '',
        location: {
          sheetName: 'test-name',
          rowNumber: 3,
        },
      });
    });
  });
});

describe(`class TranslateSheet`, () => {
  describe(`TranslateSheet#getName`, () => {
    it('success', () => {
      const mock = { getName: () => 'test-name' };
      expect(new TranslateSheet(mock).getName()).toEqual('test-name');
    });

    it('invalid sheet name', () => {
      const mock = { getName: () => 'シート100' };
      expect(() => new TranslateSheet(mock)).toThrowError(/ is invalid sheet name.$/);
    });

    it('not implementation', () => {
      expect(() => new TranslateSheet({}).getName()).toThrowError('getName is not implementation.');
    });
  });

  describe(`TranslateSheet#getTranslateRows`, () => {
    it('success', () => {
      const mock = { getName: () => 'test-name', getRange: () => ({ getValues: () => values }) };
      expect(new TranslateSheet(mock).getTranslateRows()).toMatchObject([
        {
          id: 'ID',
          attribute: '属性',
          original: '原文',
          translate: '翻訳',
          tag: 'タグ',
          comments: 'コメント',
          location: {
            sheetName: 'test-name',
            rowNumber: 3,
          },
        },
      ]);
    });

    it('getName is not implementation', () => {
      const mock = { getRange: () => ({ getValues: () => values }) };
      expect(() => {
        new TranslateSheet(mock).getTranslateRows();
      }).toThrowError('getName is not implementation.');
    });

    it('getRange is not implementation', () => {
      const mock = { getName: () => 'test-name' };
      expect(() => {
        new TranslateSheet(mock).getTranslateRows();
      }).toThrowError('getRange is not implementation.');
    });
  });

  describe(`TranslateSheet#getName`, () => {
    it('success', () => {
      const mock = { getTabColor: () => '#ffffff' };
      expect(new TranslateSheet(mock).getTabColor()).toEqual('#ffffff');
    });

    it('not implementation', () => {
      expect(() => {
        new TranslateSheet({}).getTabColor();
      }).toThrowError('getTabColor is not implementation.');
    });
  });
});
