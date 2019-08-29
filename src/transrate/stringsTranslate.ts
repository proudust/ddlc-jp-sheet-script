import { Translate } from './translate';

interface StringsTranslateConstructor {
  original: string;
  translate?: string;
  tag?: string;
  comments?: string;
}

export class StringsTranslate implements Translate {
  /** 識別子 */
  public readonly id = '';
  /** 属性 */
  public readonly attribute = 'strings';
  /** 原文 */
  public readonly original: string;
  /** 翻訳 */
  public readonly translate: string;
  /** 翻訳所で付けられたタグ */
  public readonly tag: string;
  /** 翻訳所で付けられたコメント */
  public readonly comments: string;

  /**
   * @param original 原文
   * @param translate 翻訳
   */
  public constructor({
    original,
    translate = '',
    tag = '',
    comments = '',
  }: StringsTranslateConstructor) {
    this.original = original;
    this.translate = translate;
    this.tag = tag;
    this.comments = comments;
  }

  /**
   * 引数の Translate インスタンスから翻訳をコピーした新しい Translate インスタンスを作成する。
   * @param theirs もう一つのマージ対象
   */
  public marge(theirs: Translate): StringsTranslate {
    const { original } = this;
    const { translate, tag, comments } = theirs;
    return new StringsTranslate({ original, translate, tag, comments });
  }

  /**
   * Translate インスタンスをスクリプトに変換する。
   * @param before 一つ前に変換した Translate インスタンス、無い場合は null
   * @returns 変換後のスクリプト
   */
  public inflate(): string {
    if (!this.original.match(/\n/g)) {
      return `    old "${this.original}"
    new "${this.translate}"
`;
    } else {
      return `    old """\\
${this.original.replace(/"/g, '\\"')}"""
    new """\\
${this.translate}"""
`;
    }
  }
}
