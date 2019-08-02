import Translate from '../transrate/translate';
import DialogsTranslate from '../transrate/dialogsTranslate';
import FileTranslate from '../transrate/fileTranslate';
import StringsTranslate from '../transrate/stringsTranslate';

export default {
  /**
   * スプレッドシートから Translate 配列に変換する
   * @param スプレッドシートのデータ (x: 4, y: n)
   */
  convert: (s: string[][]): Translate[] => {
    return s.reduce<Translate[]>((array, curr) => {
      // strings
      if (curr[1] === 'strings') array.push(new StringsTranslate(curr[2], curr[3]));
      // dialogs
      else if (/[\S]+_[\da-f]{8}/.test(curr[0])) {
        const attrs = curr[1].split(' ');
        const character = attrs.filter(s => s != 'nointeract').join(' ');
        const nointeract = attrs.some(s => s === 'nointeract');
        array.push(new DialogsTranslate(curr[0], character, curr[2], curr[3], nointeract));
      }
      // file
      else if (/.txt$/.test(curr[0])) array.push(new FileTranslate(curr[0], curr[2], curr[3]));

      return array;
    }, []);
  },
};
