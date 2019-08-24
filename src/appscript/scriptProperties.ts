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
}

/**
 * スクリプトのプロパティをパースします。
 */
export class ScriptProperties {
  private readonly raw = PropertiesService.getScriptProperties().getProperties() as RawScriptProperties;

  public readonly folderName = this.getValue('FOLDER_NAME');
  public readonly tags = this.getValue('TAG_NAMES')
    .split(',')
    .map((name, index) => ({
      name,
      color: this.getValue('TAG_COLORS').split(',')[index],
    }));

  private getValue(key: keyof RawScriptProperties): RawScriptProperties[typeof key] {
    const value = this.raw[key];
    if (value === null || typeof value === 'undefined')
      throw Error(`${key} is not defined in the script property.`);
    return value;
  }
}
