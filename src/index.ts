import { OutputFolder } from './appscript/outputFolder';
import { ScriptProperties } from './appscript/scriptProperties';
import { initStatisticsSheetModifier, initTranslateSheetModifier } from './appscript/sheetModifier';
import { fromSpreadsheet } from './converter/fromSpreadsheet';
import { fromRenpyScript } from './converter/fromRenpyScript';
import { margeTranslate } from './converter/margeTranslate';
import { toSpreadsheet } from './converter/toSpreadsheet';
import { toTranslationFile } from './converter/toTranslationFile';
import { Timer } from './util/timer';

type SpreadsheetRow = [string, string, string, string];
type OldSpreadsheetRow = [string, string, string, string, string];

declare let global: { [key: string]: Function };

global.onOpen = () => {
  SpreadsheetApp.getActiveSpreadsheet().addMenu('スクリプト', [
    { name: 'スクリプトからシートを作成', functionName: 'showUploder' },
    { name: 'スプレッドシートの書式再設定', functionName: 'fixSpreadsheet' },
    { name: '翻訳ファイルの出力', functionName: 'genelateTranslationFile' },
  ]);
};

global.showUploder = () => {
  const html = HtmlService.createHtmlOutputFromFile('uploder.html')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setWidth(400)
    .setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(html, 'スクリプトからシートを作成');
};

global.genelateSheet = (fileName: string, script: string) => {
  const spreadsheet = SpreadsheetApp.getActive();
  const properties = new ScriptProperties();
  const modifier = initTranslateSheetModifier(properties);

  const fromScript = fromRenpyScript(script);
  const fromSheet = (() => {
    const sheet = spreadsheet.getSheetByName(fileName);
    const values = sheet && (sheet.getDataRange().getValues() as SpreadsheetRow[]);
    return sheet && fromSpreadsheet(values);
  })();
  const values = (() => {
    const marge = margeTranslate(fromSheet, fromScript);
    return toSpreadsheet(marge);
  })();

  const sheet = spreadsheet.insertSheet();
  const rowsCountDiff = values.length - sheet.getMaxRows() - 2;
  if (0 < rowsCountDiff) sheet.insertRows(3, rowsCountDiff);
  else if (rowsCountDiff < 0) sheet.deleteRows(3, -rowsCountDiff);
  sheet.getRange(3, 1, values.length, 7).setValues(values);
  modifier(sheet);
};

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

global.genelateTranslationFile = () => {
  const properties = new ScriptProperties();
  const timer = new Timer();
  const outputFolder = new OutputFolder(properties.folderName, new Date());
  SpreadsheetApp.getActive()
    .getSheets()
    .slice(1)
    .reduce<OutputFolder>((folder, curr) => {
      const name = curr.getName();
      const values = curr.getRange('A3:D').getValues() as SpreadsheetRow[];
      const translates = fromSpreadsheet(values);
      const files = toTranslationFile(name, translates);
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
