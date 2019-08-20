import Translate from '../transrate/translate';
import DialogsTranslate from '../transrate/dialogsTranslate';
import FileTranslate from '../transrate/fileTranslate';
import StringsTranslate from '../transrate/stringsTranslate';

type OldSpreedSheetRow = [string, string, string, ...string[]];

const tryParseStrings = (row: OldSpreedSheetRow): StringsTranslate | null =>
  (row[0] === 'strings' && new StringsTranslate(row[1], row[2])) || null;

const tryParseDialogs = (row: OldSpreedSheetRow): DialogsTranslate | null => {
  if (!/[\S]+_[\da-f]{8}/.test(row[0])) return null;
  const [, attributes = '', original = '', nointeract = ''] =
    row[1].match(/^(?:([\w]+(?: [\w]+)?) ")?([\s\S]+?)"?( nointeract)?$/) || [];
  const [, translate = ''] =
    row[2].match(/^(?:(?:[\w]+ )+")?("[\s\S]+"|[\s\S]+?)"?(?: nointeract)?$/) || [];
  if (!original || !translate)
    throw new Error(`dialog not found. orig: ${row[1]}, tran: ${row[2]}`);
  return new DialogsTranslate(row[0], attributes, original, translate, !!nointeract);
};

const tryParseFiles = (row: OldSpreedSheetRow): FileTranslate | null =>
  (/.txt$/.test(row[0]) && new FileTranslate(row[0], row[1], row[2])) || null;

export default {
  /**
   * 旧スプレッドシートから Translate 配列に変換する
   */
  convert: (s: OldSpreedSheetRow[]): Translate[] => {
    return s
      .map(row => tryParseStrings(row) || tryParseDialogs(row) || tryParseFiles(row))
      .filter(<T>(x: T | null): x is T => !!x);
  },
};
