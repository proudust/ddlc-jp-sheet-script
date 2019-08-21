import Translate from './translate';

/**
 * スプレッドシート上の、翻訳に反映しない行
 */
export default class IgnoreTranslate implements Translate {
  /** 識別子 */
  public readonly id = '';
  /** 属性 */
  public readonly attribute = '';
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
  public constructor(original: string, translate: string, tag?: string, comments?: string) {
    this.original = original;
    this.translate = translate;
    this.tag = tag || '';
    this.comments = comments || '';
  }

  /**
   * 引数の Translate インスタンスから翻訳をコピーした新しい Translate インスタンスを作成する。
   * @param theirs もう一つのマージ対象
   */
  public marge(theirs: Translate): IgnoreTranslate {
    return new IgnoreTranslate(this.original, theirs.translate, theirs.tag, theirs.comments);
  }

  /**
   * Translate インスタンスをスクリプトに変換する。
   * @returns 変換後のスクリプト
   */
  public inflate(): string {
    return '';
  }
}
