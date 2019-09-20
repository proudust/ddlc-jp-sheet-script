import { SayTranslate } from '../transrate/sayTranslate';
import { StringsTranslate } from '../transrate/stringsTranslate';
import { MD5 } from '../util/md5';

/** Ren'Py ステートメント */
type Statement =
  | {
      type: 'return';
      block: number;
    }
  | {
      type: 'menu';
      block: number;
    }
  | {
      type: 'label';
      block: number;
      name: string;
    }
  | {
      type: 'say';
      block: number;
      code: string;
      attribute: string;
      original: string;
      lineNumber: number;
    }
  | {
      type: 'strings';
      block: number;
      original: string;
      lineNumber: number;
    };

/**
 * 正規表現の配列を順番に string#match の引数に渡し、null 以外が返されたらそれを返す。
 * @param regexps string#match の引数に渡す正規表現の配列
 * @param args string#match の対象になる文字列
 */
function match(regexps: RegExp[], args: string): RegExpMatchArray {
  for (const regexp of regexps) {
    const result = args.match(regexp);
    if (result) return result;
  }
  return [];
}

/**
 * Ren'Py スクリプトから Ren'Py ステートメント配列を生成します。
 * @param fileName Ren'Py スクリプトのファイル名
 * @param script Ren'Py スクリプトの内容
 * @param expansion 翻訳可能文字列としてマークする正規表現 (省略可能)
 * @returns Ren'Py ステートメント配列
 */
export function parseRenpyScript(
  fileName: string,
  script: string,
  expansion: RegExp[] = [],
): Statement[] {
  const stringsRegExp = [/^"([\s\S]+?)"(?: if .+)?:$/, /_\("([\s\S]+?)"\)/, ...expansion];
  return script
    .split('\n')
    .map((s, lineNumber) => ({
      block: (s.match(/^ */) || [''])[0].length / 4,
      code: s.trim(),
      lineNumber,
    }))
    .map<Statement | undefined>(({ code, block, lineNumber }) => {
      if (code.slice(0, 6) === 'return') return { type: 'return', block };
      if (code === 'menu:') return { type: 'menu', block };
      if (code.slice(0, 5) === 'label')
        return { type: 'label', block, name: code.slice(6).slice(0, -1) };
      if (code.slice(0, 4) === 'call') {
        const [, call, from] = code.match(/^call (\w+)(?:\(.+\))?(?: from (\w+))?/) || [];
        return { type: 'label', block, name: from || `_call_${call}` };
      }
      const [, attribute, say] = code.match(/^(?:(\w+(?: [\d\w]+)?) )?"([\s\S]+?)"$/) || [];
      if (say && say != '"')
        return { type: 'say', block, code, attribute, original: say, lineNumber };

      const [, strings] = match(stringsRegExp, code);
      if (strings) return { type: 'strings', block, original: strings, lineNumber };
    })
    .filter(<T>(x: T | undefined): x is T => !!x);
}

const ids: string[] = [];
/**
 * ラベル名とコードから ID を計算し返します。
 * @param label 直近のラベル名
 * @param code コード
 */
function getId(label: string, code: string, isNointeract: boolean): string {
  const hash = MD5(code + (isNointeract ? ' nointeract' : '') + '\r\n');
  const baseId = label + '_' + hash;
  let id = baseId;
  let i = 1;
  while (ids.some(s => s === id)) {
    id = baseId + '_' + i++;
  }
  ids.push(id);
  return id;
}

type RenPyTranslates = (SayTranslate | StringsTranslate)[];

/**
 * Ren'Py ステートメント配列から Translate 配列を生成します。
 * @param statements Ren'Py ステートメントの配列
 * @returns Translate 配列
 */
export function extractTranslate(statements: Statement[]): RenPyTranslates {
  let label = '';
  const menus: number[] = [];
  return statements.reduce<RenPyTranslates>((array, curr) => {
    const menuBlockLebel = menus ? menus[menus.length - 1] : null;

    if (curr.type === 'return') return array;

    if (curr.type === 'label') {
      label = curr.name;
      return array;
    }
    if (curr.block === 0) {
      label = '';
    }

    if (curr.type === 'menu') {
      menus.push(curr.block);
      return array;
    }
    if (menuBlockLebel && menuBlockLebel <= curr.block) {
      menus.pop();
    }

    if (curr.type === 'say') {
      const nointeract = menuBlockLebel != null && menuBlockLebel + 1 === curr.block;
      const id = getId(label, curr.code, nointeract);
      const { attribute, original } = curr;
      array.push(new SayTranslate({ id, character: attribute, original, nointeract }));
      return array;
    }

    if (curr.type === 'strings') {
      array.push(new StringsTranslate({ original: curr.original }));
      return array;
    }

    return array;
  }, []);
}

/**
 * Ren'Py スクリプトから Translate 配列を生成します。
 * @param fileName Ren'Py スクリプトのファイル名
 * @param script Ren'Py スクリプトの内容
 * @param expansion 翻訳可能文字列としてマークする正規表現 (省略可能)
 * @returns Translate 配列
 */
export function fromRenpyScript(
  fileName: string,
  script: string,
  expansion: RegExp[] = [],
): RenPyTranslates {
  const statements = parseRenpyScript(fileName, script, expansion);
  return extractTranslate(statements);
}
