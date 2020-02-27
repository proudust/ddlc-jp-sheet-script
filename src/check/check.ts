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
 * テキストタグの種類や数が原文と一致しない場合、エラー文を返します。
 */
export const checkTextTags: CheckFunc = ({
  id,
  original,
  translate,
  sheetName,
  sheetRowNumber,
}) => {
  function extractTextTag(dialogue: string): string[] {
    return dialogue.match(/{\w+}/g) ?? [];
  }

  if (id && translate) {
    const otags = extractTextTag(original);
    const ttags = extractTextTag(translate);
    const equal = otags.every((otag, index) => otag === ttags[index]);
    if (!equal) {
      return trimIndent`
        テキストタグが不足しています。
        原文：${original}
        翻訳：${translate} (${sheetName}:${sheetRowNumber})
      `;
    }
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
          const checkFuncs: CheckFunc[] = [checkId, checkAttribute, checkTextTags];
          const e = checkFuncs
            .map(f => f(args))
            .filter(<T>(r: T | undefined): r is T => Boolean(r));
          return errors.concat(e);
        }, []);
      return errors.concat(e);
    }, [])
    .join('\n\n');
}
