import ScriptProperties from './scriptProperties';

type Sheet = GoogleAppsScript.Spreadsheet.Sheet;
/** シートの設定関数 */
type SheetModifier = (sheet: Sheet) => void;
/** スクリプトのプロパティに依存する設定関数 */
type SheetModifierFactory = (properties: ScriptProperties) => SheetModifier;

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
  sheet.setColumnWidth(6, 70);
  sheet.setColumnWidth(7, 260);
};

/**
 * シートの保護を再設定します。
 * @param sheet 翻訳シート
 */
const fixProtect: SheetModifier = (() => {
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
 * シートにタグによる条件付き書式を設定します。
 * @param properties プロパティ
 */
const addDataValidation: SheetModifierFactory = (properties: ScriptProperties): SheetModifier => {
  const dataValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(properties.tags.map(t => t.name), true)
    .build();

  return (sheet: Sheet): void => {
    sheet.getDataRange().clearDataValidations();
    sheet.getRange('F2:F').setDataValidation(dataValidation);
  };
};

/**
 * シートの条件付き書式を削除します。
 * @param sheet 翻訳シート
 */
const clearFormatRules: SheetModifier = (sheet: Sheet): void => sheet.clearConditionalFormatRules();

/**
 * シートにタグによる条件付き書式を設定します。
 * @param properties プロパティ
 */
const addTagsFormatRules: SheetModifierFactory = (properties: ScriptProperties): SheetModifier => {
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
const addEmptyFormatRules: SheetModifier = ((): SheetModifier => {
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
 * シートを操作する関数を合成して 1 つの関数にします。
 * @param modifiers 合成対象の関数
 */
function modifierCompose(...modifiers: SheetModifier[]): SheetModifier {
  return (sheet: Sheet) => modifiers.forEach(m => m(sheet));
}

/**
 * 翻訳シートの再設定用の関数を生成します。
 * @param properties スクリプトのプロパティを渡します。
 */
export const initTranslateSheetModifier = (properties: ScriptProperties): SheetModifier =>
  modifierCompose(
    deleteColumns,
    fixFormat,
    fixProtect,
    addDataValidation(properties),
    clearFormatRules,
    addTagsFormatRules(properties),
    addEmptyFormatRules,
  );
