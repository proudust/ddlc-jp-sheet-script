import { ScriptProperties } from './scriptProperties';

type Sheet = GoogleAppsScript.Spreadsheet.Sheet;
/** シートの設定関数 */
type SheetModifier = (sheet: Sheet) => void;
/** スクリプトのプロパティに依存する設定関数 */
type SheetModifierFactory = (properties: ScriptProperties) => SheetModifier;

/**
 * "statistics" と名前のついた名前付き範囲を取得する。
 * @param sheet 対象のシート （統計シート）
 * @returns 対象の名前付き範囲があった場合その Range オブジェクト、ない場合は null 。
 */
function getStatisticsRange(sheet: Sheet): GoogleAppsScript.Spreadsheet.Range | null {
  const [namedRange = null] = sheet.getNamedRanges().filter(r => r.getName() === 'statistics');
  return namedRange && namedRange.getRange();
}

/**
 * 翻訳シートが追加されている場合、統計情報のシート名を修正する。
 */
const updateStatistics: SheetModifier = (sheet: Sheet): void => {
  const statisticsRange = getStatisticsRange(sheet);
  if (!statisticsRange) {
    console.warn('statistics NamedRange is not found');
    return;
  }

  const sheetNames = SpreadsheetApp.getActive()
    .getSheets()
    .slice(1)
    .map(s => s.getName());
  const nowRangeNumRows = statisticsRange.getNumRows() - 2;
  if (sheetNames.length != nowRangeNumRows) {
    const rowPosition = statisticsRange.getRowIndex() + 1;
    if (sheetNames.length > nowRangeNumRows) {
      sheet.insertRowsAfter(rowPosition, sheetNames.length - nowRangeNumRows);
    } else if (sheetNames.length < nowRangeNumRows) {
      sheet.deleteRows(rowPosition, nowRangeNumRows - sheetNames.length);
    }

    const sheetDescriptions = statisticsRange
      .getValues()
      .reduce<{ [key: string]: string }>((d, v) => (d[v[0]] = v[1]), {});
    const newValues = sheetNames.map(n => [n, sheetDescriptions[n]]);
    sheet
      .getRange(rowPosition, statisticsRange.getColumn(), sheetNames.length, 2)
      .setValues(newValues);
  }
};

/**
 * "statistics" と名前のついた名前付き範囲に、統計用の数式を再設定します。
 */
const setStatisticsFormulas: SheetModifier = (sheet: Sheet): void => {
  const statisticsRange = getStatisticsRange(sheet);
  if (!statisticsRange) {
    console.warn('statistics NamedRange is not found');
    return;
  }

  const sheets: [string, string][] = statisticsRange
    .getValues()
    .map<[string, string]>(a => [a[0], a[1]])
    .filter(f => f)
    .slice(1, -1);
  const headerIndex = statisticsRange.getRowIndex();
  const footerIndex = headerIndex + sheets.length + 1;
  const header = [
    '',
    '使用場面',
    '翻訳済み',
    '翻訳箇所',
    '翻訳率',
    '要変更',
    'バグ',
    '提案',
    '重複',
  ];
  const formulas = sheets.map((sheet, index) => {
    const [sheetName = '', sheetDescription = ''] = sheet;
    const sheetId = (() => {
      const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
      return (sheet && sheet.getSheetId()) || null;
    })();
    const thisRowIndex = headerIndex + 1 + index;
    return [
      (sheetId && `=HYPERLINK("#gid=${sheetId}","${sheetName}")`) || sheetName,
      sheetDescription,
      `=COUNTA('${sheetName}'!$D$2:$D)`,
      `=COUNTA('${sheetName}'!$C$2:$C)`,
      `=IF($E${thisRowIndex}<>0,$D${thisRowIndex}/$E${thisRowIndex},0)`,
      `=COUNTIF('${sheetName}'!$F$2:$F, G$${headerIndex})`,
      `=COUNTIF('${sheetName}'!$F$2:$F, H$${headerIndex})`,
      `=COUNTIF('${sheetName}'!$F$2:$F, I$${headerIndex})`,
      `=COUNTIF('${sheetName}'!$F$2:$F, J$${headerIndex})`,
    ];
  });
  const footer = [
    '合計',
    '',
    `=SUM(D$${headerIndex + 1}:D$${footerIndex - 1})`,
    `=SUM(E$${headerIndex + 1}:E$${footerIndex - 1})`,
    `=IF($E${footerIndex}<>0,$D${footerIndex}/$E${footerIndex},0)`,
    `=SUM(G$${headerIndex + 1}:G$${footerIndex - 1})`,
    `=SUM(H$${headerIndex + 1}:H$${footerIndex - 1})`,
    `=SUM(I$${headerIndex + 1}:I$${footerIndex - 1})`,
    `=SUM(J$${headerIndex + 1}:J$${footerIndex - 1})`,
  ];

  statisticsRange.setValues([header, ...formulas, footer]);
};

/**
 * "statistics" と名前のついた名前付き範囲に、統計用の書式を再設定します。
 */
const fixStatisticsFormat = (sheet: Sheet): void => {
  const statisticsRange = getStatisticsRange(sheet);
  if (!statisticsRange) {
    console.warn('statistics NamedRange is not found');
    return;
  }

  statisticsRange.setBackground('#CCCCCC');

  const statisticsRowIndex = statisticsRange.getRowIndex() + 1;
  const numStatisticsRows = statisticsRange.getNumRows() - 1;
  const statisticsColumnIndex = statisticsRange.getColumn() + 2;
  sheet
    .getRange(statisticsRowIndex, statisticsColumnIndex, numStatisticsRows, 3)
    .setBackground('#CFE2F3');
  sheet
    .getRange(statisticsRowIndex, statisticsColumnIndex + 3, numStatisticsRows, 1)
    .setBackground('#FFF2CC');
  sheet
    .getRange(statisticsRowIndex, statisticsColumnIndex + 4, numStatisticsRows, 1)
    .setBackground('#FCE5CD');
  sheet
    .getRange(statisticsRowIndex, statisticsColumnIndex + 5, numStatisticsRows, 1)
    .setBackground('#D9EAD3');
  sheet
    .getRange(statisticsRowIndex, statisticsColumnIndex + 6, numStatisticsRows, 1)
    .setBackground('#EFEFEF');
};

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
  sheet.getRange(3, 4, valueRows, 4).setBackground(null);
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
  if (!owner) throw Error('owner is null.');
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
export const initStatisticsSheetModifier = (): SheetModifier =>
  modifierCompose(updateStatistics, setStatisticsFormulas, fixStatisticsFormat);

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
