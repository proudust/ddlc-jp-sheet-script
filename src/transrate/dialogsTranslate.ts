import Translate from './translate';

export default class DialogsTranslate implements Translate {
  /** 識別子 (ラベル_ハッシュ) */
  public readonly id: string;
  /** 属性 (キャラクタ 立ち絵) */
  public readonly attribute: string;
  /** 原文 */
  public readonly original: string;
  /** 翻訳 */
  public readonly translate: string;

  /**
   * @param id ラベル名とハッシュを _ で繋いだ文字列
   * @param attribute キャラクターと立ち絵
   * @param original 原文
   * @param translate 翻訳
   */
  public constructor(id: string, attribute: string, original: string, translate: string) {
    this.id = id;
    this.attribute = attribute;
    this.original = original;
    this.translate = translate;
  }

  /**
   * Translate インスタンスをスクリプトに変換する。
   * @returns 変換後のスクリプト
   */
  public inflate(): string {
    const dialogs = this.translate.match(/"(.*?)"/g);
    // 台詞分割無し
    if (!dialogs) {
      return `translate Japanese ${this.id}:
    ${this.attribute} "${this.translate}"
`;
    }
    // 台詞分割あり
    else {
      return `translate Japanese ${this.id}:
    ${dialogs.map(d => (this.attribute ? `${this.attribute} ${d}` : d)).join('\n    ')}
`;
    }
  }
}
