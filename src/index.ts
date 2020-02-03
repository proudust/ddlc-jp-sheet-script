import { OutputFolder } from './appscript/outputFolder';
import { ScriptProperties } from './appscript/scriptProperties';
import { TranslateSheet } from './appscript/translateSheet';
import { initStatisticsSheetModifier, initTranslateSheetModifier } from './appscript/sheetModifier';
import { fromSpreadsheet } from './converter/fromSpreadsheet';
import { TranslationFileConverter } from './converter/toTranslationFile';
import { checkDuplicateTranslate } from './check/checkDuplicateTranslate';
import { updatePullRequest } from './updatePullRequest';

declare let global: { [key: string]: Function };

/**
 * スプレッドシートを開いたときに実行される関数です。
 * スプレッドシートにメニューバーを追加します。
 */
global.onOpen = () => {
  SpreadsheetApp.getActiveSpreadsheet().addMenu('スクリプト', [
    { name: '重複した台詞を検索', functionName: 'searchDuplicate' },
    null,
    { name: 'シートの書式再設定（全体）', functionName: 'fixSpreadsheet' },
    { name: 'シートの書式再設定（アクティブのみ）', functionName: 'fixActiveSheet' },
    null,
    { name: '翻訳ファイルの出力 (Google Drive)', functionName: 'genelateTranslationFile' },
    { name: '翻訳ファイルの出力 (GitHub)', functionName: 'updatePullRequest' },
  ]);
};

/**
 * 同じ台詞の行の中から、異なる訳が当てられている行を検索します。
 */
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
 * 全てのシートのフォーマットを修正します。
 */
global.fixSpreadsheet = () => {
  const prop = new ScriptProperties();
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
  const prop = new ScriptProperties();

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

/**
 * GitHub のリポジトリに対し dispatches イベント (type: update_translate) を発火させます。
 * それをトリガーに GitHub Actions 側で翻訳スクリプトを生成します。
 */
global.updatePullRequest = updatePullRequest;

/**
 * スプレッドシートの翻訳シートから翻訳スクリプトを生成し、Zip 圧縮した Base64 文字列を返す。
 */
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
