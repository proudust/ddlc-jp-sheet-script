/**
 * 未加工のスクリプトのプロパティを表します。
 */
interface RawScriptProperties {
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

  public readonly tags = this.raw.TAG_NAMES.split(',').map((name, index) => ({
    name,
    color: this.raw.TAG_COLORS.split(',')[index],
  }));
}
