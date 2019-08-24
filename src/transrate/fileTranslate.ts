import { Translate } from './translate';

export class FileTranslate implements Translate {
  /** ファイル名 */
  public readonly id: string;
  /** 属性 */
  public readonly attribute = 'file';
  /** 原文 */
  public readonly original: string;
  /** 翻訳 */
  public readonly translate: string;
  /** 翻訳所で付けられたタグ */
  public readonly tag: string;
  /** 翻訳所で付けられたコメント */
  public readonly comments: string;

  /**
   * @param fileName 出力ファイル名
   * @param original 原文
   * @param translate 翻訳
   */
  public constructor(
    fileName: string,
    original: string,
    translate: string,
    tag?: string,
    comments?: string,
  ) {
    this.id = fileName;
    this.original = original;
    this.translate = translate;
    this.tag = tag || '';
    this.comments = comments || '';
  }

  /**
   * 引数の Translate インスタンスから翻訳をコピーした新しい Translate インスタンスを作成する。
   * @param theirs もう一つのマージ対象
   */
  public marge(theirs: Translate): FileTranslate {
    return new FileTranslate(this.id, this.original, theirs.translate, theirs.tag, theirs.comments);
  }

  /**
   * Translate インスタンスをファイルに変換する。
   * @returns 変換後のファイル名と内容
   */
  public inflate(): { fileName: string; content: string } {
    return {
      fileName: this.id,
      content: this.translate,
    };
  }
}
