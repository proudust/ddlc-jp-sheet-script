import OutputFolder from './appscript/outputFolder';
import FromOldSpreadsheet from './converter/fromOldSpreadsheet';
import FromSpreadsheet from './converter/fromSpreadsheet';
import FromRenpyScript from './converter/fromRenpyScript';
import MargeTranslate from './converter/margeTranslate';
import ToTranslationFile from './converter/toTranslationFile';
import SheetModifier from './appscript/sheetModifier';
import ScriptProperties from './appscript/scriptProperties';
import Timer from './util/timer';
import UploderHtml from './uploder.html';

declare let global: { [key: string]: Function };

global.onOpen = () => {
  SpreadsheetApp.getActiveSpreadsheet().addMenu('スクリプト', [
    { name: 'スクリプトからシートを作成', functionName: 'showUploder' },
    { name: 'スプレッドシートの書式再設定', functionName: 'fixSpreadsheet' },
    { name: '翻訳ファイルの出力', functionName: 'genelateTranslationFileNew' },
    { name: '翻訳ファイルの出力(旧)', functionName: 'genelateTranslationFileOld' },
  ]);
};

global.showUploder = () => {
  const html = HtmlService.createHtmlOutput(UploderHtml)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setWidth(400)
    .setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(html, 'スクリプトからシートを作成');
};

global.genelateSheet = (fileName: string, script: string) => {
  const spreadsheet = SpreadsheetApp.getActive();
  const properties = new ScriptProperties();
  const modifier = new SheetModifier(properties);

  const fromScript = FromRenpyScript.convert(script);
  const fromSheet = (() => {
    const sheet = spreadsheet.getSheetByName(fileName);
    return sheet && FromSpreadsheet.convert(sheet.getDataRange().getValues());
  })();
  const values = MargeTranslate.marge(fromSheet, fromScript).map(t => [
    t.id,
    t.attribute,
    t.original,
    t.translate,
  ]);

  const sheet = spreadsheet.insertSheet();
  const rowsCountDiff = values.length - sheet.getMaxRows() - 2;
  if (0 < rowsCountDiff) sheet.insertRows(3, rowsCountDiff);
  else if (rowsCountDiff < 0) sheet.deleteRows(3, -rowsCountDiff);
  sheet.getRange(3, 1, values.length, 4).setValues(values);
  modifier.apply(sheet);
};

global.fixSpreadsheet = () => {
  const properties = new ScriptProperties();
  const modifier = new SheetModifier(properties);

  SpreadsheetApp.getActive()
    .getSheets()
    .slice(1)
    .forEach(s => modifier.apply(s));
};

global.genelateTranslationFileNew = () => {
  const properties = new ScriptProperties();
  const timer = new Timer();
  const outputFolder = new OutputFolder(properties.folderName, new Date());
  SpreadsheetApp.getActive()
    .getSheets()
    .slice(1)
    .reduce<OutputFolder>((folder, curr) => {
      const name = curr.getName();
      const translates = FromSpreadsheet.convert(curr.getRange('A3:D').getValues());
      const files = ToTranslationFile.convert(name, translates);
      folder.files.push(...files);
      return folder;
    }, outputFolder)
    .save();
  const time = timer.toString();
  const msg = `あなたのGoogle Driveのマイドライブ/${outputFolder.name}に保存されました。処理時間: ${time}秒`;
  Browser.msgBox(msg);
  // eslint-disable-next-line no-undef
  console.log(`処理時間: ${time}秒`);
};

global.genelateTranslationFileOld = () => {
  const timer = new Timer();
  const outputFolder = new OutputFolder('DDLC_JP', new Date());
  SpreadsheetApp.getActive()
    .getSheets()
    .slice(1)
    .reduce<OutputFolder>((folder, curr) => {
      const name = curr.getName();
      const translates = FromOldSpreadsheet.convert(curr.getRange('A3:C').getValues());
      const files = ToTranslationFile.convert(name, translates);
      folder.files.push(...files);
      return folder;
    }, outputFolder)
    .save();
  const time = timer.toString();
  const msg = `あなたのGoogle Driveのマイドライブ/${outputFolder.name}に保存されました。処理時間: ${time}秒`;
  Browser.msgBox(msg);
  // eslint-disable-next-line no-undef
  console.log(`処理時間: ${time}秒`);
};
