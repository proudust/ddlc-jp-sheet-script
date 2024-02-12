import { dedent } from "npm:@qnighy/dedent@0.1.1";

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
}

abstract class Checker {
  public abstract name: string;
  public abstract check(row: CheckArgs): boolean;

  /**
   * チェック処理を実行します。
   */
  public exec(
    row: CheckArgs,
    sheetName: string,
    sheetRowNumber: number,
  ): string | undefined {
    if (!this.check(row)) return;
    return dedent`
      ${this.name}（${sheetName}:${sheetRowNumber}）
      ＩＤ: ${row.id}, ${row.attr}
      原文: ${row.original}
      翻訳: ${row.translate}
    `;
  }
}

/**
 * ID の書式が正しいことを確認します。
 */
export class IdFormatChecker extends Checker {
  public name = "IDの書式が不正です";
  public check({ id }: Pick<CheckArgs, "id">): boolean {
    return !!id && !/^\w+_[0-9a-f]{8}(_\d+)?$/.test(id);
  }
}

/**
 * 既知の属性のみが使われていることを確認します。
 */
export class UseUnknownAttributesChecker extends Checker {
  public name = "不明な属性が指定されています";
  public check({ attr }: Pick<CheckArgs, "attr">): boolean {
    const knownAttrs = ["m", "n", "s", "y", "strings", "extend"];
    return !!attr && !knownAttrs.includes(attr.split(" ")[0]);
  }
}

/**
 * 文字列からテキストタグを取り除いた文字列を取得します。
 * @param s 対象の文字列
 */
function removeTextTag(s: string): string {
  return s.replace(/\[[^\]]+]/g, "").replace(/{[^}]+}/g, "");
}

/**
 * 三点リーダーの訳を「……」に統一します。
 */
export class UnificationEllipsisChecker extends Checker {
  public name = '"..."の訳は「……」で統一します';
  public check({ translate }: Pick<CheckArgs, "translate">): boolean {
    const tagRemoved = removeTextTag(translate);
    return /(\.{3}|(^|[^…])…([^…]|$))/.test(tagRemoved);
  }
}

/**
 * {w}タグの中に空白文字があります。
 */
export class CantIncludeSpaceInWaitTagsChecker extends Checker {
  public name = "{w}タグの中を含むことはできません";
  public check({ translate }: Pick<CheckArgs, "translate">): boolean {
    const likeWaitTag = translate.match(/{\s*w\s*=[\d.\s]+}/g) ?? [];
    return likeWaitTag.some((s) => /\s+/.test(s));
  }
}

/**
 * 半角文字を全角文字に置き換えます。
 */
export class CantIncludeHalfWidthChecker extends Checker {
  public name = "半角文字を全角文字に置き換えます";
  public check({ translate }: Pick<CheckArgs, "translate">): boolean {
    const tagRemoved = removeTextTag(translate);
    return /[,，?!~]/.test(tagRemoved);
  }
}

const checkFuncs: Checker[] = [
  new IdFormatChecker(),
  new UseUnknownAttributesChecker(),
  new UnificationEllipsisChecker(),
  new CantIncludeSpaceInWaitTagsChecker(),
  new CantIncludeHalfWidthChecker(),
];

/**
 * シートに対して全てのチェックをします。
 */
export function checkAll(sheets: Sheet[]): string {
  return sheets
    .reduce<string[]>((errors, sheet) => {
      const sheetName = sheet.getName();
      const e = sheet
        .getRange("A3:F")
        .getValues()
        .reduce<string[]>((errors, [id, attr, original, translate], index) => {
          if (!original) return errors;
          const sheetRowNumber = index + 3;
          const args: CheckArgs = { id, attr, original, translate };
          const e = checkFuncs
            .map((f) => f.exec(args, sheetName, sheetRowNumber))
            .filter(<T>(r: T | undefined): r is T => Boolean(r));
          return errors.concat(e);
        }, []);
      return errors.concat(e);
    }, [])
    .join("\n\n");
}
