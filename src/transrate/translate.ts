export default interface Translate {
  /** 識別子 */
  id: string;
  /** 属性 (ignore で無視) */
  attribute: string;
  /** 原文 */
  original: string;
  /** 翻訳 */
  translate: string;

  /**
   * Translate インスタンスをスクリプトまたはファイルに変換する。
   * @returns string ならスクリプト、object ならファイルを表す。
   */
  inflate(): string | { fileName: string; content: string };
}
