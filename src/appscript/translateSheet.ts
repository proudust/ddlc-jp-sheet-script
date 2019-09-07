/** 翻訳シートの 1 レコード */
export class TranslateSheetRow {
  /** ID */
  public id: string;
  /** 属性 */
  public attribute: string;
  /** 翻訳 */
  public original: string;
  /** 機械翻訳 */
  public translate: string;
  /** タグ */
  public tag: string;
  /** コメント */
  public comments: string;
  /** 対応するシート名と行数 */
  public location: {
    /** 対応するシート名 */
    sheetName: string;
    /** 対応する行数 */
    rowNumber: number;
  };

  /**
   * @param row 翻訳シートの 1 行
   * @param sheetName 翻訳シートのシート名
   * @param rowNumber 翻訳シートの対応する行数
   */
  public constructor(row: string[], sheetName: string, rowNumber: number) {
    const [id = '', attribute = '', original = '', translate = '', , tag = '', comments = ''] = row;
    this.id = id;
    this.attribute = attribute;
    this.original = original;
    this.translate = translate;
    this.tag = tag;
    this.comments = comments;
    this.location = { sheetName, rowNumber };
  }
}

/** @type GoogleAppsScript.Spreadsheet.Sheet から @type TranslateSheet が依存するもののみ抽出したもの */
interface Sheet {
  getName(): string;
  getRange(a1Notation: string): { getValues(): string[][] };
  getTabColor(): string | null;
}

/** 翻訳シートの @type GoogleAppsScript.Spreadsheet.Sheet インスタンスのラッパークラス */
export class TranslateSheet {
  private sheet: Partial<Sheet>;

  /**
   * @param sheet @type GoogleAppsScript.Spreadsheet.Sheet のインスタンス
   */
  public constructor(sheet: Partial<Sheet>) {
    this.sheet = sheet;
  }

  /** シート名を取得 */
  public getName(): string {
    if (!this.sheet.getName) throw Error();
    return this.sheet.getName();
  }

  /** 翻訳シートの内容から @type TranslateSheetRow の配列を生成する。 */
  public getTranslateRows(): TranslateSheetRow[] {
    if (!this.sheet.getName || !this.sheet.getRange) throw Error();
    const sheetName = this.sheet.getName();
    return this.sheet
      .getRange('A3:G')
      .getValues()
      .map((row, index) => new TranslateSheetRow(row, sheetName, index + 3));
  }

  /** シート色を取得 */
  public getTabColor(): string | null {
    if (!this.sheet.getTabColor) throw Error();
    return this.sheet.getTabColor();
  }
}
