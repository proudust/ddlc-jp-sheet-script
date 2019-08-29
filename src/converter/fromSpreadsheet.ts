import { SayTranslate } from '../transrate/sayTranslate';
import { FileTranslate } from '../transrate/fileTranslate';
import { IgnoreTranslate } from '../transrate/ignoreTranslate';
import { StringsTranslate } from '../transrate/stringsTranslate';

type SpreedSheetRow = [string, string, string, string, ...string[]];
type SpreadSheetTranslates = (SayTranslate | FileTranslate | IgnoreTranslate | StringsTranslate)[];

const tryParseIgnore = (row: SpreedSheetRow): IgnoreTranslate | null => {
  if (row[0] != '' || row[1] != '') return null;
  return new IgnoreTranslate({
    original: row[2],
    translate: row[3],
    tag: row[5],
    comments: row[6],
  });
};

const tryParseStrings = (row: SpreedSheetRow): StringsTranslate | null =>
  (row[1] === 'strings' &&
    new StringsTranslate({ original: row[2], translate: row[3], tag: row[5], comments: row[6] })) ||
  null;

const tryParseDialogs = (row: SpreedSheetRow): SayTranslate | null => {
  if (!/[\S]+_[\da-f]{8}/.test(row[0])) return null;
  const attrs = row[1].split(' ');
  const character = attrs.filter(s => s != 'nointeract').join(' ');
  const nointeract = attrs.some(s => s === 'nointeract');
  return new SayTranslate({
    id: row[0],
    character,
    original: row[2],
    translate: row[3],
    nointeract,
    tag: row[5],
    comments: row[6],
  });
};

const tryParseFiles = (row: SpreedSheetRow): FileTranslate | null =>
  (/.txt$/.test(row[0]) &&
    new FileTranslate({
      id: row[0],
      original: row[2],
      translate: row[3],
      tag: row[5],
      comments: row[6],
    })) ||
  null;

/**
 * スプレッドシートから Translate 配列を生成します。
 * @param スプレッドシートのデータ (x: 4, y: n)
 */
export function fromSpreadsheet(s: SpreedSheetRow[]): SpreadSheetTranslates {
  return s
    .map(
      row =>
        tryParseIgnore(row) || tryParseStrings(row) || tryParseDialogs(row) || tryParseFiles(row),
    )
    .filter(<T>(x: T | null): x is T => !!x);
}
