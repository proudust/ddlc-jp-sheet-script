import { getDayFormat } from './util';

export class SheetService {
  public static createInitialFile(prefix: string): GoogleAppsScript.Spreadsheet.Spreadsheet {
    const fileName = `${prefix} ${getDayFormat()}`;
    const ss = SpreadsheetApp.create(fileName);
    const range = ss.getRange('A1');
    range.setValue('Hello, clasp!');
    return ss;
  }
}
