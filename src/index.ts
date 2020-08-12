import { OutputFolder } from './appscript/outputFolder';
import { getScriptProperties } from './appscript/scriptProperties';
import { initStatisticsSheetModifier, initTranslateSheetModifier } from './appscript/sheetModifier';
import { generateCode } from './generator/generator';
import { generateCode as generateJson } from './generator/json';
import * as RenPyCheck from './check/renpy-check';
import * as RpgMvCheck from './check/rpgmv-check';
import { updatePullRequest } from './updatePullRequest';

type WebAppsOutput = GoogleAppsScript.HTML.HtmlOutput | GoogleAppsScript.Content.TextOutput;
declare let global: {
  doGet: (e?: GoogleAppsScript.Events.DoGet) => WebAppsOutput;
  doPost: (e?: GoogleAppsScript.Events.DoPost) => WebAppsOutput;
  [key: string]: () => void;
};

/**
 * スプレッドシートを開いたときに実行される関数です。
 * スプレッドシートにメニューバーを追加します。
 */
global.onOpen = () => {
  SpreadsheetApp.getActiveSpreadsheet().addMenu('スクリプト', [
    { name: '翻訳のチェック', functionName: 'checkTranslates' },
    null,
    { name: 'シートの書式再設定（全体）', functionName: 'fixSpreadsheet' },
    { name: 'シートの書式再設定（アクティブのみ）', functionName: 'fixActiveSheet' },
    null,
    { name: '翻訳ファイルの出力 (Google Drive)', functionName: 'genelateTranslationFile' },
    { name: '翻訳ファイルの出力 (GitHub)', functionName: 'updatePullRequest' },
  ]);
};

/**
 * ID や属性、翻訳のチェックを行います。
 */
global.checkTranslates = () => {
  const { notConvertColor, checkMode } = getScriptProperties();
  const checkAll = checkMode === "Ren'Py" ? RenPyCheck.checkAll : RpgMvCheck.checkAll;
  const sheets = SpreadsheetApp.getActive()
    .getSheets()
    .slice(1)
    .filter(s => (notConvertColor ? notConvertColor != s.getTabColor() : true));
  const msg = checkAll(sheets).replace(/\n/g, '\\n');
  Browser.msgBox(msg);
};

/**
 * 全てのシートのフォーマットを修正します。
 */
global.fixSpreadsheet = () => {
  const prop = getScriptProperties();
  const statisticsModifier = initStatisticsSheetModifier();
  const translateModifier = initTranslateSheetModifier(prop);

  const activeSpreadsheet = SpreadsheetApp.getActive();
  statisticsModifier(activeSpreadsheet.getSheets()[0]);

  activeSpreadsheet
    .getSheets()
    .filter(s => (prop.notConvertColor ? prop.notConvertColor != s.getTabColor() : true))
    .forEach(s => translateModifier(s));
};

/**
 * アクティブなシートのフォーマットを修正します。
 */
global.fixActiveSheet = () => {
  const prop = getScriptProperties();

  const activeSheet = SpreadsheetApp.getActive().getActiveSheet();
  const modifier = (() => {
    if (activeSheet.getIndex() === 1) return initStatisticsSheetModifier();
    else return initTranslateSheetModifier(prop);
  })();
  modifier(activeSheet);
};

/**
 * スプレッドシートの翻訳シートから翻訳スクリプトを生成し、ユーザーのドライブに保存します。
 */
global.genelateTranslationFile = () => {
  const { folderName, notConvertColor, exportMode } = getScriptProperties();
  const sheets = SpreadsheetApp.getActive()
    .getSheets()
    .slice(1)
    .filter(s => (notConvertColor ? notConvertColor != s.getTabColor() : true));
  const outputFolder = new OutputFolder(folderName, new Date());
  if (exportMode.startsWith("Ren'Py")) {
    outputFolder.files.push(...generateCode(sheets, exportMode === "Ren'Py with history support"));
  } else {
    outputFolder.files.push(...generateJson(sheets));
  }
  outputFolder.save();
  const msg = `あなたのGoogle Driveのマイドライブ/${outputFolder.name}に保存されました。`;
  Browser.msgBox(msg);
};

/**
 * GitHub のリポジトリに対し dispatches イベント (type: update_translate) を発火させます。
 * それをトリガーに GitHub Actions 側で翻訳スクリプトを生成します。
 */
global.updatePullRequest = () => updatePullRequest(getScriptProperties());

/**
 * スプレッドシートの翻訳シートから翻訳スクリプトを生成し、Zip 圧縮した Base64 文字列を返す。
 */
global.doGet = () => {
  const { folderName, notConvertColor, exportMode } = getScriptProperties();
  const sheets = SpreadsheetApp.getActive()
    .getSheets()
    .slice(1)
    .filter(s => (notConvertColor ? notConvertColor != s.getTabColor() : true));
  const outputFolder = new OutputFolder(folderName, new Date());
  if (exportMode.startsWith("Ren'Py")) {
    outputFolder.files.push(...generateCode(sheets, exportMode === "Ren'Py with history support"));
  } else {
    outputFolder.files.push(...generateJson(sheets));
  }
  const zip = outputFolder.zip();
  return ContentService.createTextOutput()
    .setContent(Utilities.base64Encode(zip.getBytes()))
    .setMimeType(ContentService.MimeType.TEXT);
};
