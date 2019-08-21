import Translate from '../transrate/translate';
import DialogsTranslate from '../transrate/dialogsTranslate';
import FileTranslate from '../transrate/fileTranslate';
import IgnoreTranslate from '../transrate/ignoreTranslate';
import StringsTranslate from '../transrate/stringsTranslate';

type SpreedSheetRow = [string, string, string, string, ...string[]];

const tryParseIgnore = (row: SpreedSheetRow): IgnoreTranslate | null =>
  (row[0] === '' && row[1] === '' && new IgnoreTranslate(row[2], row[3], row[5], row[6])) || null;

const tryParseStrings = (row: SpreedSheetRow): StringsTranslate | null =>
  (row[1] === 'strings' && new StringsTranslate(row[2], row[3], row[5], row[6])) || null;

const tryParseDialogs = (row: SpreedSheetRow): DialogsTranslate | null => {
  if (!/[\S]+_[\da-f]{8}/.test(row[0])) return null;
  const attrs = row[1].split(' ');
  const character = attrs.filter(s => s != 'nointeract').join(' ');
  const nointeract = attrs.some(s => s === 'nointeract');
  return new DialogsTranslate(row[0], character, row[2], row[3], nointeract, row[5], row[6]);
};

const tryParseFiles = (row: SpreedSheetRow): FileTranslate | null =>
  (/.txt$/.test(row[0]) && new FileTranslate(row[0], row[2], row[3], row[5], row[6])) || null;

export default {
  /**
   * スプレッドシートから Translate 配列に変換する
   * @param スプレッドシートのデータ (x: 4, y: n)
   */
  convert: (s: SpreedSheetRow[]): Translate[] => {
    return s
      .map(
        row =>
          tryParseIgnore(row) || tryParseStrings(row) || tryParseDialogs(row) || tryParseFiles(row),
      )
      .filter(<T>(x: T | null): x is T => !!x);
  },
};
