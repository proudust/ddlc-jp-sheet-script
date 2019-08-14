import ScriptProperties from './scriptProperties';

type Sheet = GoogleAppsScript.Spreadsheet.Sheet;
/** シートの設定関数 */
type Modifier = (sheet: Sheet) => void;
/** スクリプトのプロパティに依存する設定関数 */
type ModifierFactory = (properties: ScriptProperties) => Modifier;

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
