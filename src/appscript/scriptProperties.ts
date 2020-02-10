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
  /** ヒストリーの言語切替に必要な翻訳を生成する */
  INCLUDE_HISTORY_SUPPORT: string;
  /** GitHub のリポジトリ名 */
  GITHUB_REPOSITORY: string;
  /** GitHub の Personal access token */
  GITHUB_TOKEN: string;
}

function throwError(string: string): never {
  throw new Error(string);
}

export class ScriptProperties {
  public constructor(
    /** 未加工のスクリプトのプロパティ */
    private raw: Partial<RawScriptProperties>,
  ) {}

  /**
   * 未加工のスクリプトのプロパティから値を取得します。
   * @throws 指定のプロパティが未定義の場合、エラーをスローします。
   */
  private getValue<T extends keyof RawScriptProperties>(key: T): RawScriptProperties[T] {
    return this.raw[key] ?? throwError(`${key} is not defined in the script property.`);
  }

  /** 出力フォルダ名 */
  public get folderName(): string {
    return this.getValue('FOLDER_NAME');
  }

  /** タグの配列 */
  public get tags(): { name: string; color: string }[] {
    const names = this.getValue('TAG_NAMES').split(',');
    const colors = this.getValue('TAG_COLORS').split(',');
    return names.map((name, index) => ({
      name,
      color: colors[index],
    }));
  }

  /** スクリプト出力から除外するシートの色 */
  public get notConvertColor(): string | undefined {
    return this.raw.NOT_CONVERT_COLORS?.toLowerCase();
  }

  /** ヒストリーの言語切替に必要な翻訳を生成する */
  public get includeHistorySupport(): boolean {
    return (this.raw.INCLUDE_HISTORY_SUPPORT?.toLowerCase() ?? 'false') !== 'false';
  }

  /** GitHub のリポジトリ名 */
  public get githubRepository(): string {
    return this.getValue('GITHUB_REPOSITORY');
  }

  /** GitHub の Personal access token */
  public get githubToken(): string {
    return this.getValue('GITHUB_TOKEN');
  }
}

export function getScriptProperties(): ScriptProperties {
  const raw: Partial<RawScriptProperties> = PropertiesService.getScriptProperties().getProperties();
  return new ScriptProperties(raw);
}
