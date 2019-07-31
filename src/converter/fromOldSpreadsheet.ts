import Translate from '../transrate/translate';
import DialogsTranslate from '../transrate/dialogsTranslate';
import FileTranslate from '../transrate/fileTranslate';
import StringsTranslate from '../transrate/stringsTranslate';

export default {
  /**
   * 旧スプレッドシートから Translate 配列に変換する
   */
  convert: (s: string[][]): Translate[] => {
    return s.reduce<Translate[]>((array, curr) => {
      // strings
      if (curr[0] === 'strings') array.push(new StringsTranslate(curr[1], curr[2]));
      // dialogs
      else if (/[\S]+_[\da-f]{8}/.test(curr[0])) {
        const attrMatch = curr[1].match(/^[\w]+(?: [\w]+)?(?= ")/);
        const origMatch = curr[1].match(/^(?:[\w]+(?: [\w]+)? ")?([\s\S]+?)"?$/);
        const tranMatch = curr[2].match(/^(?:[\w]+(?: [\w]+)? ")?("[\s\S]+"|[\s\S]+?)"?$/);
        if (!origMatch || !tranMatch)
          throw new Error(`dialog not found. orig: ${curr[1]}, tran: ${curr[2]}`);
        const attr = attrMatch ? attrMatch[0] : '';
        array.push(new DialogsTranslate(curr[0], attr, origMatch[1], tranMatch[1]));
      }
      // file
      else if (/.txt$/.test(curr[0])) array.push(new FileTranslate(curr[0], curr[1], curr[2]));

      return array;
    }, []);
  },
};
