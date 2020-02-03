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
  /** GitHub のリポジトリ名 */
  GITHUB_REPOSITORY: string;
  /** GitHub の Personal access token */
  GITHUB_TOKEN: string;
}

type NullableRawScriptProperties = Partial<RawScriptProperties>;

/**
 * スクリプトのプロパティをパースしたオブジェクトを返します。
 */
export class ScriptProperties {
  /** 未加工のスクリプトのプロパティ */
  private readonly raw: NullableRawScriptProperties = PropertiesService.getScriptProperties().getProperties();

  /** 出力フォルダ名 */
  public readonly folderName = this.getValue('FOLDER_NAME');

  /** タグの配列 */
  public readonly tags = this.getValue('TAG_NAMES')
    .split(',')
    .map((name, index) => ({
      name,
      color: this.getValue('TAG_COLORS').split(',')[index],
    }));

  /** スクリプト出力から除外するシートの色 */
  public readonly notConvertColor = this.raw.NOT_CONVERT_COLORS
    ? this.raw.NOT_CONVERT_COLORS.toLowerCase()
    : undefined;

  /** GitHub のリポジトリ名 */
  public readonly githubRepository = this.getValue('GITHUB_REPOSITORY');

  /** GitHub の Personal access token */
  public readonly githubToken = this.getValue('GITHUB_TOKEN');

  /**
   * 未加工のスクリプトのプロパティから値を取得します。
   * @throws 指定のプロパティが未定義の場合、エラーをスローします。
   */
  private getValue<T extends keyof RawScriptProperties>(key: T): RawScriptProperties[T] {
    const value: RawScriptProperties[T] | null | undefined = this.raw[key];
    if (value === null || typeof value === 'undefined')
      throw Error(`${key} is not defined in the script property.`);
    return value;
  }
}
