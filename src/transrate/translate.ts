export default interface Translate {
  /** クラス名 */
  constructor: { name: string };

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
   * @param before 一つ前に変換した Translate インスタンス、無い場合は null
   * @returns string ならスクリプト、object ならファイルを表す。
   */
  inflate(before: Translate | null): string | { fileName: string; content: string };
}
