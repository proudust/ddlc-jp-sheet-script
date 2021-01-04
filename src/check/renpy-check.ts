import { trimIndent } from '../util/tags';

interface Range {
  getValues(): string[][];
}

interface Sheet {
  getName(): string;
  getRange(a1Notation: string): Range;
}

interface CheckArgs {
  id: string;
  attr: string;
  original: string;
  translate: string;
  sheetName: string;
  sheetRowNumber: number;
}

type CheckFunc = (args: CheckArgs) => string | undefined;

/**
 * ID の書式が正しくない場合、エラー文を返します。
 */
export const checkId: CheckFunc = ({ id, original, sheetName, sheetRowNumber }) => {
  const pattern = /^\w+_[0-9a-f]{8}(_\d+)?$/;
  if (id && original && !pattern.test(id)) {
    return trimIndent`
      IDの書式が間違っています。
      原文: ${id} (${sheetName}:${sheetRowNumber})
    `;
  }
};

/**
 * 不明な属性が入力されている場合、エラー文を返します。
 */
export const checkAttribute: CheckFunc = ({ attr, original, sheetName, sheetRowNumber }) => {
  const knownAttrs = ['m', 'n', 's', 'y', 'strings', 'extend'];
  if (attr && !knownAttrs.includes(attr.split(' ')[0])) {
    return trimIndent`
      属性をtypoしているかもしれません。
      原文: ${attr} "${original}" (${sheetName}:${sheetRowNumber})
    `;
  }
};

/**
 * 三点リーダーの訳を「……」に統一します。
 */
export const checkEllipsis: CheckFunc = ({ translate, sheetName, sheetRowNumber }) => {
  const tagRemoved = translate.replace(/\[[^\]]+]/g, '').replace(/{[^}]+}/g, '');
  if (/(\.{3}|(^|[^…])…([^…]|$))/.test(tagRemoved)) {
    return trimIndent`
        三点リーダーの訳は「……」に統一します。
        翻訳：${translate} (${sheetName}:${sheetRowNumber})
      `;
  }
};

/**
 * {w}タグの中に空白文字があります。
 */
export const checkWaitTag: CheckFunc = ({ translate, sheetName, sheetRowNumber }) => {
  const likeWaitTag = translate.match(/{\s*w\s*=[\d.\s]+}/g) ?? [];
  if (likeWaitTag.some(s => /\s+/.test(s))) {
    return trimIndent`
        {w}タグの中に空白文字があります。
        翻訳：${translate} (${sheetName}:${sheetRowNumber})
      `;
  }
};

/**
 * シートに対して全てのチェックをします。
 */
export function checkAll(sheets: Sheet[]): string {
  return sheets
    .reduce<string[]>((errors, sheet) => {
      const sheetName = sheet.getName();
      const e = sheet
        .getRange('A3:F')
        .getValues()
        .reduce<string[]>((errors, [id, attr, original, translate], index) => {
          const sheetRowNumber = index + 3;
          const args: CheckArgs = { id, attr, original, translate, sheetName, sheetRowNumber };
          const checkFuncs: CheckFunc[] = [checkId, checkAttribute, checkEllipsis, checkWaitTag];
          const e = checkFuncs
            .map(f => f(args))
            .filter(<T>(r: T | undefined): r is T => Boolean(r));
          return errors.concat(e);
        }, []);
      return errors.concat(e);
    }, [])
    .join('\n\n');
}
