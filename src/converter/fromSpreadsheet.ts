import { SayTranslate } from '../transrate/sayTranslate';
import { FileTranslate } from '../transrate/fileTranslate';
import { IgnoreTranslate } from '../transrate/ignoreTranslate';
import { StringsTranslate } from '../transrate/stringsTranslate';

type SpreadSheetTranslates = (SayTranslate | FileTranslate | IgnoreTranslate | StringsTranslate)[];

interface TranslateSheetRow {
  id: string;
  attribute: string;
  original: string;
  translate: string;
  tag?: string;
  comments?: string;
}

const tryParseIgnore = (row: TranslateSheetRow): IgnoreTranslate | null =>
  !(row.id != '' || row.attribute != '') ? new IgnoreTranslate(row) : null;

const tryParseStrings = (row: TranslateSheetRow): StringsTranslate | null =>
  row.attribute === 'strings' ? new StringsTranslate(row) : null;

const tryParseDialogs = (row: TranslateSheetRow): SayTranslate | null =>
  /[\S]+_[\da-f]{8}/.test(row.id) ? new SayTranslate(row) : null;

const tryParseFiles = (row: TranslateSheetRow): FileTranslate | null =>
  /.txt$/.test(row.id) ? new FileTranslate(row) : null;

/**
 * スプレッドシートから Translate 配列を生成します。
 * @param スプレッドシートのデータ (x: 4, y: n)
 */
export function fromSpreadsheet(s: TranslateSheetRow[]): SpreadSheetTranslates {
  return s
    .map(r => tryParseIgnore(r) || tryParseStrings(r) || tryParseDialogs(r) || tryParseFiles(r))
    .filter(<T>(x: T | null): x is T => !!x);
}
