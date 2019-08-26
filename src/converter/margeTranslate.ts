import { IgnoreTranslate } from '../transrate/ignoreTranslate';
import { Translate } from '../transrate/translate';

function firstAtIndex<T>(array: T[], callbackfn: (item: T) => boolean): number | null {
  for (let i = 0; i < array.length; i++) if (callbackfn(array[i])) return i;
  return null;
}

/**
 * 任意の Translate インスタンスを IgnoreTranslate インスタンスに変換する
 * @param before 変換元となる任意の Translate インスタンス
 */
function convertIgnoreTranslate(before: Translate): IgnoreTranslate {
  if (before instanceof IgnoreTranslate) return before;
  const { original, translate, comments } = before;
  return new IgnoreTranslate({ original, translate, tag: '削除', comments });
}

/**
 * 2 つの Translate 配列を合成して 1つの Translate 配列にします。
 * @param sheets 翻訳を残す側の Translate 配列
 * @param scripts 翻訳以外を残す側の Translate 配列
 */
export function margeTranslate(sheets: Translate[], scripts: Translate[]): Translate[] {
  const befores = [...sheets];
  return scripts.reduce<Translate[]>((array, after) => {
    const matchIndex = firstAtIndex(befores, before => before.original == after.original);
    const match = matchIndex != null && befores.splice(0, matchIndex + 1);
    if (match) {
      const marge = after.marge(match.splice(-1, 1)[0]);
      const ignores = match.map(convertIgnoreTranslate);
      array.push(...ignores, marge);
    } else array.push(after);
    return array;
  }, []);
}
