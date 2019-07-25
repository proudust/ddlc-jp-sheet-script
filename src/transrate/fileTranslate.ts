import Translate from './translate';

export default class FileTranslate implements Translate {
  /** ファイル名 */
  public readonly id: string;
  /** 属性 */
  public readonly attribute = 'file';
  /** 原文 */
  public readonly original: string;
  /** 翻訳 */
  public readonly translate: string;

  /**
   * @param fileName 出力ファイル名
   * @param original 原文
   * @param translate 翻訳
   */
  public constructor(fileName: string, original: string, translate: string) {
    this.id = fileName;
    this.original = original;
    this.translate = translate;
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
