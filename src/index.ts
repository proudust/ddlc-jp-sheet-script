import { OutputFolder } from './appscript/outputFolder';
import { ScriptProperties } from './appscript/scriptProperties';
import { TranslateSheet } from './appscript/translateSheet';
import { initStatisticsSheetModifier, initTranslateSheetModifier } from './appscript/sheetModifier';
import { fromSpreadsheet } from './converter/fromSpreadsheet';
import { fromRenpyScript } from './converter/fromRenpyScript';
import { margeTranslate } from './converter/margeTranslate';
import { toSpreadsheet } from './converter/toSpreadsheet';
import { TranslationFileConverter } from './converter/toTranslationFile';
import { checkDuplicateTranslate } from './check/checkDuplicateTranslate';

declare let global: { [key: string]: Function };

/**
 * スプレッドシートを開いたときに実行される関数です。
 * スプレッドシートにメニューバーを追加します。
 */
global.onOpen = () => {
  SpreadsheetApp.getActiveSpreadsheet().addMenu('スクリプト', [
    { name: '重複した台詞を検索', functionName: 'searchDuplicate' },
    null,
    { name: 'スクリプトからシートを作成', functionName: 'showUploder' },
    { name: 'スプレッドシートの書式再設定', functionName: 'fixSpreadsheet' },
    { name: '翻訳ファイルの出力', functionName: 'genelateTranslationFile' },
  ]);
};

global.searchDuplicate = () => {
  const prop = new ScriptProperties();
  const translates = SpreadsheetApp.getActive()
    .getSheets()
    .slice(1)
    .map(s => new TranslateSheet(s))
    .filter(s => (prop.notConvertColor ? prop.notConvertColor != s.getTabColor() : true))
    .map(s => fromSpreadsheet(s.getTranslateRows()))
    .reduce((array, curr) => array.concat(curr), []);
  const msg = checkDuplicateTranslate(translates)
    .map(
      p =>
        `${p.message}\n原文：${p.source[0].attribute} ${p.source[0].original}\\n` +
        p.source.map((s, i) => `翻訳${i}：${s.translate} ${s.tag}\\n`).join(''),
    )
    .join('\\n');
  Browser.msgBox(msg);
};

/**
 * スクリプトのアップローダーを表示します。
 */
global.showUploder = () => {
  const html = HtmlService.createHtmlOutputFromFile('uploder.html')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setWidth(400)
    .setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(html, 'スクリプトからシートを作成');
};

/**
 * スクリプトのファイル名と内容からシートを生成します。
 * @param fileName スクリプトのファイル名。 (拡張子なし)
 * @param script スクリプトの内容。
 */
global.genelateSheet = (fileName: string, script: string) => {
  const spreadsheet = SpreadsheetApp.getActive();
  const properties = new ScriptProperties();
  const modifier = initTranslateSheetModifier(properties);

  const fromScript = fromRenpyScript(script);
  if (!fromScript) throw Error(`translatable string not found in "${fileName}.rpy".`);
  const fromSheet = (() => {
    const sheet = spreadsheet.getSheetByName(fileName);
    const rows = sheet && new TranslateSheet(sheet).getTranslateRows();
    return rows && fromSpreadsheet(rows);
  })();
  const values = (() => {
    const marge = fromSheet && margeTranslate(fromSheet, fromScript);
    return toSpreadsheet(marge || fromScript);
  })();

  const sheet = spreadsheet.insertSheet();
  const rowsCountDiff = values.length - sheet.getMaxRows() - 2;
  if (0 < rowsCountDiff) sheet.insertRows(3, rowsCountDiff);
  else if (rowsCountDiff < 0) sheet.deleteRows(3, -rowsCountDiff);
  sheet.getRange(3, 1, values.length, 7).setValues(values);
  modifier(sheet);
};

/**
 * スプレッドシートのフォーマットを修正します。
 */
global.fixSpreadsheet = () => {
  const properties = new ScriptProperties();
  const statisticsModifier = initStatisticsSheetModifier();
  const translateModifier = initTranslateSheetModifier(properties);

  statisticsModifier(SpreadsheetApp.getActive().getSheets()[0]);

  SpreadsheetApp.getActive()
    .getSheets()
    .slice(1)
    .forEach(s => translateModifier(s));
};

/**
 * スプレッドシートの翻訳シートから翻訳スクリプトを生成し、ユーザーのドライブに保存します。
 */
global.genelateTranslationFile = () => {
  const prop = new ScriptProperties();
  const converter = new TranslationFileConverter();
  const outputFolder = new OutputFolder(prop.folderName, new Date());
  SpreadsheetApp.getActive()
    .getSheets()
    .slice(1)
    .map(s => new TranslateSheet(s))
    .filter(s => (prop.notConvertColor ? prop.notConvertColor != s.getTabColor() : true))
    .reduce<OutputFolder>((folder, curr) => {
      const name = curr.getName();
      const values = curr.getTranslateRows();
      const translates = fromSpreadsheet(values);
      const files = converter.toTranslationFile(name, translates);
      folder.files.push(...files);
      return folder;
    }, outputFolder)
    .save();
  const msg = `あなたのGoogle Driveのマイドライブ/${outputFolder.name}に保存されました。`;
  Browser.msgBox(msg);
};

global.doGet = () => {
  const zip = (() => {
    const prop = new ScriptProperties();
    const converter = new TranslationFileConverter();
    const outputFolder = new OutputFolder(prop.folderName, new Date());
    return SpreadsheetApp.getActive()
      .getSheets()
      .slice(1)
      .map(s => new TranslateSheet(s))
      .filter(s => (prop.notConvertColor ? prop.notConvertColor != s.getTabColor() : true))
      .reduce<OutputFolder>((folder, curr) => {
        const name = curr.getName();
        const values = curr.getTranslateRows();
        const translates = fromSpreadsheet(values);
        const files = converter.toTranslationFile(name, translates);
        folder.files.push(...files);
        return folder;
      }, outputFolder)
      .zip();
  })();
  return ContentService.createTextOutput()
    .setContent(Utilities.base64Encode(zip.getBytes()))
    .setMimeType(ContentService.MimeType.TEXT);
};
