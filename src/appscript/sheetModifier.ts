import ScriptProperties from './scriptProperties';

type Sheet = GoogleAppsScript.Spreadsheet.Sheet;
/** シートの設定関数 */
type Modifier = (sheet: Sheet) => void;
/** スクリプトのプロパティに依存する設定関数 */
type ModifierFactory = (properties: ScriptProperties) => Modifier;

/**
 * シートから余計な列を削除します。
 */
const deleteColumns = (sheet: Sheet): void => {
  const lastColumn = sheet.getMaxColumns();
  if (7 < lastColumn) {
    sheet.deleteColumns(8, lastColumn - 7);
  }
};

/**
 * シートの書式を再設定します。
 */
const fixFormat = (sheet: Sheet): void => {
  sheet
    .getRange(1, 1, 2, 7)
    .setValues([
      ['ID', '属性', '原文', '翻訳', '機械翻訳', 'タグ', 'コメント'],
      ['', '', '', '', '', '', ''],
    ])
    .setBackground('#CFE2F3');

  const lastRow = sheet.getMaxRows();
  const valueRows = lastRow - 3;
  sheet.getRange(3, 1, valueRows, 3).setBackground('#CCCCCC');
  sheet.getRange(3, 4, valueRows, 4).setBackground(null as any);
  sheet.getRange(3, 1, valueRows, 2).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  sheet.getRange(3, 3, valueRows, 5).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

  sheet
    .getRange(lastRow, 1, 1, 7)
    .setValues([['', '', '', '', '', '', '']])
    .setBackground('#CFE2F3');

  sheet.setColumnWidths(1, 2, 40);
  sheet.setColumnWidths(3, 3, 260);
  sheet.setColumnWidth(6, 40);
  sheet.setColumnWidth(7, 260);
};

/**
 * シートの保護を再設定します。
 * @param sheet 翻訳シート
 */
const fixProtect: Modifier = (() => {
  const owner = SpreadsheetApp.getActive().getOwner();
  return (sheet: Sheet): void => {
    const protect = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET)[0] || sheet.protect();
    protect
      .addEditor(owner)
      .removeEditors(protect.getEditors() as any)
      .setUnprotectedRanges([sheet.getRange('D2:G')]);
  };
})();

/**
 * シートの条件付き書式を削除します。
 * @param sheet 翻訳シート
 */
const clearFormatRules: Modifier = (sheet: Sheet): void => sheet.clearConditionalFormatRules();

/**
 * シートにタグによる条件付き書式を設定します。
 * @param properties プロパティ
 */
const addTagsFormatRules: ModifierFactory = (properties: ScriptProperties): Modifier => {
  const builders = properties.tags
    .filter(t => t.color)
    .map(t => {
      const builder = SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=$F2="${t.name}"`)
        .setBackground(t.color);
      return (r: GoogleAppsScript.Spreadsheet.Range) =>
        builder
          .copy()
          .setRanges([r])
          .build();
    });

  return (sheet: Sheet): void => {
    const formats = builders.map(f => f(sheet.getRange('D2:G')));
    sheet.setConditionalFormatRules([...sheet.getConditionalFormatRules(), ...formats]);
  };
};

/**
 * シートに翻訳欄が空の場合の条件付き書式を設定します。
 * @param properties プロパティ
 */
const addEmptyFormatRules: Modifier = ((): Modifier => {
  const builder = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied(`=AND(OR(ISTEXT($A2),ISTEXT($B2)),ISTEXT($C2),$D2="")`)
    .setBackground('#ffff00');

  return (sheet: Sheet): void => {
    const format = builder
      .copy()
      .setRanges([sheet.getRange('D2:D')])
      .build();
    sheet.setConditionalFormatRules([...sheet.getConditionalFormatRules(), format]);
  };
})();

/**
 * シートに関数を一括適用します。
 */
export default class SheetModifier {
  private readonly modifiers: Modifier[];

  /**
   * シートの設定関数を初期化します。
   * @param properties スクリプトの設定
   */
  public constructor(properties: ScriptProperties) {
    this.modifiers = [
      deleteColumns,
      fixFormat,
      fixProtect,
      clearFormatRules,
      addTagsFormatRules(properties),
      addEmptyFormatRules,
    ];
  }

  /**
   * 引数のシートに設定を反映させます。
   * @param sheet
   */
  public apply(sheet: Sheet): void {
    this.modifiers.forEach(m => m(sheet));
  }
}
