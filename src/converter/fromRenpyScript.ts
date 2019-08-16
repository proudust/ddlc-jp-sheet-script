import DialogsTranslate from '../transrate/dialogsTranslate';
import Translate from '../transrate/translate';
import Md5 from '../util/md5';
import StringsTranslate from '../transrate/stringsTranslate';

const ids: string[] = [];
/**
 * ラベル名とコードから ID を計算し返します。
 * @param label 直近のラベル名
 * @param code コード
 */
function getId(label: string, code: string, isNointeract: boolean): string {
  const hash = Md5(code + (isNointeract ? ' nointeract' : '') + '\r\n');
  const baseId = label + '_' + hash;
  let id = baseId;
  let i = 1;
  while (ids.some(s => s === id)) {
    id = baseId + '_' + i++;
  }
  ids.push(id);
  return id;
}

export default {
  convert: (script: string): Translate[] => {
    let label = '';
    const menus: number[] = [];
    return script
      .split('\n')
      .filter(s => s.length !== 0)
      .map(s => {
        return {
          blockLevel: (s.match(/^ */) || [''])[0].length / 4,
          code: s.trim(),
        };
      })
      .reduce<Translate[]>((array, curr) => {
        const { blockLevel, code } = curr;
        const menuBlockLebel = menus ? menus[menus.length - 1] : null;

        const labelMatch = code.match(/^label ([\w]+?):$/) || code.match(/^call .+? from (.+?)$/);
        if (labelMatch) {
          label = labelMatch[1];
          return array;
        }
        if (!labelMatch && blockLevel === 0) {
          label = '';
        }

        if (code === 'menu:') {
          menus.push(blockLevel);
          return array;
        }
        if (menuBlockLebel && menuBlockLebel <= blockLevel) {
          menus.pop();
        }

        const dialogMatch = label && code.match(/^(?:(\w+(?: [\d\w]+)?) )?"([\s\S]+?)"$/);
        if (dialogMatch) {
          const isNointeract = menuBlockLebel != null && menuBlockLebel + 1 === blockLevel;
          const id = getId(label, code, isNointeract);
          array.push(new DialogsTranslate(id, dialogMatch[1], dialogMatch[2], '', isNointeract));
          return array;
        }

        const stringsMatch =
          code.match(/^"([\s\S]+?)"(?: if .*)?:$/) || code.match(/_\("([\s\S]+?)"\)/);
        if (stringsMatch) {
          array.push(new StringsTranslate(stringsMatch[1], ''));
          return array;
        }

        return array;
      }, []);
  },
};
