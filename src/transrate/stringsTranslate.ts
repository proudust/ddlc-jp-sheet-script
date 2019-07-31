import Translate from './translate';

export default class StringsTranslate implements Translate {
  /** 識別子 */
  public readonly id = '';
  /** 属性 */
  public readonly attribute = 'strings';
  /** 原文 */
  public readonly original: string;
  /** 翻訳 */
  public readonly translate: string;

  /**
   * @param original 原文
   * @param translate 翻訳
   */
  public constructor(original: string, translate: string) {
    this.original = original;
    this.translate = translate;
  }

  /**
   * Translate インスタンスをスクリプトに変換する。
   * @param before 一つ前に変換した Translate インスタンス、無い場合は null
   * @returns 変換後のスクリプト
   */
  public inflate(before: Translate | null): string {
    const prefix =
      !before || before.constructor.name != 'StringsTranslate'
        ? 'translate Japanese strings:\n'
        : '';
    if (!this.original.match(/\n/g)) {
      return `${prefix}    old "${this.original}"
    new "${this.translate}"
`;
    } else {
      return `${prefix}    old """\\
${this.original.replace(/"/g, '\\"')}"""
    new """\\
${this.translate}"""
`;
    }
  }
}
