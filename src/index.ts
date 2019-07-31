import OutputFolder from './appscript/outputFolder';
import FromOldSpreadsheet from './converter/fromOldSpreadsheet';
import ToTranslationFile from './converter/toTranslationFile';
import ToCsv from './converter/toCsv';
import Timer from './util/timer';

declare var global: { [key: string]: Function };

global.onOpen = () => {
  SpreadsheetApp.getActiveSpreadsheet().addMenu('スクリプト', [
    { name: '翻訳ファイルの出力', functionName: 'genelateTranslationFileOld' },
    { name: '翻訳 CSV の出力', functionName: 'genelateCsvOld' },
  ]);
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

global.genelateCsvOld = () => {
  const timer = new Timer();
  const outputFolder = new OutputFolder('DDLC_JP_CSV', new Date());
  SpreadsheetApp.getActive()
    .getSheets()
    .slice(1)
    .reduce<OutputFolder>((folder, curr) => {
      const translates = FromOldSpreadsheet.convert(curr.getRange('A3:C').getValues());
      folder.files.push({
        fileName: curr.getName() + '.csv',
        content: ToCsv.convert(translates),
      });
      return folder;
    }, outputFolder)
    .save();
  const time = timer.toString();
  const msg = `あなたのGoogle Driveのマイドライブ/${outputFolder.name}に保存されました。処理時間: ${time}秒`;
  Browser.msgBox(msg);
  // eslint-disable-next-line no-undef
  console.log(`処理時間: ${time}秒`);
};
