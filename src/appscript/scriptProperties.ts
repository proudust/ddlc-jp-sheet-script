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
export default class ScriptProperties {
  private readonly raw = PropertiesService.getScriptProperties().getProperties() as RawScriptProperties;

  public readonly folderName = this.raw.FOLDER_NAME;
  public readonly tags = this.raw.TAG_NAMES.split(',').map((name, index) => ({
    name,
    color: this.raw.TAG_COLORS.split(',')[index],
  }));
}
