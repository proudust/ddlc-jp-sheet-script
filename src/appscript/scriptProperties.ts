/**
 * 未加工のスクリプトのプロパティを表します。
 */
interface RawScriptProperties {
  /** 出力フォルダ名 */
  FOLDER_NAME: string;
  /** タグの名称 (カンマ区切り) */
  TAG_NAMES: string;
  /** タグの色 (カラーコード表記、カンマ区切り) */
  TAG_COLORS: string;
  /** スクリプト出力から除外するシートの色 */
  NOT_CONVERT_COLORS: string;
}

/**
 * スクリプトのプロパティをパースしたオブジェクトを返します。
 */
export class ScriptProperties {
  /** 未加工のスクリプトのプロパティ */
  private readonly raw = PropertiesService.getScriptProperties().getProperties() as RawScriptProperties;

  /** 出力フォルダ名 */
  public readonly folderName = this.getValue('FOLDER_NAME');

  /** タグの配列 */
  public readonly tags = this.getValue('TAG_NAMES')
    .split(',')
    .map((name, index) => ({
      name,
      color: this.getValue('TAG_COLORS').split(',')[index],
    }));

  public readonly notConvertColor = this.raw.NOT_CONVERT_COLORS
    ? this.raw.NOT_CONVERT_COLORS.toLowerCase()
    : undefined;

  /**
   * 未加工のスクリプトのプロパティから値を取得します。
   * @throws 指定のプロパティが未定義の場合、エラーをスローします。
   */
  private getValue(key: keyof RawScriptProperties): RawScriptProperties[typeof key] {
    const value: RawScriptProperties[typeof key] | null | undefined = this.raw[key];
    if (value === null || typeof value === 'undefined')
      throw Error(`${key} is not defined in the script property.`);
    return value;
  }
}
